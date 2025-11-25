// Data Import Module for DashCraft
//
// SECURITY NOTES:
// - All data processing is 100% client-side (browser only)
// - No data is ever sent to external servers
// - Data is stored in browser's localStorage (sandboxed to this domain)
// - All user input is sanitized before rendering to prevent XSS attacks
//

// Store imported data temporarily
let importedData = null;

// Security: Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Security: Maximum rows to prevent browser memory issues
const MAX_ROWS = 10000;

// Security: Allowed file types
const ALLOWED_FILE_TYPES = [
  "text/csv",
  "application/json",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const ALLOWED_EXTENSIONS = ["csv", "json", "xlsx", "xls"];

// Initialize data import functionality
document.addEventListener("DOMContentLoaded", () => {
  setupImportModal();
  setupFileUpload();
  setupGoogleSheets();
  setupPasteData();
});

// Setup import modal
function setupImportModal() {
  const importBtn = document.getElementById("importDataBtn");
  const modal = document.getElementById("importDataModal");
  const closeBtn = document.getElementById("closeImportModal");
  const tabs = document.querySelectorAll(".import-tab");

  if (importBtn) {
    importBtn.addEventListener("click", () => {
      modal.classList.add("active");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
      resetImportModal();
    });
  }

  // Tab switching
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab");

      // Update active tab
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Update content
      document.querySelectorAll(".import-content").forEach((content) => {
        content.classList.remove("active");
      });
      document.getElementById(`tab-${tabId}`).classList.add("active");
    });
  });

  // Close modal on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      resetImportModal();
    }
  });

  // Add widget button
  const addWidgetBtn = document.getElementById("addDataWidgetBtn");
  if (addWidgetBtn) {
    addWidgetBtn.addEventListener("click", addDataWidget);
  }
}

// Setup file upload
function setupFileUpload() {
  const dropZone = document.getElementById("fileDropZone");
  const fileInput = document.getElementById("fileInput");

  if (!dropZone || !fileInput) return;

  // Click to upload
  dropZone.addEventListener("click", () => {
    fileInput.click();
  });

  // File input change
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  // Drag and drop
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");

    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });
}

// Handle file upload
function handleFile(file) {
  // Security: Validate file size
  if (file.size > MAX_FILE_SIZE) {
    showError(
      `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    );
    return;
  }

  // Security: Validate file extension
  const extension = file.name.split(".").pop().toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    showError(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`);
    return;
  }

  // Security: Validate MIME type (if available)
  if (
    file.type &&
    !ALLOWED_FILE_TYPES.includes(file.type) &&
    file.type !== ""
  ) {
    // Some browsers don't set MIME type for CSV, so only warn if type is set but wrong
    console.warn("Unexpected MIME type:", file.type);
  }

  showLoadingState("Processing file...");

  if (extension === "csv") {
    parseCSVFile(file);
  } else if (extension === "json") {
    parseJSONFile(file);
  } else if (extension === "xlsx" || extension === "xls") {
    parseExcelFile(file);
  } else {
    showError("Unsupported file format. Please use CSV, JSON, or Excel files.");
  }
}

// Parse CSV file
function parseCSVFile(file) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      if (results.errors.length > 0) {
        showError("Error parsing CSV: " + results.errors[0].message);
        return;
      }

      // Security: Limit number of rows
      let rows = results.data;
      let truncated = false;
      if (rows.length > MAX_ROWS) {
        rows = rows.slice(0, MAX_ROWS);
        truncated = true;
      }

      // Security: Sanitize all data
      rows = rows.map((row) => sanitizeRow(row));
      const headers = results.meta.fields.map((h) => sanitizeString(h));

      importedData = {
        headers: headers,
        rows: rows,
        source: "csv",
        filename: sanitizeString(file.name),
        truncated: truncated,
        originalRowCount: results.data.length,
      };
      showDataPreview(importedData);
    },
    error: function (error) {
      showError("Error reading file: " + error.message);
    },
  });
}

// Parse JSON file
function parseJSONFile(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      let jsonData = JSON.parse(e.target.result);
      let rows, headers;

      // Handle array of objects
      if (Array.isArray(jsonData)) {
        if (jsonData.length === 0) {
          showError("JSON array is empty");
          return;
        }
        headers = Object.keys(jsonData[0]);
        rows = jsonData;
      }
      // Handle object with data array
      else if (jsonData.data && Array.isArray(jsonData.data)) {
        headers = Object.keys(jsonData.data[0]);
        rows = jsonData.data;
      }
      // Handle single object
      else if (typeof jsonData === "object") {
        headers = Object.keys(jsonData);
        rows = [jsonData];
      } else {
        showError("Invalid JSON structure");
        return;
      }

      // Security: Limit number of rows
      let truncated = false;
      const originalCount = rows.length;
      if (rows.length > MAX_ROWS) {
        rows = rows.slice(0, MAX_ROWS);
        truncated = true;
      }

      // Security: Sanitize all data
      rows = rows.map((row) => sanitizeRow(row));
      headers = headers.map((h) => sanitizeString(h));

      importedData = {
        headers: headers,
        rows: rows,
        source: "json",
        filename: sanitizeString(file.name),
        truncated: truncated,
        originalRowCount: originalCount,
      };

      showDataPreview(importedData);
    } catch (error) {
      showError("Error parsing JSON: " + error.message);
    }
  };
  reader.readAsText(file);
}

// Security: Sanitize a single string value
function sanitizeString(str) {
  if (str === null || str === undefined) return "";

  // Convert to string if not already
  str = String(str);

  // Remove any potential script tags or event handlers
  str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  str = str.replace(/on\w+\s*=/gi, "");

  // Limit string length to prevent memory issues
  if (str.length > 10000) {
    str = str.substring(0, 10000) + "...";
  }

  return str;
}

// Security: Sanitize an entire row object
function sanitizeRow(row) {
  const sanitized = {};
  for (const key in row) {
    if (Object.prototype.hasOwnProperty.call(row, key)) {
      const sanitizedKey = sanitizeString(key);
      sanitized[sanitizedKey] = sanitizeString(row[key]);
    }
  }
  return sanitized;
}

// Parse Excel file (basic support via CSV conversion message)
function parseExcelFile(file) {
  showError(
    "Excel files require the SheetJS library. For now, please convert to CSV or JSON format."
  );
  hideLoadingState();
}

// Setup Google Sheets integration
function setupGoogleSheets() {
  const loadBtn = document.getElementById("loadSheetsBtn");
  if (!loadBtn) return;

  loadBtn.addEventListener("click", loadGoogleSheet);
}

// Load Google Sheet
function loadGoogleSheet() {
  const urlInput = document.getElementById("sheetsUrl");
  const sheetNameInput = document.getElementById("sheetName");

  if (!urlInput.value.trim()) {
    showError("Please enter a Google Sheets URL or ID");
    return;
  }

  showLoadingState("Loading from Google Sheets...");

  // Extract sheet ID from URL
  let sheetId = urlInput.value.trim();

  // Security: Validate URL format
  const urlMatch = sheetId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch) {
    sheetId = urlMatch[1];
  } else if (!/^[a-zA-Z0-9-_]+$/.test(sheetId)) {
    showError("Invalid Google Sheets URL or ID format");
    return;
  }

  // Build the CSV export URL
  const sheetName = sheetNameInput.value.trim() || "Sheet1";
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    sheetName
  )}`;

  fetch(csvUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Could not access the sheet. Make sure it's publicly accessible."
        );
      }
      return response.text();
    })
    .then((csvText) => {
      // Security: Check response size
      if (csvText.length > MAX_FILE_SIZE) {
        throw new Error("Sheet data too large. Please use a smaller dataset.");
      }

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          if (results.errors.length > 0) {
            showError("Error parsing sheet data: " + results.errors[0].message);
            return;
          }

          // Security: Limit rows and sanitize
          let rows = results.data;
          let truncated = false;
          const originalCount = rows.length;

          if (rows.length > MAX_ROWS) {
            rows = rows.slice(0, MAX_ROWS);
            truncated = true;
          }

          rows = rows.map((row) => sanitizeRow(row));
          const headers = results.meta.fields.map((h) => sanitizeString(h));

          importedData = {
            headers: headers,
            rows: rows,
            source: "google-sheets",
            sheetId: sheetId,
            sheetName: sanitizeString(sheetName),
            truncated: truncated,
            originalRowCount: originalCount,
          };
          showDataPreview(importedData);
        },
      });
    })
    .catch((error) => {
      showError(error.message);
    });
}

// Setup paste data
function setupPasteData() {
  const parseBtn = document.getElementById("parsePastedBtn");
  if (!parseBtn) return;

  parseBtn.addEventListener("click", parsePastedData);
}

// Parse pasted data
function parsePastedData() {
  const textarea = document.getElementById("pasteData");
  let text = textarea.value.trim();

  if (!text) {
    showError("Please paste some data");
    return;
  }

  // Security: Limit input size
  if (text.length > MAX_FILE_SIZE) {
    showError("Pasted data too large. Please use a smaller dataset.");
    return;
  }

  showLoadingState("Parsing data...");

  Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      if (results.errors.length > 0 && results.data.length === 0) {
        showError("Error parsing data: " + results.errors[0].message);
        return;
      }

      // Security: Limit rows and sanitize
      let rows = results.data;
      let truncated = false;
      const originalCount = rows.length;

      if (rows.length > MAX_ROWS) {
        rows = rows.slice(0, MAX_ROWS);
        truncated = true;
      }

      rows = rows.map((row) => sanitizeRow(row));
      const headers = results.meta.fields.map((h) => sanitizeString(h));

      importedData = {
        headers: headers,
        rows: rows,
        source: "paste",
        truncated: truncated,
        originalRowCount: originalCount,
      };
      showDataPreview(importedData);
    },
  });
}

// Show data preview
function showDataPreview(data) {
  hideLoadingState();

  const preview = document.getElementById("dataPreview");
  const previewInfo = document.getElementById("previewInfo");
  const table = document.getElementById("previewTable");

  if (!preview || !table) return;

  // Show preview section
  preview.style.display = "block";

  // Update info with truncation warning if needed
  let infoText = `${data.rows.length} rows × ${data.headers.length} columns`;
  if (data.truncated) {
    infoText = `⚠️ Showing ${data.rows.length} of ${data.originalRowCount} rows (limited for performance)`;
  }
  previewInfo.textContent = infoText;

  // Build table
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  // Headers (already sanitized, but use escapeHtml for display)
  thead.innerHTML = `<tr>${data.headers
    .map((h) => `<th>${escapeHtml(h)}</th>`)
    .join("")}</tr>`;

  // Body (show first 10 rows, data already sanitized)
  const previewRows = data.rows.slice(0, 10);
  tbody.innerHTML = previewRows
    .map(
      (row) =>
        `<tr>${data.headers
          .map((h) => `<td>${escapeHtml(String(row[h] || ""))}</td>`)
          .join("")}</tr>`
    )
    .join("");

  // Add "more rows" indicator if needed
  if (data.rows.length > 10) {
    tbody.innerHTML += `<tr class="more-rows"><td colspan="${
      data.headers.length
    }">... and ${data.rows.length - 10} more rows</td></tr>`;
  }
}

// Add data widget to dashboard
function addDataWidget() {
  if (!importedData) {
    showError("No data to add");
    return;
  }

  const widgetType = document.getElementById("widgetTypeSelect").value;
  const modal = document.getElementById("importDataModal");

  // Add widget with data - use the new config format
  if (typeof addWidget === "function") {
    const canvas = document.getElementById("canvasGrid");
    const rect = canvas?.getBoundingClientRect() || { width: 800, height: 600 };

    addWidget(widgetType, {
      data: importedData,
      position: {
        x: rect.width / 2 - 200,
        y: 50,
        width: 400,
        height: widgetType === "chart" ? 300 : 350,
      },
    });
  }

  // Close modal and reset
  modal.classList.remove("active");
  resetImportModal();

  // Show success notification
  showNotification("Data widget added to dashboard!");
}

// Helper functions
function showLoadingState(message) {
  const preview = document.getElementById("dataPreview");
  if (preview) {
    preview.style.display = "block";
    preview.innerHTML = `
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>${message}</p>
      </div>
    `;
  }
}

function hideLoadingState() {
  const preview = document.getElementById("dataPreview");
  if (preview) {
    preview.innerHTML = `
      <div class="preview-header">
        <h4>Data Preview</h4>
        <span class="preview-info" id="previewInfo"></span>
      </div>
      <div class="preview-table-wrapper">
        <table class="preview-table" id="previewTable">
          <thead></thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="preview-actions">
        <select id="widgetTypeSelect" class="modal-input">
          <option value="datatable">Data Table Widget</option>
          <option value="chart">Chart Widget</option>
        </select>
        <button id="addDataWidgetBtn" class="btn btn-primary">
          Add to Dashboard
        </button>
      </div>
    `;

    // Rebind the add button
    const addBtn = document.getElementById("addDataWidgetBtn");
    if (addBtn) {
      addBtn.addEventListener("click", addDataWidget);
    }
  }
}

function showError(message) {
  hideLoadingState();

  const preview = document.getElementById("dataPreview");
  if (preview) {
    preview.style.display = "block";
    preview.innerHTML = `
      <div class="error-state">
        <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
        </svg>
        <p>${message}</p>
        <button class="btn btn-secondary" onclick="resetImportModal()">Try Again</button>
      </div>
    `;
  }
}

function resetImportModal() {
  importedData = null;

  // Reset file input
  const fileInput = document.getElementById("fileInput");
  if (fileInput) fileInput.value = "";

  // Reset other inputs
  const sheetsUrl = document.getElementById("sheetsUrl");
  if (sheetsUrl) sheetsUrl.value = "";

  const sheetName = document.getElementById("sheetName");
  if (sheetName) sheetName.value = "";

  const pasteData = document.getElementById("pasteData");
  if (pasteData) pasteData.value = "";

  // Hide preview
  const preview = document.getElementById("dataPreview");
  if (preview) {
    preview.style.display = "none";
    hideLoadingState();
  }

  // Reset tabs
  const tabs = document.querySelectorAll(".import-tab");
  const contents = document.querySelectorAll(".import-content");
  tabs.forEach((t, i) => {
    t.classList.toggle("active", i === 0);
  });
  contents.forEach((c, i) => {
    c.classList.toggle("active", i === 0);
  });
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "notification success";
  notification.innerHTML = `
    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
    </svg>
    <span>${message}</span>
  `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => notification.classList.add("show"), 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

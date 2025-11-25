// Widget Templates and Functions
const widgetTemplates = {
  clock: {
    title: "🕐 Clock",
    create: (id, data) => `
            <div class="widget" id="${id}" data-type="clock">
                <div class="widget-header">
                    <div class="widget-title">🕐 Clock</div>
                    <button class="widget-remove" onclick="removeWidget('${id}')">×</button>
                </div>
                <div class="widget-content">
                    <div style="font-size: 2.5rem; font-weight: bold; text-align: center;" id="${id}-time">12:00:00</div>
                    <div style="text-align: center; color: var(--text-light); margin-top: 0.5rem;" id="${id}-date">Loading...</div>
                </div>
            </div>
        `,
    init: (id) => {
      const updateClock = () => {
        const now = new Date();
        const timeEl = document.getElementById(`${id}-time`);
        const dateEl = document.getElementById(`${id}-date`);
        if (timeEl) {
          timeEl.textContent = now.toLocaleTimeString();
        }
        if (dateEl) {
          dateEl.textContent = now.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      };
      updateClock();
      setInterval(updateClock, 1000);
    },
  },

  weather: {
    title: "☁️ Weather",
    create: (id, data) => `
            <div class="widget" id="${id}" data-type="weather">
                <div class="widget-header">
                    <div class="widget-title">☁️ Weather</div>
                    <button class="widget-remove" onclick="removeWidget('${id}')">×</button>
                </div>
                <div class="widget-content">
                    <div style="text-align: center;">
                        <div style="font-size: 3rem;">☀️</div>
                        <div style="font-size: 2rem; font-weight: bold;">72°F</div>
                        <div style="color: var(--text-light);">Sunny</div>
                        <div style="color: var(--text-light); font-size: 0.875rem; margin-top: 0.5rem;">San Francisco, CA</div>
                    </div>
                </div>
            </div>
        `,
    init: (id) => {},
  },

  todo: {
    title: "✅ Todo List",
    create: (id, data) => `
            <div class="widget" id="${id}" data-type="todo">
                <div class="widget-header">
                    <div class="widget-title">✅ Todo List</div>
                    <button class="widget-remove" onclick="removeWidget('${id}')">×</button>
                </div>
                <div class="widget-content">
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <input type="text" id="${id}-input" placeholder="Add a task..." style="flex: 1; padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.375rem;">
                        <button onclick="addTodo('${id}')" style="padding: 0.5rem 1rem; background: var(--primary); color: white; border: none; border-radius: 0.375rem; cursor: pointer;">Add</button>
                    </div>
                    <div id="${id}-list" style="display: flex; flex-direction: column; gap: 0.5rem;"></div>
                </div>
            </div>
        `,
    init: (id) => {
      const input = document.getElementById(`${id}-input`);
      if (input) {
        input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") addTodo(id);
        });
      }
    },
  },

  notes: {
    title: "📝 Notes",
    create: (id, data) => `
            <div class="widget" id="${id}" data-type="notes">
                <div class="widget-header">
                    <div class="widget-title">📝 Notes</div>
                    <button class="widget-remove" onclick="removeWidget('${id}')">×</button>
                </div>
                <div class="widget-content">
                    <textarea id="${id}-textarea" placeholder="Write your notes here..." style="width: 100%; min-height: 150px; padding: 0.75rem; border: 1px solid var(--border); border-radius: 0.375rem; resize: vertical; font-family: inherit;"></textarea>
                </div>
            </div>
        `,
    init: (id) => {
      const textarea = document.getElementById(`${id}-textarea`);
      if (textarea) {
        textarea.addEventListener("input", () => {
          saveDashboard();
        });
      }
    },
  },

  calendar: {
    title: "📅 Calendar",
    create: (id, data) => `
            <div class="widget" id="${id}" data-type="calendar">
                <div class="widget-header">
                    <div class="widget-title">📅 Calendar</div>
                    <button class="widget-remove" onclick="removeWidget('${id}')">×</button>
                </div>
                <div class="widget-content">
                    <div id="${id}-calendar" style="text-align: center;">
                        <div style="font-weight: bold; margin-bottom: 1rem; font-size: 1.125rem;" id="${id}-month"></div>
                        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; font-size: 0.875rem;">
                            <div style="font-weight: 600;">Sun</div>
                            <div style="font-weight: 600;">Mon</div>
                            <div style="font-weight: 600;">Tue</div>
                            <div style="font-weight: 600;">Wed</div>
                            <div style="font-weight: 600;">Thu</div>
                            <div style="font-weight: 600;">Fri</div>
                            <div style="font-weight: 600;">Sat</div>
                            <div id="${id}-days"></div>
                        </div>
                    </div>
                </div>
            </div>
        `,
    init: (id) => {
      const now = new Date();
      const monthEl = document.getElementById(`${id}-month`);
      if (monthEl) {
        monthEl.textContent = now.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      }
      const daysEl = document.getElementById(`${id}-days`);
      if (daysEl) {
        const firstDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        ).getDay();
        const daysInMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        ).getDate();
        let html = "";
        for (let i = 0; i < firstDay; i++) html += "<div></div>";
        for (let i = 1; i <= daysInMonth; i++) {
          const isToday = i === now.getDate();
          html += `<div style="padding: 0.25rem; ${
            isToday
              ? "background: var(--primary); color: white; border-radius: 0.25rem; font-weight: bold;"
              : ""
          }">${i}</div>`;
        }
        daysEl.innerHTML = html;
      }
    },
  },

  timer: {
    title: "⏱️ Timer",
    create: (id, data) => `
            <div class="widget" id="${id}" data-type="timer">
                <div class="widget-header">
                    <div class="widget-title">⏱️ Timer</div>
                    <button class="widget-remove" onclick="removeWidget('${id}')">×</button>
                </div>
                <div class="widget-content">
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; font-weight: bold; margin-bottom: 1rem;" id="${id}-display">05:00</div>
                        <div style="display: flex; gap: 0.5rem; justify-content: center;">
                            <button onclick="startTimer('${id}')" style="padding: 0.5rem 1rem; background: var(--primary); color: white; border: none; border-radius: 0.375rem; cursor: pointer;">Start</button>
                            <button onclick="pauseTimer('${id}')" style="padding: 0.5rem 1rem; background: var(--text-light); color: white; border: none; border-radius: 0.375rem; cursor: pointer;">Pause</button>
                            <button onclick="resetTimer('${id}')" style="padding: 0.5rem 1rem; background: var(--border); color: var(--text); border: none; border-radius: 0.375rem; cursor: pointer;">Reset</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
    init: (id) => {
      window[`${id}_time`] = 300; // 5 minutes in seconds
      window[`${id}_interval`] = null;
    },
  },

  quote: {
    title: "💬 Quote",
    create: (id, data) => `
            <div class="widget" id="${id}" data-type="quote">
                <div class="widget-header">
                    <div class="widget-title">💬 Quote of the Day</div>
                    <button class="widget-remove" onclick="removeWidget('${id}')">×</button>
                </div>
                <div class="widget-content">
                    <div style="text-align: center; font-style: italic; font-size: 1.125rem; line-height: 1.6;">
                        <div style="margin-bottom: 1rem;">"The only way to do great work is to love what you do."</div>
                        <div style="color: var(--text-light); font-size: 0.875rem;">— Steve Jobs</div>
                    </div>
                </div>
            </div>
        `,
    init: (id) => {},
  },

  links: {
    title: "🔗 Quick Links",
    create: (id, data) => `
            <div class="widget" id="${id}" data-type="links">
                <div class="widget-header">
                    <div class="widget-title">🔗 Quick Links</div>
                    <button class="widget-remove" onclick="removeWidget('${id}')">×</button>
                </div>
                <div class="widget-content">
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <a href="https://google.com" target="_blank" style="padding: 0.75rem; background: var(--bg-light); border-radius: 0.375rem; text-decoration: none; color: var(--text); display: flex; align-items: center; gap: 0.5rem;">
                            <span>🔍</span>
                            <span>Google</span>
                        </a>
                        <a href="https://github.com" target="_blank" style="padding: 0.75rem; background: var(--bg-light); border-radius: 0.375rem; text-decoration: none; color: var(--text); display: flex; align-items: center; gap: 0.5rem;">
                            <span>💻</span>
                            <span>GitHub</span>
                        </a>
                        <a href="https://youtube.com" target="_blank" style="padding: 0.75rem; background: var(--bg-light); border-radius: 0.375rem; text-decoration: none; color: var(--text); display: flex; align-items: center; gap: 0.5rem;">
                            <span>📺</span>
                            <span>YouTube</span>
                        </a>
                    </div>
                </div>
            </div>
        `,
    init: (id) => {},
  },

  datatable: {
    title: "📊 Data Table",
    create: (id, config) => {
      // Support both old format (data directly) and new format (data in config.data)
      const data = config?.data || config;
      const hasData = data && data.headers && data.rows;
      const headers = hasData
        ? data.headers
        : ["Column 1", "Column 2", "Column 3"];
      const rows = hasData
        ? data.rows.slice(0, 10)
        : [
            { "Column 1": "Sample", "Column 2": "Data", "Column 3": "Here" },
            { "Column 1": "Add", "Column 2": "Your", "Column 3": "Data" },
          ];
      const totalRows = hasData ? data.rows.length : 2;
      const sourceName = hasData
        ? data.filename || data.sheetName || data.source
        : "Sample Data";

      return `
        <div class="widget widget-large" id="${id}" data-type="datatable">
          <div class="widget-header">
            <div class="widget-title">📊 Data Table</div>
            <div class="widget-actions">
              <span class="widget-source">${sourceName}</span>
              <button class="widget-remove" onclick="removeWidget('${id}')">×</button>
            </div>
          </div>
          <div class="widget-content">
            <div class="data-table-container">
              <div class="data-table-toolbar">
                <input type="text" id="${id}-search" placeholder="Search..." class="data-search-input" onkeyup="filterDataTable('${id}')">
                <span class="data-info">${totalRows} rows</span>
              </div>
              <div class="data-table-wrapper">
                <table class="data-table" id="${id}-table">
                  <thead>
                    <tr>
                      ${headers
                        .map(
                          (h, i) =>
                            `<th onclick="sortDataTable('${id}', ${i})">${escapeHtmlWidget(
                              h
                            )} <span class="sort-icon">↕</span></th>`
                        )
                        .join("")}
                    </tr>
                  </thead>
                  <tbody>
                    ${rows
                      .map(
                        (row) =>
                          `<tr>${headers
                            .map(
                              (h) =>
                                `<td>${escapeHtmlWidget(
                                  String(row[h] || "")
                                )}</td>`
                            )
                            .join("")}</tr>`
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
              ${
                totalRows > 10
                  ? `<div class="data-table-footer">Showing 10 of ${totalRows} rows</div>`
                  : ""
              }
            </div>
          </div>
        </div>
      `;
    },
    init: (id, config) => {
      // Store data for filtering/sorting - support both old and new formats
      const data = config?.data || config;
      if (data) {
        window[`${id}_data`] = data;
      }
    },
  },

  chart: {
    title: "📈 Chart",
    create: (id, config) => {
      // Support both old format (data directly) and new format (data in config.data)
      const data = config?.data || config;
      const hasData = data && data.headers && data.rows;
      const sourceName = hasData
        ? data.filename || data.sheetName || data.source
        : "Sample Data";

      return `
        <div class="widget widget-large" id="${id}" data-type="chart">
          <div class="widget-header">
            <div class="widget-title">📈 Chart</div>
            <div class="widget-actions">
              <span class="widget-source">${sourceName}</span>
              <button class="widget-remove" onclick="removeWidget('${id}')">×</button>
            </div>
          </div>
          <div class="widget-content">
            <div class="chart-container">
              <div class="chart-toolbar">
                <select id="${id}-type" class="chart-select" onchange="updateChart('${id}')">
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                </select>
                ${
                  hasData
                    ? `
                <select id="${id}-x" class="chart-select" onchange="updateChart('${id}')">
                  ${data.headers
                    .map((h, i) => `<option value="${i}">${h}</option>`)
                    .join("")}
                </select>
                <select id="${id}-y" class="chart-select" onchange="updateChart('${id}')">
                  ${data.headers
                    .map(
                      (h, i) =>
                        `<option value="${i}" ${
                          i === 1 ? "selected" : ""
                        }>${h}</option>`
                    )
                    .join("")}
                </select>
                `
                    : ""
                }
              </div>
              <div class="chart-area" id="${id}-chart">
                <div class="chart-bars" id="${id}-bars"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    },
    init: (id, config) => {
      // Support both old and new formats
      const data = config?.data || config;
      if (data) {
        window[`${id}_data`] = data;
      }
      setTimeout(() => renderChart(id, data), 100);
    },
  },
};

// Helper function for escaping HTML
function escapeHtmlWidget(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Data table functions
function filterDataTable(widgetId) {
  const input = document.getElementById(`${widgetId}-search`);
  const table = document.getElementById(`${widgetId}-table`);
  if (!input || !table) return;

  const filter = input.value.toLowerCase();
  const rows = table.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(filter) ? "" : "none";
  });
}

function sortDataTable(widgetId, columnIndex) {
  const table = document.getElementById(`${widgetId}-table`);
  if (!table) return;

  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  // Toggle sort direction
  const currentDir = table.getAttribute("data-sort-dir") || "asc";
  const newDir = currentDir === "asc" ? "desc" : "asc";
  table.setAttribute("data-sort-dir", newDir);
  table.setAttribute("data-sort-col", columnIndex);

  rows.sort((a, b) => {
    const aVal = a.cells[columnIndex]?.textContent || "";
    const bVal = b.cells[columnIndex]?.textContent || "";

    // Try numeric sort first
    const aNum = parseFloat(aVal);
    const bNum = parseFloat(bVal);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return newDir === "asc" ? aNum - bNum : bNum - aNum;
    }

    // Fall back to string sort
    return newDir === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  // Re-append sorted rows
  rows.forEach((row) => tbody.appendChild(row));

  // Update sort icons
  const headers = table.querySelectorAll("th .sort-icon");
  headers.forEach((icon, i) => {
    if (i === columnIndex) {
      icon.textContent = newDir === "asc" ? "↑" : "↓";
    } else {
      icon.textContent = "↕";
    }
  });
}

// Chart functions
function renderChart(widgetId, data) {
  const chartArea = document.getElementById(`${widgetId}-bars`);
  if (!chartArea) return;

  const chartType = document.getElementById(`${widgetId}-type`)?.value || "bar";

  // Use stored data or sample data
  const chartData = window[`${widgetId}_data`] ||
    data || {
      headers: ["Category", "Value"],
      rows: [
        { Category: "A", Value: 30 },
        { Category: "B", Value: 50 },
        { Category: "C", Value: 80 },
        { Category: "D", Value: 40 },
        { Category: "E", Value: 65 },
      ],
    };

  const xSelect = document.getElementById(`${widgetId}-x`);
  const ySelect = document.getElementById(`${widgetId}-y`);

  const xIndex = xSelect ? parseInt(xSelect.value) : 0;
  const yIndex = ySelect ? parseInt(ySelect.value) : 1;

  const xHeader = chartData.headers[xIndex];
  const yHeader = chartData.headers[yIndex];

  // Extract chart values
  const chartValues = chartData.rows.slice(0, 10).map((row) => ({
    label: String(row[xHeader] || ""),
    value: parseFloat(row[yHeader]) || 0,
  }));

  const maxValue = Math.max(...chartValues.map((v) => v.value), 1);

  if (chartType === "bar") {
    chartArea.innerHTML = chartValues
      .map(
        (item) => `
      <div class="chart-bar-group">
        <div class="chart-bar" style="height: ${
          (item.value / maxValue) * 100
        }%;">
          <span class="chart-bar-value">${item.value}</span>
        </div>
        <span class="chart-bar-label">${item.label}</span>
      </div>
    `
      )
      .join("");
  } else if (chartType === "line") {
    const points = chartValues.map((item, i) => {
      const x = (i / (chartValues.length - 1 || 1)) * 100;
      const y = 100 - (item.value / maxValue) * 100;
      return { x, y, label: item.label, value: item.value };
    });

    const pathD = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    chartArea.innerHTML = `
      <svg class="line-chart" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="${pathD}" fill="none" stroke="var(--primary)" stroke-width="2"/>
        ${points
          .map(
            (p) =>
              `<circle cx="${p.x}" cy="${p.y}" r="3" fill="var(--primary)"/>`
          )
          .join("")}
      </svg>
      <div class="line-labels">
        ${points.map((p) => `<span>${p.label}</span>`).join("")}
      </div>
    `;
  } else if (chartType === "pie") {
    const total = chartValues.reduce((sum, v) => sum + v.value, 0);
    let currentAngle = 0;
    const colors = [
      "#6366f1",
      "#8b5cf6",
      "#ec4899",
      "#f59e0b",
      "#10b981",
      "#3b82f6",
      "#ef4444",
      "#84cc16",
    ];

    const slices = chartValues.map((item, i) => {
      const angle = (item.value / total) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;

      const startRad = ((startAngle - 90) * Math.PI) / 180;
      const endRad = ((currentAngle - 90) * Math.PI) / 180;

      const x1 = 50 + 40 * Math.cos(startRad);
      const y1 = 50 + 40 * Math.sin(startRad);
      const x2 = 50 + 40 * Math.cos(endRad);
      const y2 = 50 + 40 * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      return `<path d="M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${
        colors[i % colors.length]
      }"/>`;
    });

    chartArea.innerHTML = `
      <svg class="pie-chart" viewBox="0 0 100 100">
        ${slices.join("")}
      </svg>
      <div class="pie-legend">
        ${chartValues
          .map(
            (item, i) => `
          <div class="legend-item">
            <span class="legend-color" style="background: ${
              colors[i % colors.length]
            }"></span>
            <span>${item.label}: ${item.value}</span>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }
}

function updateChart(widgetId) {
  renderChart(widgetId);
}

// Helper functions for widgets
function addTodo(widgetId) {
  const input = document.getElementById(`${widgetId}-input`);
  const list = document.getElementById(`${widgetId}-list`);

  if (input && list && input.value.trim()) {
    const todoId = Date.now();
    const todoItem = document.createElement("div");
    todoItem.style.cssText =
      "display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: var(--bg-light); border-radius: 0.375rem;";
    todoItem.innerHTML = `
            <input type="checkbox" onchange="saveDashboard()" style="cursor: pointer;">
            <span style="flex: 1;">${input.value}</span>
            <button onclick="this.parentElement.remove(); saveDashboard();" style="background: none; border: none; color: var(--text-light); cursor: pointer;">×</button>
        `;
    list.appendChild(todoItem);
    input.value = "";
    saveDashboard();
  }
}

function startTimer(id) {
  if (!window[`${id}_interval`]) {
    window[`${id}_interval`] = setInterval(() => {
      if (window[`${id}_time`] > 0) {
        window[`${id}_time`]--;
        updateTimerDisplay(id);
      } else {
        pauseTimer(id);
        alert("Timer finished!");
      }
    }, 1000);
  }
}

function pauseTimer(id) {
  if (window[`${id}_interval`]) {
    clearInterval(window[`${id}_interval`]);
    window[`${id}_interval`] = null;
  }
}

function resetTimer(id) {
  pauseTimer(id);
  window[`${id}_time`] = 300;
  updateTimerDisplay(id);
}

function updateTimerDisplay(id) {
  const display = document.getElementById(`${id}-display`);
  if (display) {
    const minutes = Math.floor(window[`${id}_time`] / 60);
    const seconds = window[`${id}_time`] % 60;
    display.textContent = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }
}

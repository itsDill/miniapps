// Dashboard Builder Main Script

// State
let dashboards = {};
let currentDashboardId = "default";
let widgetCounter = 0;
let draggedWidget = null;
let draggedWidgetType = null;
let pendingWidgetDrop = null; // For storing drop position before config
let activeResizeWidget = null;
let resizeStartX, resizeStartY, resizeStartW, resizeStartH;
let isUserLoggedIn = false;

// Sensor widget types that require login
const sensorWidgets = [
  "soilMoisture",
  "temperature",
  "cropHealth",
  "weatherStation",
  "sensorStatus",
  "irrigationControl",
  "yieldForecast",
];

// Check if user is logged in
function checkLoginStatus() {
  const userData = localStorage.getItem("agrisense-user");
  if (userData) {
    const user = JSON.parse(userData);
    isUserLoggedIn = user.loggedIn === true;
  }

  // Show/hide trial banner
  const trialBanner = document.getElementById("trialBanner");
  if (trialBanner) {
    trialBanner.style.display = isUserLoggedIn ? "none" : "block";
  }

  return isUserLoggedIn;
}

// Show login modal
function showLoginModal() {
  const modal = document.getElementById("loginModal");
  if (modal) {
    modal.classList.add("active");
  }
}

// Close login modal
function closeLoginModal() {
  const modal = document.getElementById("loginModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

// Check if widget requires login
function requiresLogin(widgetType) {
  return sensorWidgets.includes(widgetType) && !isUserLoggedIn;
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  loadDashboards();
  setupEventListeners();
  setupFreeformDragAndDrop();
  setupWidgetConfigModal();
  loadTemplateIfNeeded();
  renderCurrentDashboard();
});

// Load dashboards from localStorage
function loadDashboards() {
  const saved = localStorage.getItem("dashcraft-dashboards");
  if (saved) {
    dashboards = JSON.parse(saved);
  } else {
    dashboards = {
      default: {
        name: "My Farm",
        widgets: [],
      },
    };
  }
}

// Save dashboards to localStorage
function saveDashboard() {
  localStorage.setItem("dashcraft-dashboards", JSON.stringify(dashboards));
}

// Save widget positions for free-form layout
function saveWidgetPositions() {
  const canvasGrid = document.getElementById("canvasGrid");
  if (!canvasGrid) return;

  const widgets = canvasGrid.querySelectorAll(".widget");

  widgets.forEach((widget) => {
    const widgetData = dashboards[currentDashboardId].widgets.find(
      (w) => w.id === widget.id,
    );
    if (widgetData) {
      widgetData.position = {
        x: parseInt(widget.style.left) || 0,
        y: parseInt(widget.style.top) || 0,
        width: parseInt(widget.style.width) || 300,
        height: parseInt(widget.style.height) || 200,
      };
    }
  });

  localStorage.setItem("dashcraft-dashboards", JSON.stringify(dashboards));
}

// Setup event listeners
function setupEventListeners() {
  // Widget buttons - click to add at center
  document.querySelectorAll(".widget-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const widgetType = btn.getAttribute("data-widget");

      // Check if sensor widget requires login
      if (requiresLogin(widgetType)) {
        showLoginModal();
        return;
      }

      // Open config modal for new widget at center
      const canvas = document.getElementById("canvasGrid");
      const rect = canvas.getBoundingClientRect();
      pendingWidgetDrop = {
        type: widgetType,
        x: rect.width / 2 - 150,
        y: rect.height / 2 - 100,
      };
      openWidgetConfigModal(widgetType);
    });
  });

  // New dashboard button
  document.getElementById("newDashboardBtn").addEventListener("click", () => {
    document.getElementById("newDashboardModal").classList.add("active");
  });

  // Create dashboard
  document
    .getElementById("createDashboardBtn")
    .addEventListener("click", createNewDashboard);

  // Cancel dashboard
  document
    .getElementById("cancelDashboardBtn")
    .addEventListener("click", () => {
      document.getElementById("newDashboardModal").classList.remove("active");
      document.getElementById("dashboardNameInput").value = "";
    });

  // Dashboard select
  document.getElementById("dashboardSelect").addEventListener("change", (e) => {
    currentDashboardId = e.target.value;
    renderCurrentDashboard();
  });

  // Dark mode toggle
  document
    .getElementById("darkModeBtn")
    .addEventListener("click", toggleDarkMode);

  // Enter key in modal
  document
    .getElementById("dashboardNameInput")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter") createNewDashboard();
    });
}

// Setup free-form drag and drop
function setupFreeformDragAndDrop() {
  const canvasGrid = document.getElementById("canvasGrid");
  if (!canvasGrid) return;

  // Sidebar widget buttons - drag to add new widgets
  document.querySelectorAll(".widget-btn").forEach((btn) => {
    btn.addEventListener("dragstart", (e) => {
      draggedWidgetType = btn.getAttribute("data-widget");
      draggedWidget = null;
      btn.classList.add("dragging");
      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.setData("text/plain", draggedWidgetType);

      // Create a ghost image
      const ghost = document.createElement("div");
      ghost.className = "drag-ghost";
      ghost.textContent = btn.querySelector("span:last-child").textContent;
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, 50, 25);
      setTimeout(() => ghost.remove(), 0);
    });

    btn.addEventListener("dragend", () => {
      btn.classList.remove("dragging");
      draggedWidgetType = null;
      canvasGrid.classList.remove("drag-over");
    });
  });

  // Canvas drop zone for free-form placement
  canvasGrid.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggedWidget ? "move" : "copy";
    canvasGrid.classList.add("drag-over");
  });

  canvasGrid.addEventListener("dragleave", (e) => {
    if (!canvasGrid.contains(e.relatedTarget)) {
      canvasGrid.classList.remove("drag-over");
    }
  });

  canvasGrid.addEventListener("drop", (e) => {
    e.preventDefault();
    canvasGrid.classList.remove("drag-over");

    const rect = canvasGrid.getBoundingClientRect();
    const x = e.clientX - rect.left - 150; // Center the widget
    const y = e.clientY - rect.top - 20;

    if (draggedWidgetType && !draggedWidget) {
      // Check if sensor widget requires login
      if (requiresLogin(draggedWidgetType)) {
        showLoginModal();
        draggedWidgetType = null;
        return;
      }

      // Store drop position and open config modal
      pendingWidgetDrop = {
        type: draggedWidgetType,
        x: Math.max(0, x),
        y: Math.max(0, y),
      };
      openWidgetConfigModal(draggedWidgetType);
      draggedWidgetType = null;
    }
  });
}

// Widget configuration modal
function setupWidgetConfigModal() {
  const modal = document.getElementById("widgetConfigModal");
  if (!modal) return;

  const closeBtn = document.getElementById("closeWidgetConfig");
  const cancelBtn = document.getElementById("cancelWidgetConfig");
  const createBtn = document.getElementById("createWidgetBtn");

  closeBtn?.addEventListener("click", closeWidgetConfigModal);
  cancelBtn?.addEventListener("click", closeWidgetConfigModal);
  createBtn?.addEventListener("click", createConfiguredWidget);

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeWidgetConfigModal();
  });

  // Color presets
  document.querySelectorAll(".color-preset").forEach((preset) => {
    preset.addEventListener("click", () => {
      document
        .querySelectorAll(".color-preset")
        .forEach((p) => p.classList.remove("active"));
      preset.classList.add("active");
      document.getElementById("widgetBgColor").value = preset.dataset.color;
    });
  });

  // Size presets
  document.querySelectorAll(".size-preset").forEach((preset) => {
    preset.addEventListener("click", () => {
      document
        .querySelectorAll(".size-preset")
        .forEach((p) => p.classList.remove("active"));
      preset.classList.add("active");
    });
  });
}

function openWidgetConfigModal(widgetType) {
  const modal = document.getElementById("widgetConfigModal");
  const title = document.getElementById("configWidgetType");
  const contentSection = document.getElementById("widgetContentConfig");

  if (!modal) return;

  // Set widget type title
  const widgetNames = {
    clock: "🕐 Clock",
    weather: "☁️ Weather",
    todo: "✅ Todo List",
    notes: "📝 Notes",
    calendar: "📅 Calendar",
    timer: "⏱️ Timer",
    quote: "💬 Quote",
    links: "🔗 Quick Links",
    datatable: "📊 Data Table",
    chart: "📈 Chart",
  };
  title.textContent = widgetNames[widgetType] || widgetType;

  // Show relevant content options based on widget type
  contentSection.innerHTML = getWidgetContentOptions(widgetType);

  // Reset form
  document.getElementById("widgetTitle").value = "";
  document.querySelectorAll(".color-preset").forEach((p, i) => {
    p.classList.toggle("active", i === 0);
  });
  document.querySelectorAll(".size-preset").forEach((p) => {
    p.classList.toggle("active", p.dataset.size === "medium");
  });

  modal.classList.add("active");
}

function getWidgetContentOptions(type) {
  switch (type) {
    case "clock":
      return `
        <div class="config-group">
          <label class="config-label">Time Format</label>
          <select id="clockFormat" class="config-select">
            <option value="12">12-hour</option>
            <option value="24">24-hour</option>
          </select>
        </div>
        <div class="config-group">
          <label class="config-label">Show Date</label>
          <input type="checkbox" id="clockShowDate" checked>
        </div>
      `;
    case "weather":
      return `
        <div class="config-group">
          <label class="config-label">City</label>
          <input type="text" id="weatherCity" class="config-input" placeholder="San Francisco">
        </div>
        <div class="config-group">
          <label class="config-label">Temperature Unit</label>
          <select id="weatherUnit" class="config-select">
            <option value="F">Fahrenheit (°F)</option>
            <option value="C">Celsius (°C)</option>
          </select>
        </div>
      `;
    case "todo":
      return `
        <div class="config-group">
          <label class="config-label">Initial Tasks (one per line)</label>
          <textarea id="todoInitial" class="config-textarea" rows="3" placeholder="Buy groceries&#10;Finish project&#10;Call mom"></textarea>
        </div>
      `;
    case "notes":
      return `
        <div class="config-group">
          <label class="config-label">Initial Note</label>
          <textarea id="notesInitial" class="config-textarea" rows="3" placeholder="Write something..."></textarea>
        </div>
      `;
    case "quote":
      return `
        <div class="config-group">
          <label class="config-label">Custom Quote (leave blank for random)</label>
          <textarea id="quoteText" class="config-textarea" rows="2" placeholder="The only way to do great work..."></textarea>
        </div>
        <div class="config-group">
          <label class="config-label">Author</label>
          <input type="text" id="quoteAuthor" class="config-input" placeholder="Steve Jobs">
        </div>
      `;
    case "links":
      return `
        <div class="config-group">
          <label class="config-label">Links (name|url, one per line)</label>
          <textarea id="linksInitial" class="config-textarea" rows="4" placeholder="Google|https://google.com&#10;GitHub|https://github.com"></textarea>
        </div>
      `;
    case "timer":
      return `
        <div class="config-group">
          <label class="config-label">Default Minutes</label>
          <input type="number" id="timerMinutes" class="config-input" value="5" min="1" max="120">
        </div>
      `;
    default:
      return `<p class="config-hint">No additional options for this widget.</p>`;
  }
}

function closeWidgetConfigModal() {
  const modal = document.getElementById("widgetConfigModal");
  modal?.classList.remove("active");
  pendingWidgetDrop = null;
}

function createConfiguredWidget() {
  if (!pendingWidgetDrop) return;

  // Get configuration values
  const title = document.getElementById("widgetTitle").value;
  const bgColor = document.getElementById("widgetBgColor").value;
  const activeSize = document.querySelector(".size-preset.active");
  const size = activeSize ? activeSize.dataset.size : "medium";

  // Get size dimensions
  const sizes = {
    small: { width: 200, height: 150 },
    medium: { width: 300, height: 200 },
    large: { width: 450, height: 300 },
  };
  const dimensions = sizes[size];

  // Gather content-specific config
  const contentConfig = gatherContentConfig(pendingWidgetDrop.type);

  // Create widget with config
  const config = {
    title,
    bgColor,
    size,
    ...contentConfig,
    position: {
      x: pendingWidgetDrop.x,
      y: pendingWidgetDrop.y,
      width: dimensions.width,
      height: dimensions.height,
    },
  };

  addWidget(pendingWidgetDrop.type, config);
  closeWidgetConfigModal();
}

function gatherContentConfig(type) {
  const config = {};

  switch (type) {
    case "clock":
      config.format = document.getElementById("clockFormat")?.value || "12";
      config.showDate =
        document.getElementById("clockShowDate")?.checked ?? true;
      break;
    case "weather":
      config.city =
        document.getElementById("weatherCity")?.value || "San Francisco";
      config.unit = document.getElementById("weatherUnit")?.value || "F";
      break;
    case "todo":
      config.initialTasks = document.getElementById("todoInitial")?.value || "";
      break;
    case "notes":
      config.initialNote = document.getElementById("notesInitial")?.value || "";
      break;
    case "quote":
      config.quoteText = document.getElementById("quoteText")?.value || "";
      config.quoteAuthor = document.getElementById("quoteAuthor")?.value || "";
      break;
    case "links":
      config.initialLinks =
        document.getElementById("linksInitial")?.value || "";
      break;
    case "timer":
      config.minutes =
        parseInt(document.getElementById("timerMinutes")?.value) || 5;
      break;
  }

  return config;
}

// Load template from URL if specified
function loadTemplateIfNeeded() {
  const urlParams = new URLSearchParams(window.location.search);
  const template = urlParams.get("template");

  if (template && templates[template]) {
    const templateData = templates[template];
    currentDashboardId = "default";
    dashboards[currentDashboardId] = {
      name: templateData.name,
      widgets: [],
    };

    templateData.widgets.forEach((widgetType) => {
      addWidget(widgetType);
    });
  }
}

// Templates
const templates = {
  productivity: {
    name: "Productivity Pro",
    widgets: ["todo", "timer", "notes", "clock"],
  },
  personal: {
    name: "Personal Hub",
    widgets: ["weather", "quote", "clock", "todo", "notes"],
  },
  developer: {
    name: "Developer Workspace",
    widgets: ["clock", "timer", "todo", "notes", "links"],
  },
  minimalist: {
    name: "Minimalist",
    widgets: ["clock", "quote", "notes"],
  },
  creator: {
    name: "Content Creator",
    widgets: ["todo", "quote", "timer", "notes"],
  },
  news: {
    name: "News & Information",
    widgets: ["clock", "weather", "links"],
  },
};

// Add widget to current dashboard with free-form positioning
function addWidget(type, config = {}) {
  const widgetId = `widget-${Date.now()}-${widgetCounter++}`;
  const template = widgetTemplates[type];

  if (!template) return;

  // Add to dashboard data
  if (!dashboards[currentDashboardId].widgets) {
    dashboards[currentDashboardId].widgets = [];
  }

  // Default position if not provided
  const position = config.position || {
    x: 20 + ((widgetCounter * 30) % 200),
    y: 20 + ((widgetCounter * 30) % 200),
    width: 300,
    height: 200,
  };

  const widgetData = {
    id: widgetId,
    type: type,
    config: config,
    position: position,
  };

  dashboards[currentDashboardId].widgets.push(widgetData);

  // Render widget
  const canvasGrid = document.getElementById("canvasGrid");

  updateEmptyState();

  const widgetDiv = document.createElement("div");
  widgetDiv.innerHTML = template.create(widgetId, config);
  const widgetElement = widgetDiv.firstElementChild;

  // Apply free-form positioning
  widgetElement.style.position = "absolute";
  widgetElement.style.left = `${position.x}px`;
  widgetElement.style.top = `${position.y}px`;
  widgetElement.style.width = `${position.width}px`;
  widgetElement.style.height = `${position.height}px`;

  // Apply custom background color if provided
  if (config.bgColor) {
    widgetElement.style.backgroundColor = config.bgColor;
  }

  // Apply custom title if provided
  if (config.title) {
    const titleElement = widgetElement.querySelector(".widget-title");
    if (titleElement) {
      titleElement.textContent = config.title;
    }
  }

  // Make widget draggable for repositioning
  makeWidgetDraggable(widgetElement);

  // Add resize handles
  addResizeHandles(widgetElement);

  canvasGrid.appendChild(widgetElement);

  // Initialize widget
  if (template.init) {
    template.init(widgetId, config);
  }

  saveDashboard();

  return widgetId;
}

// Update empty state visibility
function updateEmptyState() {
  const canvasGrid = document.getElementById("canvasGrid");
  const emptyState = document.getElementById("emptyState");

  if (!canvasGrid || !emptyState) return;

  const hasWidgets = canvasGrid.querySelectorAll(".widget").length > 0;
  emptyState.style.display = hasWidgets ? "none" : "flex";
}

// Remove widget
function removeWidget(widgetId) {
  const widget = document.getElementById(widgetId);
  if (widget) {
    widget.classList.add("removing");
    setTimeout(() => {
      widget.remove();
      updateEmptyState();
    }, 200);
  }

  // Remove from data
  if (dashboards[currentDashboardId].widgets) {
    dashboards[currentDashboardId].widgets = dashboards[
      currentDashboardId
    ].widgets.filter((w) => w.id !== widgetId);
  }

  saveDashboard();
}

// Make widget draggable for free-form repositioning
function makeWidgetDraggable(widget) {
  const header = widget.querySelector(".widget-header");
  if (!header) return;

  let isDragging = false;
  let startX, startY, startLeft, startTop;

  header.style.cursor = "grab";

  header.addEventListener("mousedown", (e) => {
    // Don't drag if clicking on buttons
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
      return;
    }

    isDragging = true;
    header.style.cursor = "grabbing";
    widget.classList.add("dragging-widget");

    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(widget.style.left) || 0;
    startTop = parseInt(widget.style.top) || 0;

    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const newLeft = Math.max(0, startLeft + dx);
    const newTop = Math.max(0, startTop + dy);

    widget.style.left = `${newLeft}px`;
    widget.style.top = `${newTop}px`;
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      header.style.cursor = "grab";
      widget.classList.remove("dragging-widget");
      saveWidgetPositions();
    }
  });
}

// Add resize handles to widget
function addResizeHandles(widget) {
  const handle = document.createElement("div");
  handle.className = "resize-handle";
  widget.appendChild(handle);

  let isResizing = false;

  handle.addEventListener("mousedown", (e) => {
    isResizing = true;
    activeResizeWidget = widget;
    resizeStartX = e.clientX;
    resizeStartY = e.clientY;
    resizeStartW = parseInt(widget.style.width) || 300;
    resizeStartH = parseInt(widget.style.height) || 200;

    widget.classList.add("resizing");
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing || activeResizeWidget !== widget) return;

    const dx = e.clientX - resizeStartX;
    const dy = e.clientY - resizeStartY;

    const newWidth = Math.max(150, resizeStartW + dx);
    const newHeight = Math.max(100, resizeStartH + dy);

    widget.style.width = `${newWidth}px`;
    widget.style.height = `${newHeight}px`;
  });

  document.addEventListener("mouseup", () => {
    if (isResizing && activeResizeWidget === widget) {
      isResizing = false;
      widget.classList.remove("resizing");
      activeResizeWidget = null;
      saveWidgetPositions();
    }
  });
}

// Render current dashboard with free-form positioning
function renderCurrentDashboard() {
  const canvasGrid = document.getElementById("canvasGrid");

  if (!canvasGrid) return;

  // Clear existing widgets but keep empty state
  const existingWidgets = canvasGrid.querySelectorAll(".widget");
  existingWidgets.forEach((w) => w.remove());

  const dashboard = dashboards[currentDashboardId];

  updateEmptyState();

  if (!dashboard || !dashboard.widgets || dashboard.widgets.length === 0) {
    updateDashboardSelect();
    return;
  }

  // Render widgets with their positions
  dashboard.widgets.forEach((widgetData) => {
    const template = widgetTemplates[widgetData.type];
    if (!template) return;

    const widgetDiv = document.createElement("div");
    widgetDiv.innerHTML = template.create(
      widgetData.id,
      widgetData.config || widgetData.data,
    );
    const widgetElement = widgetDiv.firstElementChild;

    // Apply free-form positioning
    const position = widgetData.position || {
      x: 20,
      y: 20,
      width: 300,
      height: 200,
    };
    widgetElement.style.position = "absolute";
    widgetElement.style.left = `${position.x}px`;
    widgetElement.style.top = `${position.y}px`;
    widgetElement.style.width = `${position.width}px`;
    widgetElement.style.height = `${position.height}px`;

    // Apply custom background color if provided
    if (widgetData.config?.bgColor) {
      widgetElement.style.backgroundColor = widgetData.config.bgColor;
    }

    // Apply custom title if provided
    if (widgetData.config?.title) {
      const titleElement = widgetElement.querySelector(".widget-title");
      if (titleElement) {
        titleElement.textContent = widgetData.config.title;
      }
    }

    makeWidgetDraggable(widgetElement);
    addResizeHandles(widgetElement);
    canvasGrid.appendChild(widgetElement);

    if (template.init) {
      template.init(widgetData.id, widgetData.config || widgetData.data);
    }
  });

  updateEmptyState();
  updateDashboardSelect();
}

// Update dashboard selector
function updateDashboardSelect() {
  const select = document.getElementById("dashboardSelect");
  select.innerHTML = "";

  Object.keys(dashboards).forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = dashboards[id].name;
    option.selected = id === currentDashboardId;
    select.appendChild(option);
  });
}

// Create new dashboard
function createNewDashboard() {
  const input = document.getElementById("dashboardNameInput");
  const name = input.value.trim();

  if (!name) return;

  const newId = `dashboard-${Date.now()}`;
  dashboards[newId] = {
    name: name,
    widgets: [],
  };

  currentDashboardId = newId;

  document.getElementById("newDashboardModal").classList.remove("active");
  input.value = "";

  saveDashboard();
  renderCurrentDashboard();
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const moonIcon = document.getElementById("moonIcon");
  const sunIcon = document.getElementById("sunIcon");

  if (document.body.classList.contains("dark-mode")) {
    moonIcon.style.display = "none";
    sunIcon.style.display = "block";
    localStorage.setItem("darkMode", "true");
  } else {
    moonIcon.style.display = "block";
    sunIcon.style.display = "none";
    localStorage.setItem("darkMode", "false");
  }
}

// Load dark mode preference
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
  document.getElementById("moonIcon").style.display = "none";
  document.getElementById("sunIcon").style.display = "block";
}

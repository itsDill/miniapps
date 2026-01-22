// Home Dashboard Builder Script

// State
let dashboards = {};
let currentDashboardId = "default";
let widgetCounter = 0;
let draggedWidget = null;
let draggedWidgetType = null;
let pendingWidgetDrop = null;
let activeResizeWidget = null;
let resizeStartX, resizeStartY, resizeStartW, resizeStartH;

// Widget presets for home automation - clean and simple
const widgetPresets = {
  aircon: {
    bgColor: "#e0f2fe",
    size: "medium",
    position: { width: 320, height: 280 },
  },
  lights: {
    bgColor: "#fef9c3",
    size: "medium",
    position: { width: 300, height: 240 },
  },
  roomTemp: {
    bgColor: "#fce7f3",
    size: "small",
    position: { width: 260, height: 200 },
  },
  energyUsage: {
    bgColor: "#dcfce7",
    size: "medium",
    position: { width: 340, height: 280 },
  },
  security: {
    bgColor: "#f1f5f9",
    size: "medium",
    position: { width: 320, height: 260 },
  },
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadDashboards();
  setupEventListeners();
  setupFreeformDragAndDrop();
  setupWidgetConfigModal();
  renderCurrentDashboard();
});

// Load dashboards from localStorage
function loadDashboards() {
  const saved = localStorage.getItem("homesense-dashboards");
  if (saved) {
    dashboards = JSON.parse(saved);
  } else {
    dashboards = {
      default: {
        name: "My Home",
        widgets: [],
      },
    };
  }
}

// Save dashboards to localStorage
function saveDashboard() {
  localStorage.setItem("homesense-dashboards", JSON.stringify(dashboards));
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

  localStorage.setItem("homesense-dashboards", JSON.stringify(dashboards));
}

// Setup event listeners
function setupEventListeners() {
  // Widget buttons - click to add immediately with presets at center
  document.querySelectorAll(".widget-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const widgetType = btn.getAttribute("data-widget");

      // Add widget immediately with presets at center
      const canvas = document.getElementById("canvasGrid");
      const rect = canvas.getBoundingClientRect();
      const preset = widgetPresets[widgetType] || {
        position: { width: 300, height: 200 },
      };

      const config = {
        bgColor: preset.bgColor || "#ffffff",
        size: preset.size || "medium",
        position: {
          x: rect.width / 2 - preset.position.width / 2,
          y: rect.height / 2 - preset.position.height / 2,
          width: preset.position.width,
          height: preset.position.height,
        },
      };

      addWidget(widgetType, config);
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
    const x = e.clientX - rect.left - 150;
    const y = e.clientY - rect.top - 20;

    if (draggedWidgetType && !draggedWidget) {
      // Add widget immediately with presets at drop location
      const preset = widgetPresets[draggedWidgetType] || {
        position: { width: 300, height: 200 },
      };

      const config = {
        bgColor: preset.bgColor || "#ffffff",
        size: preset.size || "medium",
        position: {
          x: Math.max(0, x),
          y: Math.max(0, y),
          width: preset.position.width,
          height: preset.position.height,
        },
      };

      addWidget(draggedWidgetType, config);
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

function closeWidgetConfigModal() {
  const modal = document.getElementById("widgetConfigModal");
  modal?.classList.remove("active");
  pendingWidgetDrop = null;
  window.editingWidgetId = null;
}

// Open config modal to edit an existing widget
function openWidgetSettings(widgetId) {
  const widgetElement = document.getElementById(widgetId);
  if (!widgetElement) return;

  const widgetType = widgetElement.dataset.type;
  const widgetData = dashboards[currentDashboardId].widgets.find(
    (w) => w.id === widgetId,
  );

  if (!widgetData) return;

  window.editingWidgetId = widgetId;

  const modal = document.getElementById("widgetConfigModal");
  const title = document.getElementById("configWidgetType");
  const contentSection = document.getElementById("widgetContentConfig");
  const createBtn = document.getElementById("createWidgetBtn");

  if (!modal) return;

  // Set widget type title
  const widgetNames = {
    aircon: "❄️ Air Conditioner",
    lights: "💡 Lights",
    roomTemp: "🌡️ Room Temperature",
    energyUsage: "⚡ Energy Usage",
    security: "🔒 Security",
  };
  title.textContent = widgetNames[widgetType] || widgetType;

  // Show relevant content options
  contentSection.innerHTML = `<p class="config-hint">Adjust appearance settings above.</p>`;

  // Pre-fill current values
  const config = widgetData.config || {};
  document.getElementById("widgetTitle").value = config.title || "";

  // Set color
  if (config.bgColor) {
    document.getElementById("widgetBgColor").value = config.bgColor;
    document.querySelectorAll(".color-preset").forEach((p) => {
      p.classList.toggle("active", p.dataset.color === config.bgColor);
    });
  }

  // Set size based on current widget dimensions
  const width = parseInt(widgetElement.style.width) || 300;
  let currentSize = "medium";
  if (width <= 220) currentSize = "small";
  else if (width >= 400) currentSize = "large";

  document.querySelectorAll(".size-preset").forEach((p) => {
    p.classList.toggle("active", p.dataset.size === currentSize);
  });

  // Update button text
  createBtn.textContent = "Save Changes";

  modal.classList.add("active");
}

function createConfiguredWidget() {
  // Check if we're editing an existing widget
  if (window.editingWidgetId) {
    updateExistingWidget();
    return;
  }

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

  // Create widget with config
  const config = {
    title,
    bgColor,
    size,
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

// Update an existing widget with new configuration
function updateExistingWidget() {
  const widgetId = window.editingWidgetId;
  if (!widgetId) return;

  const widgetElement = document.getElementById(widgetId);
  const widgetData = dashboards[currentDashboardId].widgets.find(
    (w) => w.id === widgetId,
  );

  if (!widgetElement || !widgetData) return;

  // Get new configuration values
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

  // Update widget data
  if (!widgetData.config) widgetData.config = {};
  widgetData.config.title = title;
  widgetData.config.bgColor = bgColor;
  widgetData.config.size = size;

  // Update position dimensions
  widgetData.position.width = dimensions.width;
  widgetData.position.height = dimensions.height;

  // Apply changes to DOM
  widgetElement.style.width = `${dimensions.width}px`;
  widgetElement.style.height = `${dimensions.height}px`;
  widgetElement.style.backgroundColor = bgColor;

  // Update title if custom title provided
  if (title) {
    const titleElement = widgetElement.querySelector(".widget-title");
    if (titleElement) {
      const originalText = titleElement.textContent;
      const emoji = originalText.match(/^[\u{1F300}-\u{1F9FF}]/u)?.[0] || "";
      titleElement.textContent = emoji ? `${emoji} ${title}` : title;
    }
  }

  saveDashboard();
  closeWidgetConfigModal();

  // Reset button text
  document.getElementById("createWidgetBtn").textContent = "Add Widget";
}

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

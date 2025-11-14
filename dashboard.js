// Dashboard Builder Main Script

// State
let dashboards = {};
let currentDashboardId = "default";
let widgetCounter = 0;
let draggedWidget = null;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadDashboards();
  setupEventListeners();
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
        name: "My Dashboard",
        widgets: [],
      },
    };
  }
}

// Save dashboards to localStorage
function saveDashboard() {
  localStorage.setItem("dashcraft-dashboards", JSON.stringify(dashboards));
}

// Setup event listeners
function setupEventListeners() {
  // Widget buttons
  document.querySelectorAll(".widget-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const widgetType = btn.getAttribute("data-widget");
      addWidget(widgetType);
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

// Add widget to current dashboard
function addWidget(type) {
  const widgetId = `widget-${Date.now()}-${widgetCounter++}`;
  const template = widgetTemplates[type];

  if (!template) return;

  // Add to dashboard data
  if (!dashboards[currentDashboardId].widgets) {
    dashboards[currentDashboardId].widgets = [];
  }
  dashboards[currentDashboardId].widgets.push({
    id: widgetId,
    type: type,
  });

  // Render widget
  const canvas = document.getElementById("canvas");
  const emptyState = document.getElementById("emptyState");

  if (emptyState) {
    emptyState.style.display = "none";
  }

  const widgetDiv = document.createElement("div");
  widgetDiv.innerHTML = template.create(widgetId);
  const widgetElement = widgetDiv.firstElementChild;

  // Make widget draggable
  makeWidgetDraggable(widgetElement);

  canvas.appendChild(widgetElement);

  // Initialize widget
  if (template.init) {
    template.init(widgetId);
  }

  saveDashboard();
}

// Remove widget
function removeWidget(widgetId) {
  const widget = document.getElementById(widgetId);
  if (widget) {
    widget.remove();
  }

  // Remove from data
  if (dashboards[currentDashboardId].widgets) {
    dashboards[currentDashboardId].widgets = dashboards[
      currentDashboardId
    ].widgets.filter((w) => w.id !== widgetId);
  }

  // Show empty state if no widgets
  const canvas = document.getElementById("canvas");
  const emptyState = document.getElementById("emptyState");
  if (canvas.querySelectorAll(".widget").length === 0 && emptyState) {
    emptyState.style.display = "block";
  }

  saveDashboard();
}

// Make widget draggable
function makeWidgetDraggable(widget) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;

  widget.addEventListener("mousedown", (e) => {
    // Don't drag if clicking on buttons or inputs
    if (
      e.target.tagName === "BUTTON" ||
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA"
    ) {
      return;
    }

    isDragging = true;
    initialX = e.clientX - widget.offsetLeft;
    initialY = e.clientY - widget.offsetTop;
    widget.style.cursor = "grabbing";
    widget.style.position = "relative";
    widget.style.zIndex = 1000;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging || !widget) return;

    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    widget.style.transform = `translate(${currentX}px, ${currentY}px)`;
  });

  document.addEventListener("mouseup", () => {
    if (isDragging && widget) {
      isDragging = false;
      widget.style.cursor = "move";
      widget.style.zIndex = 1;
      saveDashboard();
    }
  });
}

// Render current dashboard
function renderCurrentDashboard() {
  const canvas = document.getElementById("canvas");
  const emptyState = document.getElementById("emptyState");

  // Clear canvas
  canvas.innerHTML = "";

  // Re-add empty state
  const emptyDiv = document.createElement("div");
  emptyDiv.className = "empty-state";
  emptyDiv.id = "emptyState";
  emptyDiv.innerHTML = `
        <div class="empty-icon">📊</div>
        <h2 class="empty-title">Start Building Your Dashboard</h2>
        <p class="empty-desc">Click on widgets from the sidebar to add them to your dashboard</p>
    `;
  canvas.appendChild(emptyDiv);

  const dashboard = dashboards[currentDashboardId];
  if (!dashboard || !dashboard.widgets || dashboard.widgets.length === 0) {
    emptyDiv.style.display = "block";
    return;
  }

  emptyDiv.style.display = "none";

  // Render widgets
  dashboard.widgets.forEach((widgetData) => {
    const template = widgetTemplates[widgetData.type];
    if (!template) return;

    const widgetDiv = document.createElement("div");
    widgetDiv.innerHTML = template.create(widgetData.id);
    const widgetElement = widgetDiv.firstElementChild;

    makeWidgetDraggable(widgetElement);
    canvas.appendChild(widgetElement);

    if (template.init) {
      template.init(widgetData.id);
    }
  });

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

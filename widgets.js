// Widget Templates and Functions
const widgetTemplates = {
  clock: {
    title: "🕐 Clock",
    create: (id) => `
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
    create: (id) => `
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
    create: (id) => `
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
    create: (id) => `
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
    create: (id) => `
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
    create: (id) => `
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
    create: (id) => `
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
    create: (id) => `
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
};

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

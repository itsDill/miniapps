import { Plus, Moon, Sun, Save } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";
import { useState } from "react";

export const Header = () => {
  const {
    dashboards,
    currentDashboardId,
    createDashboard,
    setCurrentDashboard,
    isDarkMode,
    toggleDarkMode,
  } = useDashboardStore();

  const [showNewDashboard, setShowNewDashboard] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");

  const handleCreateDashboard = () => {
    if (newDashboardName.trim()) {
      createDashboard(newDashboardName.trim());
      setNewDashboardName("");
      setShowNewDashboard(false);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            ioWidgets
          </h1>

          {dashboards.length > 0 && (
            <select
              className="input py-2 max-w-xs"
              value={currentDashboardId || ""}
              onChange={(e) => setCurrentDashboard(e.target.value)}
            >
              {dashboards.map((dashboard) => (
                <option key={dashboard.id} value={dashboard.id}>
                  {dashboard.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showNewDashboard ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="input py-2"
                placeholder="Dashboard name"
                value={newDashboardName}
                onChange={(e) => setNewDashboardName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateDashboard()}
                autoFocus
              />
              <button
                onClick={handleCreateDashboard}
                className="btn-primary py-2"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewDashboard(false);
                  setNewDashboardName("");
                }}
                className="btn-secondary py-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowNewDashboard(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Dashboard
            </button>
          )}

          <button
            onClick={toggleDarkMode}
            className="btn-secondary p-2"
            title="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

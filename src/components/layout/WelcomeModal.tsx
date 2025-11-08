import { X } from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";

export const WelcomeModal = () => {
  const { showWelcome, setShowWelcome, createDashboard, dashboards } =
    useDashboardStore();

  if (!showWelcome) return null;

  const handleGetStarted = () => {
    if (dashboards.length === 0) {
      createDashboard("My Dashboard");
    }
    setShowWelcome(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Welcome to ioWidgets! 🎉</h2>
          <button
            onClick={() => setShowWelcome(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Build Your Perfect Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              ioWidgets is a flexible dashboard builder that lets you create
              personalized workspaces with widgets for everything you need.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">How It Works</h3>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Choose Your Widgets</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Browse the widget library in the sidebar and click to add
                    them to your dashboard
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Arrange & Resize</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Drag widgets to move them around. Resize from the
                    bottom-right corner
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Customize & Configure</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click the gear icon on any widget to configure its settings
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">Create Multiple Dashboards</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use "New Dashboard" to create different layouts for
                    different needs
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Available Widgets</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div>• Clock (digital & analog)</div>
              <div>• Weather</div>
              <div>• To-Do List</div>
              <div>• Notes</div>
              <div>• Calendar</div>
              <div>• Timer/Pomodoro</div>
              <div>• Quote of the Day</div>
              <div>• RSS Feed Reader</div>
              <div>• Quick Links</div>
              <div>• Progress Tracker</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleGetStarted} className="btn-primary flex-1">
              Get Started
            </button>
            <button
              onClick={() => setShowWelcome(false)}
              className="btn-secondary"
            >
              Skip Tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

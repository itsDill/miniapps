import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Dashboard, Widget, LayoutItem } from "../types";

interface DashboardStore {
  dashboards: Dashboard[];
  currentDashboardId: string | null;
  isDarkMode: boolean;
  showWelcome: boolean;

  // Dashboard actions
  createDashboard: (name: string) => void;
  deleteDashboard: (id: string) => void;
  setCurrentDashboard: (id: string) => void;
  updateDashboardName: (id: string, name: string) => void;

  // Widget actions
  addWidget: (widget: Widget, layoutItem: LayoutItem) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, config: any) => void;
  updateLayout: (layout: LayoutItem[]) => void;

  // Settings
  toggleDarkMode: () => void;
  setShowWelcome: (show: boolean) => void;

  // Helpers
  getCurrentDashboard: () => Dashboard | undefined;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      dashboards: [],
      currentDashboardId: null,
      isDarkMode: false,
      showWelcome: true,

      createDashboard: (name: string) => {
        const newDashboard: Dashboard = {
          id: `dashboard-${Date.now()}`,
          name,
          widgets: [],
          layout: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          dashboards: [...state.dashboards, newDashboard],
          currentDashboardId: newDashboard.id,
        }));
      },

      deleteDashboard: (id: string) => {
        set((state) => {
          const newDashboards = state.dashboards.filter((d) => d.id !== id);
          const newCurrentId =
            state.currentDashboardId === id
              ? newDashboards.length > 0
                ? newDashboards[0].id
                : null
              : state.currentDashboardId;

          return {
            dashboards: newDashboards,
            currentDashboardId: newCurrentId,
          };
        });
      },

      setCurrentDashboard: (id: string) => {
        set({ currentDashboardId: id });
      },

      updateDashboardName: (id: string, name: string) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === id
              ? { ...d, name, updatedAt: new Date().toISOString() }
              : d
          ),
        }));
      },

      addWidget: (widget: Widget, layoutItem: LayoutItem) => {
        set((state) => {
          const currentDashboard = state.dashboards.find(
            (d) => d.id === state.currentDashboardId
          );

          if (!currentDashboard) return state;

          return {
            dashboards: state.dashboards.map((d) =>
              d.id === state.currentDashboardId
                ? {
                    ...d,
                    widgets: [...d.widgets, widget],
                    layout: [...d.layout, layoutItem],
                    updatedAt: new Date().toISOString(),
                  }
                : d
            ),
          };
        });
      },

      removeWidget: (widgetId: string) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === state.currentDashboardId
              ? {
                  ...d,
                  widgets: d.widgets.filter((w) => w.id !== widgetId),
                  layout: d.layout.filter((l) => l.i !== widgetId),
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
      },

      updateWidget: (widgetId: string, config: any) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === state.currentDashboardId
              ? {
                  ...d,
                  widgets: d.widgets.map((w) =>
                    w.id === widgetId
                      ? { ...w, config: { ...w.config, ...config } }
                      : w
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
      },

      updateLayout: (layout: LayoutItem[]) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === state.currentDashboardId
              ? {
                  ...d,
                  layout,
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
      },

      toggleDarkMode: () => {
        set((state) => {
          const newMode = !state.isDarkMode;
          if (newMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { isDarkMode: newMode };
        });
      },

      setShowWelcome: (show: boolean) => {
        set({ showWelcome: show });
      },

      getCurrentDashboard: () => {
        const state = get();
        return state.dashboards.find((d) => d.id === state.currentDashboardId);
      },
    }),
    {
      name: "iowidgets-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.isDarkMode) {
          document.documentElement.classList.add("dark");
        }
      },
    }
  )
);

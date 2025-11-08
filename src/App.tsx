import { useCallback } from "react";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { DashboardCanvas } from "./components/layout/DashboardCanvas";
import { WelcomeModal } from "./components/layout/WelcomeModal";
import { useDashboardStore } from "./store/dashboardStore";
import { Widget, LayoutItem } from "./types";
import { getWidgetDefinition } from "./utils/widgetDefinitions";

function App() {
  const { getCurrentDashboard, addWidget } = useDashboardStore();
  const dashboard = getCurrentDashboard();

  const handleAddWidget = useCallback(
    (type: string) => {
      const definition = getWidgetDefinition(type);
      if (!definition || !dashboard) return;

      const newWidget: Widget = {
        id: `widget-${Date.now()}`,
        type: type as any,
        config: { ...definition.defaultConfig },
      };

      // Find a good position for the new widget
      const maxY =
        dashboard.layout.length > 0
          ? Math.max(...dashboard.layout.map((l) => l.y + l.h))
          : 0;

      const newLayoutItem: LayoutItem = {
        i: newWidget.id,
        x: 0,
        y: maxY,
        w: definition.defaultSize.w,
        h: definition.defaultSize.h,
        minW: definition.minSize.w,
        minH: definition.minSize.h,
      };

      addWidget(newWidget, newLayoutItem);
    },
    [dashboard, addWidget]
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onAddWidget={handleAddWidget} />
        <DashboardCanvas onAddWidget={handleAddWidget} />
      </div>
      <WelcomeModal />
    </div>
  );
}

export default App;

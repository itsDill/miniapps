import { useCallback } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDashboardStore } from "../../store/dashboardStore";
import { WidgetWrapper } from "./WidgetWrapper";
import { EmptyState } from "./EmptyState";
import { Widget, LayoutItem } from "../../types";
import { getWidgetDefinition } from "../../utils/widgetDefinitions";

interface DashboardCanvasProps {
  onAddWidget: (type: string) => void;
}

export const DashboardCanvas = ({ onAddWidget }: DashboardCanvasProps) => {
  const { getCurrentDashboard, updateLayout, addWidget } = useDashboardStore();
  const dashboard = getCurrentDashboard();

  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      if (!dashboard) return;

      const layoutItems: LayoutItem[] = newLayout.map((item) => ({
        i: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        minW: item.minW,
        minH: item.minH,
      }));

      updateLayout(layoutItems);
    },
    [dashboard, updateLayout]
  );

  // Handle adding widget when called from sidebar
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

  if (!dashboard) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            No dashboard selected
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Create a new dashboard to get started
          </p>
        </div>
      </div>
    );
  }

  if (dashboard.widgets.length === 0) {
    return (
      <div
        className="flex-1 bg-gray-50 dark:bg-gray-900"
        onClick={() => onAddWidget("")}
      >
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-6 overflow-auto">
      <GridLayout
        className="layout"
        layout={dashboard.layout}
        onLayoutChange={handleLayoutChange}
        cols={12}
        rowHeight={80}
        width={1200}
        draggableHandle=".widget-header"
        compactType="vertical"
        preventCollision={false}
      >
        {dashboard.widgets.map((widget) => (
          <div key={widget.id}>
            <WidgetWrapper widget={widget} />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

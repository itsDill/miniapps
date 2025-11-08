import { useState } from "react";
import { Settings, X } from "lucide-react";
import { Widget, WidgetType } from "../../types";
import { useDashboardStore } from "../../store/dashboardStore";
import * as Widgets from "../widgets";

interface WidgetWrapperProps {
  widget: Widget;
}

const getWidgetComponent = (type: WidgetType) => {
  const componentMap: Record<WidgetType, any> = {
    clock: Widgets.ClockWidget,
    weather: Widgets.WeatherWidget,
    todo: Widgets.TodoWidget,
    notes: Widgets.NotesWidget,
    calendar: Widgets.CalendarWidget,
    timer: Widgets.TimerWidget,
    quote: Widgets.QuoteWidget,
    rss: Widgets.RSSWidget,
    links: Widgets.LinksWidget,
    progress: Widgets.ProgressWidget,
  };
  return componentMap[type];
};

const getSettingsComponent = (type: WidgetType) => {
  const componentMap: Record<WidgetType, any> = {
    clock: Widgets.ClockSettings,
    weather: Widgets.WeatherSettings,
    todo: Widgets.TodoSettings,
    notes: Widgets.NotesSettings,
    calendar: Widgets.CalendarSettings,
    timer: Widgets.TimerSettings,
    quote: Widgets.QuoteSettings,
    rss: Widgets.RSSSettings,
    links: Widgets.LinksSettings,
    progress: Widgets.ProgressSettings,
  };
  return componentMap[type];
};

export const WidgetWrapper = ({ widget }: WidgetWrapperProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const { removeWidget, updateWidget } = useDashboardStore();

  const WidgetComponent = getWidgetComponent(widget.type);
  const SettingsComponent = getSettingsComponent(widget.type);

  const handleUpdate = (newConfig: any) => {
    updateWidget(widget.id, newConfig);
  };

  return (
    <div className="widget-container h-full flex flex-col">
      <div className="widget-header cursor-move">
        <div className="text-sm font-medium capitalize">{widget.type}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => removeWidget(widget.id)}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showSettings ? (
        <div className="widget-content">
          <SettingsComponent config={widget.config} onUpdate={handleUpdate} />
        </div>
      ) : (
        <div className="widget-content flex-1 overflow-hidden">
          <WidgetComponent config={widget.config} onUpdate={handleUpdate} />
        </div>
      )}
    </div>
  );
};

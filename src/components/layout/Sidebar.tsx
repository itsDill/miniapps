import { WIDGET_DEFINITIONS } from "../../utils/widgetDefinitions";

interface SidebarProps {
  onAddWidget: (type: string) => void;
}

export const Sidebar = ({ onAddWidget }: SidebarProps) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Widget Library</h2>
      <div className="space-y-2">
        {WIDGET_DEFINITIONS.map((widget) => (
          <button
            key={widget.type}
            onClick={() => onAddWidget(widget.type)}
            className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{widget.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {widget.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {widget.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-xs text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-1">💡 Tip:</p>
        <p>
          Click any widget to add it to your dashboard. Drag to reposition and
          resize!
        </p>
      </div>
    </aside>
  );
};

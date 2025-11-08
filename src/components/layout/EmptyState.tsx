import { LayoutDashboard } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md p-8">
        <div className="mb-6 flex justify-center">
          <div className="p-6 bg-primary-100 dark:bg-primary-900/30 rounded-full">
            <LayoutDashboard className="w-16 h-16 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">Your canvas is empty</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Click on any widget from the sidebar to add it to your dashboard. You
          can drag, resize, and customize each widget.
        </p>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 text-left bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="font-medium">Quick tips:</p>
          <ul className="space-y-1 ml-4 list-disc">
            <li>Drag widgets to reposition them</li>
            <li>Resize from the bottom-right corner</li>
            <li>Use the gear icon to configure widgets</li>
            <li>Click the X to remove widgets</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";
import { Check, Trash2, Plus } from "lucide-react";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoWidgetProps {
  config: {
    items?: TodoItem[];
  };
  onUpdate: (config: any) => void;
}

export const TodoWidget = ({ config, onUpdate }: TodoWidgetProps) => {
  const [newItem, setNewItem] = useState("");
  const items = config.items || [];

  const addItem = () => {
    if (newItem.trim()) {
      const newItems = [
        ...items,
        { id: `todo-${Date.now()}`, text: newItem.trim(), completed: false },
      ];
      onUpdate({ items: newItems });
      setNewItem("");
    }
  };

  const toggleItem = (id: string) => {
    const newItems = items.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdate({ items: newItems });
  };

  const deleteItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    onUpdate({ items: newItems });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="input flex-1"
          placeholder="Add a new task..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addItem()}
        />
        <button onClick={addItem} className="btn-primary px-3">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No tasks yet. Add one above!
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded group"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  item.completed
                    ? "bg-primary-500 border-primary-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {item.completed && <Check className="w-4 h-4 text-white" />}
              </button>

              <span
                className={`flex-1 ${
                  item.completed
                    ? "line-through text-gray-500 dark:text-gray-400"
                    : ""
                }`}
              >
                {item.text}
              </span>

              <button
                onClick={() => deleteItem(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const TodoSettings = () => {
  return (
    <div className="text-sm text-gray-600 dark:text-gray-400">
      No additional settings available for To-Do widget.
    </div>
  );
};

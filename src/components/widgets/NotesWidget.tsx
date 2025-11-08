import { useState } from "react";

interface NotesWidgetProps {
  config: {
    content?: string;
    color?: "yellow" | "blue" | "green" | "pink";
  };
  onUpdate: (config: any) => void;
}

const colorClasses = {
  yellow: "bg-yellow-100 dark:bg-yellow-900/30",
  blue: "bg-blue-100 dark:bg-blue-900/30",
  green: "bg-green-100 dark:bg-green-900/30",
  pink: "bg-pink-100 dark:bg-pink-900/30",
};

export const NotesWidget = ({ config, onUpdate }: NotesWidgetProps) => {
  const { content = "", color = "yellow" } = config;

  return (
    <div className={`h-full ${colorClasses[color]} rounded-lg p-4`}>
      <textarea
        className="w-full h-full bg-transparent resize-none outline-none text-gray-800 dark:text-gray-200"
        placeholder="Type your notes here..."
        value={content}
        onChange={(e) => onUpdate({ content: e.target.value })}
      />
    </div>
  );
};

export const NotesSettings = ({ config, onUpdate }: any) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Note Color</label>
        <div className="flex gap-2">
          {(["yellow", "blue", "green", "pink"] as const).map((color) => (
            <button
              key={color}
              onClick={() => onUpdate({ color })}
              className={`w-10 h-10 rounded-full border-2 ${
                config.color === color || (!config.color && color === "yellow")
                  ? "border-gray-800 dark:border-white"
                  : "border-gray-300 dark:border-gray-600"
              } ${colorClasses[color]}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

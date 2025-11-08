import { useState, useEffect } from "react";
import { format } from "date-fns";

interface ClockWidgetProps {
  config: {
    format?: "12h" | "24h";
    showSeconds?: boolean;
    type?: "digital" | "analog";
  };
}

export const ClockWidget = ({ config }: ClockWidgetProps) => {
  const [time, setTime] = useState(new Date());
  const {
    format: timeFormat = "24h",
    showSeconds = true,
    type = "digital",
  } = config;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (type === "analog") {
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourDeg = hours * 30 + minutes * 0.5;
    const minuteDeg = minutes * 6;
    const secondDeg = seconds * 6;

    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative w-40 h-40 rounded-full border-4 border-gray-300 dark:border-gray-600">
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-3 bg-gray-400 dark:bg-gray-500"
              style={{
                top: "10%",
                left: "50%",
                transformOrigin: "center 80px",
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
              }}
            />
          ))}

          {/* Hour hand */}
          <div
            className="absolute w-1.5 h-12 bg-gray-700 dark:bg-gray-300 rounded-full"
            style={{
              top: "30%",
              left: "50%",
              transformOrigin: "center bottom",
              transform: `translateX(-50%) rotate(${hourDeg}deg)`,
            }}
          />

          {/* Minute hand */}
          <div
            className="absolute w-1 h-16 bg-gray-600 dark:bg-gray-400 rounded-full"
            style={{
              top: "20%",
              left: "50%",
              transformOrigin: "center bottom",
              transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
            }}
          />

          {/* Second hand */}
          {showSeconds && (
            <div
              className="absolute w-0.5 h-18 bg-primary-500 rounded-full"
              style={{
                top: "15%",
                left: "50%",
                transformOrigin: "center bottom",
                transform: `translateX(-50%) rotate(${secondDeg}deg)`,
              }}
            />
          )}

          {/* Center dot */}
          <div className="absolute w-3 h-3 bg-gray-800 dark:bg-gray-200 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }

  const formatString =
    timeFormat === "12h"
      ? showSeconds
        ? "hh:mm:ss a"
        : "hh:mm a"
      : showSeconds
      ? "HH:mm:ss"
      : "HH:mm";

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-5xl font-bold mb-2">
        {format(time, formatString)}
      </div>
      <div className="text-lg text-gray-600 dark:text-gray-400">
        {format(time, "EEEE, MMMM d, yyyy")}
      </div>
    </div>
  );
};

export const ClockSettings = ({ config, onUpdate }: any) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Type</label>
        <select
          className="input"
          value={config.type || "digital"}
          onChange={(e) => onUpdate({ type: e.target.value })}
        >
          <option value="digital">Digital</option>
          <option value="analog">Analog</option>
        </select>
      </div>

      {config.type !== "analog" && (
        <div>
          <label className="block text-sm font-medium mb-2">Format</label>
          <select
            className="input"
            value={config.format || "24h"}
            onChange={(e) => onUpdate({ format: e.target.value })}
          >
            <option value="24h">24 Hour</option>
            <option value="12h">12 Hour</option>
          </select>
        </div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          id="showSeconds"
          checked={config.showSeconds ?? true}
          onChange={(e) => onUpdate({ showSeconds: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor="showSeconds" className="text-sm">
          Show Seconds
        </label>
      </div>
    </div>
  );
};

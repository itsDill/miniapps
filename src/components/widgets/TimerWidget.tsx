import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimerWidgetProps {
  config: {
    duration?: number;
    type?: "pomodoro" | "custom";
  };
  onUpdate: (config: any) => void;
}

export const TimerWidget = ({ config }: TimerWidgetProps) => {
  const { duration = 25, type = "pomodoro" } = config;
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
            className="text-primary-500 transition-all duration-1000"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-3xl font-bold">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={toggleTimer}
          className="btn-primary flex items-center gap-2"
        >
          {isRunning ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={resetTimer} className="btn-secondary">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const TimerSettings = ({ config, onUpdate }: any) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Type</label>
        <select
          className="input"
          value={config.type || "pomodoro"}
          onChange={(e) => {
            const newType = e.target.value;
            const newDuration =
              newType === "pomodoro" ? 25 : config.duration || 10;
            onUpdate({ type: newType, duration: newDuration });
          }}
        >
          <option value="pomodoro">Pomodoro (25 min)</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {config.type === "custom" && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            className="input"
            min="1"
            max="120"
            value={config.duration || 25}
            onChange={(e) =>
              onUpdate({ duration: parseInt(e.target.value) || 25 })
            }
          />
        </div>
      )}
    </div>
  );
};

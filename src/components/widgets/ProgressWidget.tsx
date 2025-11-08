import { useState } from "react";
import { Plus, Trash2, Minus } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
}

interface ProgressWidgetProps {
  config: {
    goals?: Goal[];
  };
  onUpdate: (config: any) => void;
}

export const ProgressWidget = ({ config, onUpdate }: ProgressWidgetProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", target: 10 });
  const goals = config.goals || [];

  const addGoal = () => {
    if (newGoal.name && newGoal.target > 0) {
      const updatedGoals = [
        ...goals,
        { ...newGoal, id: `goal-${Date.now()}`, current: 0 },
      ];
      onUpdate({ goals: updatedGoals });
      setNewGoal({ name: "", target: 10 });
      setIsAdding(false);
    }
  };

  const updateProgress = (id: string, delta: number) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === id) {
        const newCurrent = Math.max(
          0,
          Math.min(goal.target, goal.current + delta)
        );
        return { ...goal, current: newCurrent };
      }
      return goal;
    });
    onUpdate({ goals: updatedGoals });
  };

  const deleteGoal = (id: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id);
    onUpdate({ goals: updatedGoals });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3">
        {goals.length === 0 && !isAdding && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No goals yet. Add one below!
          </div>
        )}

        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;

          return (
            <div
              key={goal.id}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{goal.name}</span>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => updateProgress(goal.id, -1)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  disabled={goal.current === 0}
                >
                  <Minus className="w-3 h-3" />
                </button>

                <div className="flex-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => updateProgress(goal.id, 1)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  disabled={goal.current === goal.target}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                {goal.current} / {goal.target}
              </div>
            </div>
          );
        })}

        {isAdding && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded space-y-2">
            <input
              type="text"
              className="input text-sm"
              placeholder="Goal name"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            />
            <input
              type="number"
              className="input text-sm"
              placeholder="Target"
              min="1"
              value={newGoal.target}
              onChange={(e) =>
                setNewGoal({
                  ...newGoal,
                  target: parseInt(e.target.value) || 10,
                })
              }
            />
            <div className="flex gap-2">
              <button onClick={addGoal} className="btn-primary text-sm flex-1">
                Add
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewGoal({ name: "", target: 10 });
                }}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      )}
    </div>
  );
};

export const ProgressSettings = () => {
  return (
    <div className="text-sm text-gray-600 dark:text-gray-400">
      No additional settings available for Progress widget.
    </div>
  );
};

"use client";

import { useState } from "react";

export default function Tasks({ tasks, onAddTask, onCompleteTask, canCompleteTask, stats }) {
  const [taskDraft, setTaskDraft] = useState("");

  const handleAddTask = (event) => {
    event.preventDefault();
    const wasCreated = onAddTask?.(taskDraft);
    if (wasCreated) {
      setTaskDraft("");
    }
  };

  return (
    <div className="quest-layout">
      <div className="quest-board pokemon-window">
        <h3 className="pixel-heading">Quest Board</h3>
        <p className="pixel-text mt-2 text-muted">
          Set your study targets and convert each focus sprint into real XP.
        </p>

        <form onSubmit={handleAddTask} className="flex gap-3 mt-4">
          <input
            className="pokemon-input"
            value={taskDraft}
            onChange={(e) => setTaskDraft(e.target.value)}
            placeholder="What will you conquer next?"
          />
          <button type="submit" className="pokemon-btn pokemon-btn-red">
            Add
          </button>
        </form>

        {tasks.length === 0 && (
          <div className="quest-item mt-4">
            <p className="pixel-text" style={{ fontWeight: "bold" }}>
              No active quests yet.
            </p>
            <p className="pixel-text-sm mt-1 text-muted">
              Add your first quest above, then complete a pomodoro to unlock quest completion.
            </p>
          </div>
        )}

        <div className="flex-col gap-3 mt-4">
          {tasks.map((task) => (
            <div key={task.id} className="quest-item">
              <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <p className="pixel-text" style={{ fontWeight: "bold" }}>
                    {task.done ? "✓" : "▶"} {task.name}
                  </p>
                  <p className="pixel-text-sm text-muted">
                    +{task.points} XP
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`pokemon-badge ${task.done ? "pokemon-badge-green" : "pokemon-badge-yellow"}`}>
                    {task.done ? "Done" : "Queued"}
                  </span>
                  <button
                    className={`pokemon-btn ${task.done ? "" : "pokemon-btn-blue"}`}
                    onClick={() => onCompleteTask(task.id)}
                    disabled={task.done || !canCompleteTask}
                    style={{ fontSize: "8px", padding: "6px 12px" }}
                  >
                    {task.done ? "Done" : "Clear!"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="quest-stats pokemon-window">
        <h3 className="pixel-heading">Trainer Stats</h3>
        <div className="flex-col gap-3 mt-4">
          <div className="pokemon-stat-card">
            <p className="pokemon-stat-label">Battles Started</p>
            <p className="pokemon-stat-value">{stats.sessionsStarted}</p>
          </div>
          <div className="pokemon-stat-card">
            <p className="pokemon-stat-label">Battles Won</p>
            <p className="pokemon-stat-value">{stats.sessionsCompleted}</p>
          </div>
          <div className="pokemon-stat-card">
            <p className="pokemon-stat-label">Quests Cleared</p>
            <p className="pokemon-stat-value">{stats.tasksCompleted}</p>
          </div>
          <div className="pokemon-stat-card">
            <p className="pokemon-stat-label">Trainer Level</p>
            <p className="pokemon-stat-value">{stats.currentLevel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

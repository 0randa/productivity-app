"use client";

import { useState } from "react";
import { CheckSquare, Square, PlusCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Tasks({ tasks, onAddTask, onCompleteTask, onClearBoard, canCompleteTask, stats }) {
  const [taskDraft, setTaskDraft] = useState("");

  const handleAddTask = (event) => {
    event.preventDefault();
    const wasCreated = onAddTask?.(taskDraft);
    if (wasCreated) setTaskDraft("");
  };

  return (
    <div className="quest-layout">
      {/* Quest Board */}
      <Card className="quest-board">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quest Board</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{tasks.length} active</Badge>
              {tasks.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={onClearBoard}>
                        <Trash2 size={14} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear all quests</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          <p className="font-pixel-body text-[18px] text-[var(--text-muted)]">
            Convert each focus sprint into real XP.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Add task form */}
          <form onSubmit={handleAddTask} className="flex gap-2">
            <Input
              value={taskDraft}
              onChange={(e) => setTaskDraft(e.target.value)}
              placeholder="What will you conquer next?"
              className="flex-1"
            />
            <Button type="submit" variant="primary" size="sm" title="Add quest">
              <PlusCircle size={14} />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </form>

          {/* Empty state */}
          {tasks.length === 0 && (
            <div className="border-[2px] border-dashed border-[var(--window-border)] p-6 text-center">
              <p className="font-pixel text-[9px] tracking-wide text-[var(--text-dark)]">
                No active quests yet
              </p>
              <p className="font-pixel-body text-[18px] text-[var(--text-muted)] mt-2">
                Add a quest above, then complete a pomodoro to unlock claims.
              </p>
            </div>
          )}

          {/* Task list */}
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={[
                  "flex items-center gap-3 px-4 py-3",
                  "border-[2px] border-[var(--window-border)]",
                  "shadow-[inset_1px_1px_0_var(--window-highlight),inset_-1px_-1px_0_var(--window-shadow)]",
                  "transition-all duration-100",
                  task.done
                    ? "opacity-60 bg-[var(--window-bg)]"
                    : "bg-[var(--window-bg)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[inset_1px_1px_0_var(--window-highlight),inset_-1px_-1px_0_var(--window-shadow),3px_3px_0_rgba(0,0,0,0.12)]",
                ].join(" ")}
              >
                {/* Status icon */}
                <span className="flex-shrink-0 text-[var(--text-muted)]">
                  {task.done
                    ? <CheckSquare size={16} style={{ color: "var(--poke-green)" }} />
                    : <Square size={16} />
                  }
                </span>

                {/* Task info */}
                <div className="flex-1 min-w-0">
                  <p className={[
                    "font-pixel-body text-[20px] leading-tight",
                    task.done ? "line-through text-[var(--text-muted)]" : "text-[var(--text-dark)]",
                  ].join(" ")}>
                    {task.name}
                  </p>
                  <p className="font-pixel text-[8px] tracking-wide text-[var(--text-muted)] mt-0.5">
                    +{task.points} XP
                  </p>
                </div>

                {/* Status + action */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={task.done ? "green" : "yellow"}>
                    {task.done ? "Done" : "Queued"}
                  </Badge>
                  <Button
                    variant={task.done ? "ghost" : "secondary"}
                    size="sm"
                    onClick={() => onCompleteTask(task.id)}
                    disabled={task.done || !canCompleteTask}
                  >
                    {task.done ? "✓" : "Clear!"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trainer Stats */}
      <Card className="quest-stats">
        <CardHeader>
          <CardTitle>Trainer Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { label: "Battles Started", value: stats.sessionsStarted },
            { label: "Battles Won",     value: stats.sessionsCompleted },
            { label: "Quests Cleared",  value: stats.tasksCompleted },
            { label: "Trainer Level",   value: stats.currentLevel },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between px-3 py-2.5 bg-[var(--window-bg)] border-[2px] border-[var(--window-border)] shadow-[inset_1px_1px_0_var(--window-highlight),inset_-1px_-1px_0_var(--window-shadow)]"
            >
              <p className="font-pixel text-[7px] tracking-widest uppercase text-[var(--text-muted)]">{label}</p>
              <p className="font-pixel text-[16px] text-[var(--text-dark)]">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

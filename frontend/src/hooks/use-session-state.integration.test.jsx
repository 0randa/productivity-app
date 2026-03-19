import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSessionState } from "@/hooks/use-session-state";
import Tasks from "@/components/tasks";
import { test, expect } from "vitest";

function Harness() {
  const {
    tasks,
    availableTaskClaims,
    statusMessage,
    handlePomodoroComplete,
    handleTaskCreate,
    handleTaskComplete,
  } = useSessionState();

  return (
    <div>
      <button type="button" onClick={handlePomodoroComplete}>
        Complete pomodoro
      </button>
      <button type="button" onClick={() => handleTaskCreate("Write tests")}>
        Add task
      </button>

      {statusMessage && <div aria-label="status">{statusMessage}</div>}

      <div aria-label="claims">{availableTaskClaims}</div>

      <Tasks
        tasks={tasks}
        onAddTask={handleTaskCreate}
        onCompleteTask={(taskId) =>
          handleTaskComplete({
            taskId,
            activePokemonLabel: "Pikachu",
            currentLevel: 1,
            resolveLevelForEarnedXp: (xp) => (xp >= 999999 ? 2 : 1),
          })
        }
        canCompleteTask={availableTaskClaims > 0}
        stats={{
          sessionsStarted: 0,
          sessionsCompleted: 0,
          tasksCompleted: 0,
          currentLevel: 1,
        }}
      />
    </div>
  );
}

test("integration: pomodoro completion enables one task claim", async () => {
  const user = userEvent.setup();
  render(<Harness />);

  expect(screen.getByLabelText("claims")).toHaveTextContent("0");
  await user.click(screen.getByRole("button", { name: "Complete pomodoro" }));
  expect(screen.getByLabelText("claims")).toHaveTextContent("1");
  expect(screen.getByLabelText("status")).toHaveTextContent(/Pomodoro complete/i);
});

test("integration: task completion consumes claim and marks done", async () => {
  const user = userEvent.setup();
  render(<Harness />);

  await user.click(screen.getByRole("button", { name: "Add task" }));
  expect(screen.getByText("Write tests")).toBeVisible();

  // No claim yet: "Clear!" should be disabled
  const clearBtn = screen.getByRole("button", { name: "Clear!" });
  expect(clearBtn).toBeDisabled();

  await user.click(screen.getByRole("button", { name: "Complete pomodoro" }));
  expect(clearBtn).toBeEnabled();

  await user.click(clearBtn);
  expect(screen.getByLabelText("claims")).toHaveTextContent("0");
  expect(screen.getByText("Done")).toBeVisible();
  expect(screen.getByText("Write tests")).toHaveClass("line-through");
});


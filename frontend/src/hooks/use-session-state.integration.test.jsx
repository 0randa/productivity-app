import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSessionState } from "@/hooks/use-session-state";
import Tasks from "@/components/tasks";
import { test, expect, beforeEach } from "vitest";

beforeEach(() => {
  localStorage.clear();
});

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

test("integration: malformed/legacy task payloads load as queued", () => {
  localStorage.setItem(
    "pomopet_session",
    JSON.stringify({
      tasks: [
        { id: "t1", name: "Truthy number", points: 10, done: 1 },
        { id: "t2", name: "String true", points: 10, done: "true" },
        { id: "t3", name: "Legacy completed", points: 10, completed: false },
      ],
      tasksCompleted: 0,
      availableTaskClaims: 0,
      pomodorosStarted: 0,
    }),
  );

  render(<Harness />);

  const badges = screen.getAllByText("Queued");
  expect(badges).toHaveLength(3);
});

test("integration: task added while claims are available starts as queued", async () => {
  const user = userEvent.setup();
  render(<Harness />);

  // Earn a claim
  await user.click(screen.getByRole("button", { name: "Complete pomodoro" }));
  expect(screen.getByLabelText("claims")).toHaveTextContent("1");

  // Add task while a claim is available
  await user.click(screen.getByRole("button", { name: "Add task" }));

  // Should be Queued, not Done
  expect(screen.getByText("Queued")).toBeVisible();
  expect(screen.getByText("Write tests")).not.toHaveClass("line-through");
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


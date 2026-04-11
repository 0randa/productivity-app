import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { useTimerTabTitle } from "@/hooks/use-timer-tab-title";

function Harness() {
  const [isRunning, setIsRunning] = useState(false);
  const { showCompletionTitle } = useTimerTabTitle(
    isRunning ? "00:01 — Focus | PomoPet" : null,
  );

  return (
    <div>
      <button type="button" onClick={() => setIsRunning(true)}>
        Start
      </button>
      <button
        type="button"
        onClick={() => {
          showCompletionTitle("Focus complete! | PomoPet");
          setIsRunning(false);
        }}
      >
        Complete
      </button>
      <button type="button" onClick={() => setIsRunning(false)}>
        Stop
      </button>
    </div>
  );
}

describe("useTimerTabTitle", () => {
  let visibilityState = "visible";
  let hasFocus = true;

  beforeEach(() => {
    document.title = "PomoPet";
    visibilityState = "visible";
    hasFocus = true;

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => visibilityState,
    });

    Object.defineProperty(document, "hasFocus", {
      configurable: true,
      value: () => hasFocus,
    });
  });

  afterEach(() => {
    document.title = "PomoPet";
    visibilityState = "visible";
    hasFocus = true;
  });

  test("restores the original title when the running title clears", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "Start" }));
    await waitFor(() => {
      expect(document.title).toBe("00:01 — Focus | PomoPet");
    });

    await user.click(screen.getByRole("button", { name: "Stop" }));
    await waitFor(() => {
      expect(document.title).toBe("PomoPet");
    });
  });

  test("keeps a completion title until the tab becomes active again", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "Start" }));
    await waitFor(() => {
      expect(document.title).toBe("00:01 — Focus | PomoPet");
    });

    visibilityState = "hidden";
    hasFocus = false;

    await user.click(screen.getByRole("button", { name: "Complete" }));
    await waitFor(() => {
      expect(document.title).toBe("Focus complete! | PomoPet");
    });

    visibilityState = "visible";
    hasFocus = true;
    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("focus"));

    await waitFor(() => {
      expect(document.title).toBe("PomoPet");
    });
  });

  test("does not persist a completion title while the page is already active", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "Start" }));
    await waitFor(() => {
      expect(document.title).toBe("00:01 — Focus | PomoPet");
    });

    await user.click(screen.getByRole("button", { name: "Complete" }));
    await waitFor(() => {
      expect(document.title).toBe("PomoPet");
    });
  });
});

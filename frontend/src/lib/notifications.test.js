import { afterEach, describe, expect, test, vi } from "vitest";
import { requestNotificationPermission, sendTimerNotification } from "@/lib/notifications";

describe("notifications", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("requestNotificationPermission reflects the live browser result", async () => {
    const requestPermission = vi.fn().mockResolvedValue("granted");

    function MockNotification() {
      return { close: vi.fn() };
    }

    MockNotification.permission = "default";
    MockNotification.requestPermission = requestPermission;

    vi.stubGlobal("Notification", MockNotification);

    await expect(requestNotificationPermission()).resolves.toBe(true);
    expect(requestPermission).toHaveBeenCalledTimes(1);
  });

  test("sendTimerNotification uses the current Notification.permission value", () => {
    const created = [];

    function MockNotification(title, options) {
      created.push({ title, options });
      return { close: vi.fn() };
    }

    MockNotification.permission = "default";
    MockNotification.requestPermission = vi.fn();

    vi.stubGlobal("Notification", MockNotification);

    expect(sendTimerNotification("Focus session complete!", "Break time.")).toBe(false);
    expect(created).toHaveLength(0);

    MockNotification.permission = "granted";

    expect(sendTimerNotification("Focus session complete!", "Break time.")).toBe(true);
    expect(created).toHaveLength(1);
    expect(created[0]).toMatchObject({
      title: "Focus session complete!",
      options: expect.objectContaining({
        body: "Break time.",
        tag: "pomopet-timer",
        renotify: true,
      }),
    });
  });
});

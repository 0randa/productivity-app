import { expect, test } from "@playwright/test";

test("starter selection -> dashboard renders", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Choose Your Starter!")).toBeVisible();

  await page.getByRole("button", { name: /^Start with / }).click();

  await expect(page.getByText("Quest Board")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Focus" })).toBeVisible();
});

test("timer basic flow (start -> skip -> start break)", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^Start with / }).click();

  // Start focus
  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByRole("button", { name: /Pause/ })).toBeVisible();

  // Skip focus (should enable break selection)
  await page.getByRole("button", { name: /Skip/ }).click();
  await expect(page.getByRole("button", { name: /Break/ })).toBeVisible();

  // Start break
  await page.getByRole("button", { name: /Break/ }).click();
  await expect(page.getByText("Potion Break").or(page.getByText("Camp Rest"))).toBeVisible();
});

test("mute toggle is clickable", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^Start with / }).click();

  // Toggle mute (aria-label changes)
  const muteButton = page.getByRole("button", { name: /Mute music|Unmute music/ });
  await expect(muteButton).toBeVisible();
  const before = await muteButton.getAttribute("aria-label");
  await muteButton.click();
  await expect(muteButton).toHaveAttribute(
    "aria-label",
    before === "Mute music" ? "Unmute music" : "Mute music",
  );
});


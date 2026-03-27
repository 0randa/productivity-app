import { expect, test } from "@playwright/test";

// Helper: land on the dashboard (past starter selection)
async function goToDashboard(page: any) {
  await page.goto("/");
  await page.getByRole("button", { name: /^Start with / }).click();
  await expect(page.getByText("Quest Board")).toBeVisible();
}

test.describe("Quest Board (tasks)", () => {
  test("can add a task", async ({ page }) => {
    await goToDashboard(page);

    const input = page.getByPlaceholder("What will you conquer next?");
    await input.fill("Study algorithms");
    await input.press("Enter");

    // Match the task item specifically (not the toast notification)
    await expect(page.getByText("Study algorithms", { exact: true })).toBeVisible();
  });

  test("added task shows Queued badge", async ({ page }) => {
    await goToDashboard(page);

    const input = page.getByPlaceholder("What will you conquer next?");
    await input.fill("Read chapter 5");
    await input.press("Enter");

    await expect(page.getByText("Read chapter 5", { exact: true })).toBeVisible();
    await expect(page.getByText("Queued").first()).toBeVisible();
  });

  test("task count increments when task is added", async ({ page }) => {
    await goToDashboard(page);

    await expect(page.getByText("0 active")).toBeVisible();

    const input = page.getByPlaceholder("What will you conquer next?");
    await input.fill("My first quest");
    await input.press("Enter");

    await expect(page.getByText("1 active")).toBeVisible();
  });

  test("empty input does not add a task", async ({ page }) => {
    await goToDashboard(page);

    const input = page.getByPlaceholder("What will you conquer next?");
    await input.fill("");
    await input.press("Enter");

    await expect(page.getByText("0 active")).toBeVisible();
  });

  test("task added during break mode starts as Queued and is not struck through", async ({ page }) => {
    await goToDashboard(page);

    // Complete a focus session via Skip
    await page.getByRole("button", { name: "Start" }).click();
    await page.getByRole("button", { name: /Skip/ }).click();

    // Enter break mode
    await page.getByRole("button", { name: /Break/ }).click();
    await expect(page.getByText(/Potion Break|Camp Rest/)).toBeVisible();

    // Add a task during break
    const input = page.getByPlaceholder("What will you conquer next?");
    await input.fill("Break-time task");
    await input.press("Enter");

    // Task must be Queued, not Done
    await expect(page.getByText("Break-time task", { exact: true })).toBeVisible();
    await expect(page.getByText("Queued").first()).toBeVisible();
    await expect(page.getByText("Break-time task", { exact: true })).not.toHaveClass("line-through");
  });

  test("Clear! button is disabled before completing a pomodoro", async ({ page }) => {
    await goToDashboard(page);

    const input = page.getByPlaceholder("What will you conquer next?");
    await input.fill("A task to clear");
    await input.press("Enter");

    const clearButton = page.getByRole("button", { name: "Clear!" });
    await expect(clearButton).toBeDisabled();
  });
});

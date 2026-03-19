import { expect, test } from "@playwright/test";

test.describe("Theme toggle", () => {
  test("toggles between light and dark mode", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /^Start with / }).click();

    const html = page.locator("html");

    // Get initial theme state
    const initialTheme = await html.getAttribute("data-theme");

    // Find and click the theme toggle button (Sun or Moon icon)
    const themeButton = page.getByRole("button", { name: /switch to (light|dark) mode/i });
    await themeButton.click();

    // data-theme should have changed
    const newTheme = await html.getAttribute("data-theme");
    expect(newTheme).not.toBe(initialTheme);
  });

  test("toggling twice returns to original theme", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /^Start with / }).click();

    const html = page.locator("html");
    const initialTheme = await html.getAttribute("data-theme");

    const themeButton = page.getByRole("button", { name: /switch to (light|dark) mode/i });
    await themeButton.click();
    await themeButton.click();

    expect(await html.getAttribute("data-theme")).toBe(initialTheme);
  });
});

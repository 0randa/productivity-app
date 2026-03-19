import { expect, test } from "@playwright/test";

test.describe("Login page", () => {
  test("renders form elements", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  test("has link to register page", async ({ page }) => {
    await page.goto("/login");

    // Use the inline "Register here" link (not the navbar link)
    const registerLink = page.getByRole("link", { name: "Register here" });
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });
});

test.describe("Register page", () => {
  test("renders form elements", async ({ page }) => {
    await page.goto("/register");

    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password (min 6 characters)")).toBeVisible();
    await expect(page.getByLabel("Confirm Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create Account" })).toBeVisible();
  });

  test("shows error when passwords do not match", async ({ page }) => {
    await page.goto("/register");

    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password (min 6 characters)").fill("password123");
    await page.getByLabel("Confirm Password").fill("different456");
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test("has link to login page", async ({ page }) => {
    await page.goto("/register");

    const loginLink = page.getByRole("link", { name: "Login here" });
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });
});

import { test, expect, type Page, type BrowserContext } from "@playwright/test";

test.describe("Habit Tracker app", () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Clear localStorage before each test
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await page.waitForURL("**/login");
  });

  test("redirects authenticated users from / to /dashboard", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "1", email: "test@example.com" }),
      );
    });
    await page.goto("/");
    await page.waitForURL("**/dashboard");
  });

  test("prevents unauthenticated access to /dashboard", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login");
  });

  test("signs up a new user and lands on the dashboard", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/signup");
    await page.getByLabel(/Full Name/i).fill("New User");
    await page.getByTestId("auth-signup-email").fill("new@example.com");
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByLabel(/Confirm/i).fill("password123");
    await page.getByTestId("auth-signup-submit").click();
    await page.waitForURL("**/dashboard");
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "habit-tracker-users",
        JSON.stringify([
          {
            id: "u1",
            email: "user@example.com",
            password: "password123",
            createdAt: "",
          },
        ]),
      );
      localStorage.setItem(
        "habit-tracker-habits",
        JSON.stringify([
          {
            id: "h1",
            userId: "u1",
            name: "User Habit",
            description: "",
            frequency: "daily",
            createdAt: "",
            completions: [],
          },
          {
            id: "h2",
            userId: "other",
            name: "Other Habit",
            description: "",
            frequency: "daily",
            createdAt: "",
            completions: [],
          },
        ]),
      );
    });

    await page.goto("/login");
    await page.getByTestId("auth-login-email").fill("user@example.com");
    await page.getByTestId("auth-login-password").fill("password123");
    await page.getByTestId("auth-login-submit").click();

    await page.waitForURL("**/dashboard");
    await expect(page.getByTestId("habit-card-user-habit")).toBeVisible();
    await expect(page.getByTestId("habit-card-other-habit")).not.toBeVisible();
  });

  test("creates a habit from the dashboard", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/login");
    // Setup session
    await page.evaluate(() => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "u1", email: "u@e.com" }),
      );
    });
    await page.goto("/dashboard");

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Daily Run");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-card-daily-run")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "u1", email: "u@e.com" }),
      );
      localStorage.setItem(
        "habit-tracker-habits",
        JSON.stringify([
          {
            id: "h1",
            userId: "u1",
            name: "Run",
            description: "",
            frequency: "daily",
            createdAt: "",
            completions: [],
          },
        ]),
      );
    });
    await page.goto("/dashboard");

    await page.getByTestId("habit-complete-run").click();
    await expect(page.getByTestId("habit-streak-run")).toBeVisible();
  });

  test("persists session and habits after page reload", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "u1", email: "u@e.com" }),
      );
      localStorage.setItem(
        "habit-tracker-habits",
        JSON.stringify([
          {
            id: "h1",
            userId: "u1",
            name: "Persist",
            description: "",
            frequency: "daily",
            createdAt: "",
            completions: [],
          },
        ]),
      );
    });
    await page.goto("/dashboard");
    await expect(page.getByTestId("habit-card-persist")).toBeVisible();

    await page.reload();
    await expect(page.getByTestId("habit-card-persist")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }: { page: Page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "u1", email: "u@e.com" }),
      );
    });
    await page.goto("/dashboard");
    await page.getByTestId("auth-logout-button").click();
    await page.waitForURL("**/login");
    const session = await page.evaluate(() =>
      localStorage.getItem("habit-tracker-session"),
    );
    expect(session).toBe("null");
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    context,
    page,
  }: {
    context: BrowserContext;
    page: Page;
  }) => {
    await page.goto("/");
    
    // Ensure service worker is registered and controlling the page
    await page.evaluate(async () => {
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.ready;
        if (!navigator.serviceWorker.controller) {
          await new Promise((resolve) => {
            navigator.serviceWorker.addEventListener("controllerchange", resolve, {
              once: true,
            });
          });
        }
      }
    });

    // Simulate offline
    await context.setOffline(true);
    await page.reload();

    // Check if app shell (branding) is still there
    await expect(page.getByText(/HabitFlow/i)).toBeVisible();
  });
});

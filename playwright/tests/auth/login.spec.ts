import { test, expect } from "@playwright/test";

test.describe("Auth", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.only("should be able to log in", async ({ page }) => {
    await page.getByRole("link", { name: "Log in" }).click();
    await page.getByLabel("Email").fill("test_supplier@test.com");
    await page.getByLabel("Password").fill("test");
    await page.getByText("log in").click();
    await page.waitForResponse((response) =>
      response.url().includes("/api/v1/auth/login")
    );
    await page.getByText("Storage Facilities").click();
    await page.waitForResponse((response) =>
      response
        .url()
        .includes(
          "/api/v1/company/ae236251-db62-4f10-b5d7-7c9b87690eb1/storage-facility/partners"
        )
    );
  });
});

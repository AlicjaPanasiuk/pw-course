import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { loginData } from "../test-data/login.data";

test.describe("Payment tests", () => {
  test.beforeEach(async ({ page }) => {
    const userId = loginData.userId;
    const userPassword = loginData.userPassword;

    await page.goto("/");
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(userId);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.loginButton.click();

    await page.getByRole("link", { name: "płatności" }).click();
  });

  test("simple payment", async ({ page }) => {
    // Arrange:
    const transferReceiver = "Jan Nowak";
    const transferAccount = "12345678901234567890123456";
    const transferAmount = "200";
    const transferTitle = "testowy przelew";
    const expectedMessage = `Przelew wykonany! ${transferAmount},00PLN dla ${transferReceiver}`;
    // Act:
    await page.getByTestId("transfer_receiver").fill(transferReceiver);
    await page.getByTestId("form_account_to").fill(transferAccount);
    await page.getByTestId("form_amount").fill(transferAmount);
    await page.getByRole("button", { name: "wykonaj przelew" }).click();
    await page.getByTestId("close-button").click();

    // Assert
    await expect(page.locator("#show_messages")).toHaveText(expectedMessage);
  });
});

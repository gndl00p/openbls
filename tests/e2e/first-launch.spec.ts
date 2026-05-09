import { expect, test } from '@playwright/test';

test.describe('First launch flow', () => {
  test('shows the contraindication gate, persists acknowledgment, and routes into the session', async ({
    page
  }) => {
    await page.goto('/');

    const heading = page.getByRole('heading', { name: 'Before you continue' });
    await expect(heading).toBeVisible();

    const continueBtn = page.getByRole('button', { name: 'Continue' });
    await expect(continueBtn).toBeDisabled();

    await page.getByRole('checkbox').check();
    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();

    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();

    // Reload — gate should not reappear.
    await page.reload();
    await expect(heading).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  });
});

test.describe('Crisis link', () => {
  test('crisis-resources button is reachable on every page', async ({ page }) => {
    await page.goto('/');
    // Acknowledge first if needed.
    if (await page.getByRole('heading', { name: 'Before you continue' }).isVisible()) {
      await page.getByRole('checkbox').check();
      await page.getByRole('button', { name: 'Continue' }).click();
    }

    for (const route of ['/', '/presets', '/settings', '/about']) {
      await page.goto(route);
      const link = page.getByRole('button', { name: 'Crisis resources' });
      await expect(link).toBeVisible();
    }
  });
});

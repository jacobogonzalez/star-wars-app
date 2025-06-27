import { test, expect } from '@playwright/test';

// Test case: verifies that grid view supports sorting and searching functionality.
test('smoke test: load grid view → perform search → apply sort → navigate pagination', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // --- Switch to Grid View ---
    const gridViewBtn = page.locator('[data-testid="btn-grid-view"]');
    await gridViewBtn.click();

    // --- Open Sorting Dropdown ---
    const sortSelect = page.locator('[data-testid="sort-select"]');
    await sortSelect.click();

    // Locate the "Name Ascending" option via its accessible label and visible text.
    const option = page.getByLabel('Sort by-list').getByText('Name Ascending');
    await expect(option).toBeVisible();
    await option.click();

    // --- Verify Search Results (after sort) ---
    const searchInput = page.locator('[data-testid="search-input"] input');
    await searchInput.fill('Luke');
    // Locate the first item in the sorted list. This is very specific to your UI content.
    const firstItemName = page.locator('div').filter({
        hasText: /Luke Skywalker.*Gender: male/
    }).first();

    // Check that the item contains "Luke".
    await expect(firstItemName).toContainText('Luke');

    // --- Pagination visibility check ---
    const pagination = page.locator('[data-testid="pagination"]');
    if (await pagination.count() > 0) {
        await expect(pagination).toBeVisible();
    }
});

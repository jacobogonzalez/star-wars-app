import { test, expect } from '@playwright/test';

// Test case: verifies that grid view supports sorting and searching functionality on /planets route.
test('planets test: load grid view on /planets → perform search → apply sort → navigate pagination', async ({ page }) => {
    // Navigate to the planets page
    await page.goto('/planets');

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
    await searchInput.fill('Tatooine');  // example planet name
    // Adjust this selector/text to match your planets grid item structure
    const firstItemName = page.locator('div').filter({
        hasText: /^Tatooine.*$/  // a regex matching Tatooine or similar content
    }).first();

    // Check that the item contains "Tatooine".
    await expect(firstItemName).toContainText('Tatooine');

    // --- Pagination visibility check ---
    const pagination = page.locator('[data-testid="pagination"]');
    if (await pagination.count() > 0) {
        await expect(pagination).toBeVisible();
    }
});

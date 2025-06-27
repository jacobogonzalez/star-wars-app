// src/modules/dataGrid/components/GridData.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import GridData from './GridData.vue'
import { vuetify } from '../../../tests/setupVuetify'


// Mock ResizeObserver (needed for Vuetify components like VPagination)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// Override global ResizeObserver with the mock to avoid errors in tests
global.ResizeObserver = ResizeObserver;

// Mock GridCard and Alert components to isolate GridData's testing
const GridCardMock = {
  name: 'GridCard',
  props: ['item'],
  template: '<div>Mock GridCard for {{ item.name }}</div>', // Simple mock template
}

const AlertMock = {
  name: 'Alert',
  props: ['message', 'type'],
  template: '<div class="alert-mock">{{ message }}</div>', // Simple mock for alert messages
}

describe('GridData', () => {
  // Sample data for basic tests
  const mockItems = [
    { name: 'Item 1', created: '2023-01-01' },
    { name: 'Item 2', created: '2023-01-02' },
    { name: 'Item 3', created: '2023-01-03' },
  ]

  // Larger dataset to test pagination (more than 10 items)
  const paginatedMockItems = Array.from({ length: 25 }, (_, i) => ({
    name: `Paginated Item ${i + 1}`,
    created: `2023-01-${String(i + 1).padStart(2, '0')}`,
  }));

  it('renders correctly with initial props', async () => {
    // Mount the component with mock items and initial props
    const wrapper = mount(GridData, {
      props: {
        items: mockItems,
        search: '',
        loading: false,
        sortBy: 'name',
        sortDesc: false,
      },
      global: {
        plugins: [vuetify],
        stubs: {
          GridCard: GridCardMock, // Stub the GridCard component
          Alert: AlertMock,       // Stub the Alert component
        },
      },
    })

    await wrapper.vm.$nextTick();

    // Basic existence checks for the component and key UI elements
    expect(wrapper.exists()).toBe(true)

    expect(wrapper.findComponent({ name: 'VSelect' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'VTextField' }).exists()).toBe(true)

    // Verify that mock cards render correctly for each item
    expect(wrapper.text()).toContain('Mock GridCard for Item 1')
    expect(wrapper.text()).toContain('Mock GridCard for Item 2')
    expect(wrapper.text()).toContain('Mock GridCard for Item 3')

    // Pagination should not show because there are less than 10 items
    expect(wrapper.find('.v-pagination').exists()).toBe(false)
  })

  it('displays loading state with skeleton loader', async () => {
    // Mount component with loading=true to test loading state UI
    const wrapper = mount(GridData, {
      props: {
        items: [],
        search: '',
        loading: true,
        sortBy: 'name',
        sortDesc: false,
      },
      global: {
        plugins: [vuetify],
        stubs: {
          GridCard: GridCardMock,
          Alert: AlertMock,
        },
      },
    })

    await wrapper.vm.$nextTick();

    // Skeleton loader should be visible
    expect(wrapper.find('.v-skeleton-loader').exists()).toBe(true)
    // No grid cards should be rendered while loading
    expect(wrapper.findComponent(GridCardMock).exists()).toBe(false)
  })

  it('displays "No results found" alert when no items and not loading', async () => {
    // Test the empty state alert when there are no items and loading is false
    const wrapper = mount(GridData, {
      props: {
        items: [],
        search: '',
        loading: false,
        sortBy: 'name',
        sortDesc: false,
      },
      global: {
        plugins: [vuetify],
        stubs: {
          GridCard: GridCardMock,
          Alert: AlertMock,
        },
      },
    })

    await wrapper.vm.$nextTick();

    // Alert component should be rendered with appropriate message
    const alert = wrapper.findComponent(AlertMock)
    expect(alert.exists()).toBe(true)
    expect(alert.props().message).toBe('No results found.')
  })

  it('emits update:search event on search input change', async () => {
    // Test that typing in search input emits the update:search event
    const wrapper = mount(GridData, {
      props: {
        items: mockItems,
        search: '',
        loading: false,
        sortBy: 'name',
        sortDesc: false,
      },
      global: {
        plugins: [vuetify],
        stubs: {
          GridCard: GridCardMock,
          Alert: AlertMock,
        },
      },
    })

    await wrapper.vm.$nextTick();

    // Simulate updating the internal search model
    (wrapper.vm as any).localSearch = 'test query';

    await wrapper.vm.$nextTick();

    // Get all emitted events from the wrapper
    const emitted = wrapper.emitted();

    // Assert that the update:search event was emitted once with correct payload
    expect(emitted['update:search']).toBeTruthy();
    expect(emitted['update:search'].length).toBe(1);
    const emittedT = wrapper.emitted() as Record<string, unknown[][]>
    expect(emittedT['update:search'][0][0]).toBe('test query')

    // Check that the current page remains at 1
    expect((wrapper.vm as any).page).toBe(1)
  })

  it('handles pagination correctly', async () => {
    // Mount with a larger list of items to test pagination behavior
    const wrapper = mount(GridData, {
      props: {
        items: paginatedMockItems, // Use the larger item set
        search: '',
        loading: false,
        sortBy: 'name',
        sortDesc: false,
      },
      global: {
        plugins: [vuetify],
        stubs: {
          GridCard: GridCardMock,
          Alert: AlertMock,
        },
      },
    })

    await wrapper.vm.$nextTick();

    // Pagination component should be present with correct number of pages
    const pagination = wrapper.findComponent({ name: 'VPagination' });
    expect(pagination.exists()).toBe(true);

    // Calculate expected page count (25 items / 10 items per page = 3 pages)
    const expectedPageCount = Math.ceil(paginatedMockItems.length / 10);
    expect(pagination.props().length).toBe(expectedPageCount);
    expect((wrapper.vm as any).pageCount).toBe(expectedPageCount);
    expect((wrapper.vm as any).page).toBe(1) // Ensure initial page is 1

    // Container for rendered card items should exist
    const cardsContainer = wrapper.find('.containerCards');
    expect(cardsContainer.exists()).toBe(true);

    // Check initial items on page 1 (first 10 items)
    let cardTexts = wrapper.findAllComponents(GridCardMock).map(c => c.text());
    expect(cardTexts).toContain('Mock GridCard for Paginated Item 1');
    expect(cardTexts).toContain('Mock GridCard for Paginated Item 10');
    expect(cardTexts).not.toContain('Mock GridCard for Paginated Item 11');

    // --- Simulate clicking page 2 ---
    (wrapper.vm as any).page = 2; // Set internal page state to 2
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Check paginated items on page 2 (should have 10 items)
    expect((wrapper.vm as any).paginatedItems.length).toBe(10);
    expect((wrapper.vm as any).paginatedItems[0].name).toBe('Paginated Item 11');
    expect((wrapper.vm as any).paginatedItems[9].name).toBe('Paginated Item 20');

    // Get card texts after page 2 is set
    cardTexts = wrapper.findAllComponents(GridCardMock).map(c => c.text());

    // Assert correct items shown on page 2
    expect(cardTexts).not.toContain('Mock GridCard for Paginated Item 1');
    expect(cardTexts).toContain('Mock GridCard for Paginated Item 11');
    expect(cardTexts).toContain('Mock GridCard for Paginated Item 20');
    expect(cardTexts).not.toContain('Mock GridCard for Paginated Item 21');

    // --- Simulate clicking page 3 ---
    (wrapper.vm as any).page = 3;
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Check paginated items on page 3 (last 5 items)
    expect((wrapper.vm as any).paginatedItems.length).toBe(5);
    expect((wrapper.vm as any).paginatedItems[0].name).toBe('Paginated Item 21');
    expect((wrapper.vm as any).paginatedItems[4].name).toBe('Paginated Item 25');

    // Get card texts after page 3 is set
    cardTexts = wrapper.findAllComponents(GridCardMock).map(c => c.text());

    // Assert correct items shown on page 3
    expect(cardTexts).not.toContain('Mock GridCard for Paginated Item 20');
    expect(cardTexts).toContain('Mock GridCard for Paginated Item 21');
    expect(cardTexts).toContain('Mock GridCard for Paginated Item 25');
    expect(cardTexts).not.toContain('Mock GridCard for Paginated Item 11');
  });
});

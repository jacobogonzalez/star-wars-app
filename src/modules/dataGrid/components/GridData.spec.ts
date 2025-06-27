// src/modules/dataGrid/components/GridData.spec.ts
import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import GridData from './GridData.vue'
import { vuetify } from '../../../tests/setupVuetify'

// Define a type for the emitted events for better type safety
interface GridDataEmits {
  'update:search': [string];
  'update:sortBy': [string];
  'update:sortDesc': [boolean];
  'update:page': [number];
  'row-click': [any]; // Assuming 'any' for the item for simplicity, ideally more specific
}

// Mock ResizeObserver (needed for Vuetify components like VPagination)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

// Mock GridCard and Alert components to isolate GridData's testing
const GridCardMock = {
  name: 'GridCard',
  props: ['item'],
  template: '<div>Mock GridCard for {{ item.name }}</div>',
}

const AlertMock = {
  name: 'Alert',
  props: ['message', 'type'],
  template: '<div class="alert-mock">{{ message }}</div>',
}

describe('GridData', () => {
  const mockItems = [
    { name: 'Item 1', created: '2023-01-01' },
    { name: 'Item 2', created: '2023-01-02' },
    { name: 'Item 3', created: '2023-01-03' },
  ]

  // Mock items for pagination testing (more than 10)
  const paginatedMockItems = Array.from({ length: 25 }, (_, i) => ({
    name: `Paginated Item ${i + 1}`,
    created: `2023-01-${String(i + 1).padStart(2, '0')}`,
  }));

  it('renders correctly with initial props', async () => {
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

    expect(wrapper.exists()).toBe(true)

    expect(wrapper.findComponent({ name: 'VSelect' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'VTextField' }).exists()).toBe(true)

    expect(wrapper.text()).toContain('Mock GridCard for Item 1')
    expect(wrapper.text()).toContain('Mock GridCard for Item 2')
    expect(wrapper.text()).toContain('Mock GridCard for Item 3')

    expect(wrapper.find('.v-pagination').exists()).toBe(false)
  })

  it('displays loading state with skeleton loader', async () => {
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

    expect(wrapper.find('.v-skeleton-loader').exists()).toBe(true)
    expect(wrapper.findComponent(GridCardMock).exists()).toBe(false)
  })

  it('displays "No results found" alert when no items and not loading', async () => {
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

    const alert = wrapper.findComponent(AlertMock)
    expect(alert.exists()).toBe(true)
    expect(alert.props().message).toBe('No results found.')
  })

  it('emits update:search event on search input change', async () => {
    const wrapper: VueWrapper<any, GridDataEmits> = mount(GridData, {
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

    (wrapper.vm as any).localSearch = 'test query';

    await wrapper.vm.$nextTick();

    const emitted = wrapper.emitted();

    expect(emitted['update:search']).toBeTruthy();
    expect(emitted['update:search'].length).toBe(1);
    expect(emitted['update:search'][0][0]).toBe('test query');

    expect(wrapper.vm.page).toBe(1);
  })

  it('handles pagination correctly', async () => {
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

    // Check if pagination is rendered
    const pagination = wrapper.findComponent({ name: 'VPagination' });
    expect(pagination.exists()).toBe(true);

    // Calculate expected page count (25 items / 10 items per page = 3 pages)
    const expectedPageCount = Math.ceil(paginatedMockItems.length / 10);
    expect(pagination.props().length).toBe(expectedPageCount);
    expect(wrapper.vm.pageCount).toBe(expectedPageCount);
    expect(wrapper.vm.page).toBe(1); // Ensure initial page is 1

    // Get the container for the cards
    const cardsContainer = wrapper.find('.containerCards');
    expect(cardsContainer.exists()).toBe(true);

    // Check initial items on page 1 (first 10 items)
    let cardTexts = wrapper.findAllComponents(GridCardMock).map(c => c.text());
    expect(cardTexts).toContain('Mock GridCard for Paginated Item 1');
    expect(cardTexts).toContain('Mock GridCard for Paginated Item 10');
    expect(cardTexts).not.toContain('Mock GridCard for Paginated Item 11');

    // --- Simulate clicking page 2 ---
    (wrapper.vm as any).page = 2; // Set internal page state
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Check internal computed property for page 2
    expect((wrapper.vm as any).paginatedItems.length).toBe(10);
    expect((wrapper.vm as any).paginatedItems[0].name).toBe('Paginated Item 11');
    expect((wrapper.vm as any).paginatedItems[9].name).toBe('Paginated Item 20');

    // Get all card texts again after pagination change
    cardTexts = wrapper.findAllComponents(GridCardMock).map(c => c.text());

    // Assert items for page 2 (items 11-20) are shown
    expect(cardTexts).not.toContain('Mock GridCard for Paginated Item 1');
    expect(cardTexts).toContain('Mock GridCard for Paginated Item 11');
    expect(cardTexts).toContain('Mock GridCard for Paginated Item 20');
    expect(cardTexts).not.toContain('Mock GridCard for Paginated Item 21');

    // --- Simulate clicking page 3 ---
    (wrapper.vm as any).page = 3;
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // Check internal computed property for page 3
    expect((wrapper.vm as any).paginatedItems.length).toBe(5);
    expect((wrapper.vm as any).paginatedItems[0].name).toBe('Paginated Item 21');
    expect((wrapper.vm as any).paginatedItems[4].name).toBe('Paginated Item 25');

    // Get all card texts again after pagination change
    cardTexts = wrapper.findAllComponents(GridCardMock).map(c => c.text());

    // Assert items for page 3 (items 21-25)
    expect(cardTexts).not.toContain('Mock GridCard for Paginated Item 20');
    expect(cardTexts).toContain('Mock GridCard for Paginated Item 21');
    expect(cardTexts).toContain('Mock GridCard for Paginated Item 25');
    expect(cardTexts).not.toContain('Mock GridCard for Paginated Item 11');
  });
});

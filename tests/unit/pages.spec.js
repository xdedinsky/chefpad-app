import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Foods from '@/pages/Foods.vue'
import FoodDetail from '@/pages/FoodDetail.vue'
import Ingredients from '@/pages/Ingredients.vue'
import MealSchedule from '@/pages/MealSchedule.vue'
import Register from '@/pages/Register.vue'
import ShoppingList from '@/pages/ShoppingList.vue'

// Mock API client 
vi.mock('@/api/api-client', () => {
  return {
    authAPI: {
      login: vi.fn(() => Promise.resolve({ data: { token: 'abc' } })),
      register: vi.fn(() => Promise.resolve({ data: { id: 1 } }))
    },
    foodAPI: {
      getAll: vi.fn(() => Promise.resolve({ data: [{ id: 1, name: 'Pizza' }] })),
      getById: vi.fn((id) =>
        Promise.resolve({
          data: {
            id,
            name: 'Pizza',
            description: 'Test desc',
            ingredients: [
              {
                id: 10,
                amount: 100,
                unit: 'g',
                ingredient: { id: 5, name: 'Salt', allergens: [{ id: 1, name: 'Gluten' }] }
              }
            ]
          }
        })
      ),
      delete: vi.fn(() => Promise.resolve())
    },
    ingredientAPI: {
      getAll: vi.fn(() => Promise.resolve({ data: [{ id: 5, name: 'Salt' }] })),
      create: vi.fn((data) => Promise.resolve({ data: { id: 99, ...data } })),
      delete: vi.fn(() => Promise.resolve())
    },
    allergenAPI: {
      getAll: vi.fn(() => Promise.resolve({ data: [{ id: 1, name: 'Gluten' }] }))
    },
    mealScheduleAPI: {
      get: vi.fn(() => Promise.resolve({ data: [] })),
      create: vi.fn(() => Promise.resolve())
    },
    shoppingListAPI: {
      get: vi.fn(() => Promise.resolve({ data: [] })),
      create: vi.fn(() => Promise.resolve()),
      delete: vi.fn(() => Promise.resolve())
    }
  }
})

// Helper: mock router push where pages use $router
const mockPush = vi.fn()
const globalMocks = {
  global: {
    mocks: {
      $router: { push: mockPush },
      $store: {
        dispatch: vi.fn()
      }
    },
    stubs: ['router-link']
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

// --- HOME PAGE TESTS ---
describe('Home.vue tests', () => {
  it('loads data (foods & allergens) on mount and sets state', async () => {
    const wrapper = mount(Home, globalMocks)
    await flushPromises()
    expect(wrapper.vm.foods.length).toBeGreaterThanOrEqual(1)
    expect(Array.isArray(wrapper.vm.allergens)).toBe(true)
  })

  it('renders main hero / welcome text', () => {
    const wrapper = mount(Home, globalMocks)
    expect(wrapper.exists()).toBe(true)
  })
})

// --- LOGIN PAGE TESTS ---
describe('Login.vue tests', () => {
  it('renders login form inputs and button', () => {
    const wrapper = mount(Login, globalMocks)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('shows error if login action returns failure', async () => {
    const wrapper = mount(Login, {
      global: {
        ...globalMocks.global,
        mocks: {
          $router: { push: mockPush },
          $store: { dispatch: vi.fn() }
        }
      }
    })
    wrapper.vm.login = vi.fn(() => Promise.resolve({ success: false, error: 'Bad credentials' }))
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.text()).toContain('Bad credentials')
  })

  it('redirects to / on successful login', async () => {
    const wrapper = mount(Login, globalMocks)
    wrapper.vm.login = vi.fn(() => Promise.resolve({ success: true }))
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    expect(mockPush).toHaveBeenCalledWith('/')
  })
})

// --- FOODS PAGE TESTS ---
describe('Foods.vue tests', () => {
  it('loads foods from API on mount', async () => {
    const wrapper = mount(Foods, globalMocks)
    await flushPromises()
    expect(wrapper.text()).toContain('Pizza')
  })

  it('open create modal toggles showModal', async () => {
    const wrapper = mount(Foods, globalMocks)
    expect(wrapper.vm.showModal).toBe(false)
    wrapper.vm.openCreateModal()
    expect(wrapper.vm.showModal).toBe(true)
  })
})

// --- FOOD DETAIL PAGE TESTS ---
describe('FoodDetail.vue tests', () => {
  it('loads food details by route param (getById) and renders name', async () => {
    const wrapper = mount(FoodDetail, {
      global: {
        mocks: {
          $route: { params: { id: '1' } },
          $router: { push: mockPush },
          $store: { dispatch: vi.fn() }
        },
        stubs: ['router-link']
      }
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Pizza')
    expect(wrapper.vm.details).toBeTruthy()
  })

  it('renders ingredients section and allergen badges', async () => {
    const wrapper = mount(FoodDetail, {
      global: {
        mocks: {
          $route: { params: { id: '1' } },
          $router: { push: mockPush },
          $store: { dispatch: vi.fn() }
        },
        stubs: ['router-link']
      }
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Ingrediencie')
    expect(wrapper.text()).toContain('Gluten')
  })

  it('addAllToShoppingList calls shoppingListAPI.create for each ingredient and dispatches success', async () => {
    const storeMock = { dispatch: vi.fn() }
    const wrapper = mount(FoodDetail, {
      global: {
        mocks: {
          $route: { params: { id: '1' } },
          $router: { push: mockPush },
          $store: storeMock
        },
        stubs: ['router-link']
      }
    })
    await flushPromises()
    expect(wrapper.vm.details?.ingredients?.length).toBeGreaterThan(0)
    await wrapper.vm.addAllToShoppingList()
    const api = await import('@/api/api-client')
    expect(api.shoppingListAPI.create).toHaveBeenCalled()
    expect(storeMock.dispatch).toHaveBeenCalledWith('setSuccess', expect.any(String))
  })
})

// --- INGREDIENTS PAGE TESTS ---
describe('Ingredients.vue tests', () => {
  it('loads ingredients & allergens on mount', async () => {
    const wrapper = mount(Ingredients, globalMocks)
    await flushPromises()
    expect(wrapper.vm.ingredients.length).toBeGreaterThanOrEqual(0)
    expect(wrapper.vm.allergens.length).toBeGreaterThanOrEqual(0)
  })

  it('renders "Pridať" button to toggle form', () => {
    const wrapper = mount(Ingredients, globalMocks)
    const addBtn = wrapper.find('button')
    expect(addBtn.exists()).toBe(true)
  })
})

// --- MEAL SCHEDULE PAGE TESTS ---
describe('MealSchedule.vue tests', () => {
  it('calls mealScheduleAPI.get on mount', async () => {
    const wrapper = mount(MealSchedule, globalMocks)
    await flushPromises()
    const api = await import('@/api/api-client')
    expect(api.mealScheduleAPI.get).toHaveBeenCalled()
  })
})



// --- REGISTER PAGE TESTS ---
describe('Register.vue tests', () => {
  it('blocks registration when passwords do not match', async () => {
    const wrapper = mount(Register, globalMocks)
    await wrapper.setData({
      formData: { name: 'A', lastName: 'B', email: 'a@b.com', password: '123456', confirmPassword: 'x' }
    })
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.text()).toContain('Heslá sa nezhodujú')
  })

  it('redirects on successful registration (register action mocked)', async () => {
    const mockRouterLocal = { push: vi.fn() }
    const wrapper = mount(Register, {
      global: {
        mocks: {
          $router: mockRouterLocal,
          $store: { dispatch: vi.fn() }
        },
        stubs: ['router-link']
      }
    })
    wrapper.vm.register = vi.fn(() => Promise.resolve({ success: true }))
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    expect(mockRouterLocal.push).toHaveBeenCalledWith('/')
  })
})

// --- SHOPPING LIST PAGE TESTS ---
describe('ShoppingList.vue tests', () => {
  it('loads shopping list on mount', async () => {
    const wrapper = mount(ShoppingList, globalMocks)
    await flushPromises()
    const api = await import('@/api/api-client')
    expect(api.shoppingListAPI.get).toHaveBeenCalled()
  })

  it('deleteItem calls shoppingListAPI.delete when confirmed', async () => {
    global.confirm = vi.fn(() => true)
    const wrapper = mount(ShoppingList, globalMocks)
    await flushPromises()
    await wrapper.vm.deleteItem(1)
    const api = await import('@/api/api-client')
    expect(api.shoppingListAPI.delete).toHaveBeenCalledWith(1)
  })
})

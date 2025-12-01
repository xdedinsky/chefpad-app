import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'

import FoodFormModal from '@/components/FoodFormModal.vue'
import MealAddModal from '@/components/MealAddModal.vue'
import Navbar from '@/components/Navbar.vue'
import ShoppingListAddModal from '@/components/ShoppingListAddModal.vue'

// Mock API modules
vi.mock('@/api/api-client', () => ({
  ingredientAPI: {
    getAll: vi.fn(() => Promise.resolve({ data: [{ id: 1, name: 'Cibuľa' }] }))
  },
  foodAPI: {
    getAll: vi.fn(() => Promise.resolve({ data: [{ id: 1, name: 'Polievka' }] })),
    create: vi.fn(() => Promise.resolve()),
    update: vi.fn(() => Promise.resolve())
  },
  mealScheduleAPI: {
    create: vi.fn(() => Promise.resolve())
  },
  shoppingListAPI: {
    create: vi.fn(() => Promise.resolve())
  }
}))

// --- FOODFORMMODAL TESTS ---
describe('FoodFormModal.vue', () => {
  it('loads ingredients on open', async () => {
    const wrapper = mount(FoodFormModal, {
      props: { show: false }
    })

    await wrapper.setProps({ show: true })
    await flushPromises()

    expect(wrapper.vm.availableIngredients.length).toBe(1)
  })

  it('emits success on creating food', async () => {
    const wrapper = mount(FoodFormModal, {
      props: { show: true }
    })

    wrapper.vm.formData.name = 'Test food'
    wrapper.vm.formData.ingredients = [
      { ingredientId: 1, amount: 100, unit: 'g' }
    ]

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.emitted().success).toBeTruthy()
  })
})

// --- MEALADDMODAL TESTS ---
describe('MealAddModal.vue', () => {
  it('loads list of foods on open', async () => {
    const wrapper = mount(MealAddModal, { props: { show: false } })

    await wrapper.setProps({ show: true })
    await flushPromises()

    expect(wrapper.vm.foods.length).toBe(1)
  })

  it('submits form and emits success', async () => {
    const wrapper = mount(MealAddModal, { props: { show: true } })

    wrapper.vm.form.date = '2025-01-01'
    wrapper.vm.form.foodId = '1'
    wrapper.vm.form.dayPart = 'OBED'

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.emitted().success).toBeTruthy()
  })
})

// --- NAVBAR TESTS ---
describe('Navbar.vue', () => {
  test('toggles mobile menu', async () => {
    const wrapper = mount(Navbar, {
      global: {
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
          }
        }
      }
    })

    expect(wrapper.vm.isOpen).toBe(false)

    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.isOpen).toBe(true)

    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.isOpen).toBe(false)
  })

  test('renders nav links', () => {
    const wrapper = mount(Navbar, {
      global: {
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
          }
        }
      }
    })

    const links = wrapper.findAll('a')
    expect(links.length).toBeGreaterThan(0)
  })
})

// --- SHOPPINGLISTADDMODAL TESTS ---
describe('ShoppingListAddModal.vue', () => {
  it('loads ingredients when opened', async () => {
    const wrapper = mount(ShoppingListAddModal, {
      props: { show: false }
    })

    await wrapper.setProps({ show: true })
    await flushPromises()

    expect(wrapper.vm.ingredients.length).toBe(1)
  })

  it('submits shopping list entry and emits success', async () => {
    const wrapper = mount(ShoppingListAddModal, {
      props: { show: true }
    })

    wrapper.vm.form.ingredientId = '1'
    wrapper.vm.form.amount = 100
    wrapper.vm.form.unit = 'g'

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.emitted().success).toBeTruthy()
  })
})

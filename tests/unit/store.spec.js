import { describe, it, expect, beforeEach } from 'vitest'
import { Window } from 'happy-dom'

globalThis.window = new Window()
globalThis.document = window.document
globalThis.localStorage = window.localStorage
localStorage.clear()

import store from '../../src/store/store.js'

function resetStore() {
  try { store.commit('logout') } catch(e){}
  try { store.commit('clearStore') } catch(e){}
  localStorage.clear()
}

beforeEach(() => {
  resetStore()
})

describe('Test store', () => {
  // --- AUTH TESTS ---
  it('setAuthToken mutation sets token and isAuthenticated', () => {
    store.commit('setAuthToken', 'test-token')
    expect(store.state.authToken).toBe('test-token')
    expect(store.state.isAuthenticated).toBe(true)
    expect(localStorage.getItem('authToken')).toBe('test-token')
  })

  it('setUser mutation sets user and verifies if currentUser getter works', () => {
    const user = { id: 1, email: 'test@example.com' }
    store.commit('setUser', user)
    expect(store.state.user).toEqual(user)
    expect(store.getters.currentUser).toEqual(user)
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(user)
  })

  it('logout mutation clears token, user, and isAuthenticated', () => {
    store.commit('setAuthToken', 'token')
    store.commit('setUser', { email: 'x' })
    store.commit('logout')
    expect(store.state.authToken).toBeNull()
    expect(store.state.user).toBeNull()
    expect(store.state.isAuthenticated).toBe(false)
    expect(localStorage.getItem('authToken')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  // --- INGREDIENTS TESTS ---
  it('addIngredient adds an ingredient and getIngredients getter returns it', () => {
    const ing = { id: 1, name: 'Salt' }
    store.commit('addIngredient', ing)
    expect(store.state.ingredients).toContainEqual(ing)
    expect(store.getters.getIngredients).toEqual(store.state.ingredients)
  })

  it('removeIngredient removes an ingredient by id', () => {
    const a = { id: 1, name: 'Salt' }
    const b = { id: 2, name: 'Pepper' }
    store.commit('setIngredients', [a,b])
    store.commit('removeIngredient', 1)
    expect(store.state.ingredients.find(x=>x.id===1)).toBeUndefined()
    expect(store.state.ingredients).toEqual([b])
  })

  // --- FOODS TESTS ---
  it('setFoods sets foods and getFoods getter returns them', () => {
    const foods = [{ id:10,name:'Soup' },{ id:11,name:'Salad' }]
    store.commit('setFoods', foods)
    expect(store.state.foods).toEqual(foods)
    expect(store.getters.getFoods).toEqual(foods)
  })

  it('setSelectedFood sets selectedFood and getSelectedFood getter returns it', () => {
    const f = { id:10,name:'Soup' }
    store.commit('setSelectedFood', f)
    expect(store.state.selectedFood).toEqual(f)
    expect(store.getters.getSelectedFood).toEqual(f)
  })

  // --- MEALS + SHOPPING LIST TESTS ---
  it('setMealSchedules sets schedules and getMealSchedules getter returns them', () => {
    const schedules = [{ id:1,date:'2025-12-01' }]
    store.commit('setMealSchedules', schedules)
    expect(store.state.mealSchedules).toEqual(schedules)
    expect(store.getters.getMealSchedules).toEqual(schedules)
  })

  it('setShoppingList sets shoppingList and getShoppingList getter returns it', () => {
    const items = [{ id:1,name:'Milk' }]
    store.commit('setShoppingList', items)
    expect(store.state.shoppingList).toEqual(items)
    expect(store.getters.getShoppingList).toEqual(items)
  })

  // --- LOADING / ERROR / SUCCESS TESTS ---
  it('setLoading sets loading and isLoading getter returns the value', () => {
    store.commit('setLoading', true)
    expect(store.state.loading).toBe(true)
    expect(store.getters.isLoading).toBe(true)
    store.commit('setLoading', false)
    expect(store.getters.isLoading).toBe(false)
  })

  it('setError and clearError manipulate the error in state', () => {
    store.commit('setError','Something bad')
    expect(store.state.error).toBe('Something bad')
    expect(store.getters.getError).toBe('Something bad')
    store.commit('clearError')
    expect(store.state.error).toBeNull()
    expect(store.getters.getError).toBeNull()
  })

  it('setSuccess and clearSuccess manipulate the success in state', () => {
    store.commit('setSuccess','OK')
    expect(store.state.success).toBe('OK')
    expect(store.getters.getSuccess).toBe('OK')
    store.commit('clearSuccess')
    expect(store.state.success).toBeNull()
    expect(store.getters.getSuccess).toBeNull()
  })
})

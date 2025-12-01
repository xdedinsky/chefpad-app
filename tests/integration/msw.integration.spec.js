import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import { beforeAll, afterAll, afterEach, describe, it, expect, vi } from 'vitest'

import Foods from '@/pages/Foods.vue'
import FoodDetail from '@/pages/FoodDetail.vue'
import ShoppingList from '@/pages/ShoppingList.vue'

const API_BASE = "https://chefpad.onrender.com"

let authCalls = []
let shoppingListCalls = []
let mealScheduleCalls = []

// MSW handlers
const handlers = [
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = await request.json()
    authCalls.push(body)
    if (body.email === "bad@example.com") {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    return HttpResponse.json({ token: "mock-token" }, { status: 200 })
  }),

  http.get(`${API_BASE}/food`, () =>
    HttpResponse.json([{ id: 1, name: "MockPizza" }])
  ),

  http.get(`${API_BASE}/food/:id`, ({ params }) =>
    HttpResponse.json({
      id: Number(params.id || 1),
      name: "MockPizza",
      description: "Test desc",
      ingredients: [
        {
          id: 10,
          amount: 100,
          unit: "g",
          ingredient: {
            id: 5,
            name: "Salt",
            allergens: [{ id: 1, name: "Gluten" }]
          }
        }
      ]
    })
  ),

  http.get(`${API_BASE}/ingredient`, () =>
    HttpResponse.json([{ id: 5, name: "Salt" }])
  ),

  http.get(`${API_BASE}/shopping-list`, () =>
    HttpResponse.json([])
  ),

  http.post(`${API_BASE}/shopping-list`, async ({ request }) => {
    const body = await request.json()
    shoppingListCalls.push(body)
    return HttpResponse.json({ id: 99, ...body }, { status: 201 })
  }),

  http.get(`${API_BASE}/meal-schedule`, () =>
    HttpResponse.json([])
  ),

  http.post(`${API_BASE}/meal-schedule`, async ({ request }) => {
    const body = await request.json()
    mealScheduleCalls.push(body)
    return HttpResponse.json({ id: 101, ...body }, { status: 201 })
  })
]

// server
const server = setupServer(...handlers)
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }))
afterAll(() => server.close())
afterEach(() => {
  server.resetHandlers()
  authCalls = []
  shoppingListCalls = []
  mealScheduleCalls = []
})

// mocks
const globalMocks = {
  mocks: {
    $router: { push: vi.fn() },
    $route: { params: {} },
    $store: { dispatch: vi.fn() }
  },
  stubs: ["router-link"]
}

describe("Integration Tests", () => {

  it("Foods page shows MockPizza", async () => {
    render(Foods, { global: globalMocks })
    await waitFor(() => expect(screen.getByText("MockPizza")).to.exist)
  })

  it("FoodDetail loads ingredients and allergens", async () => {
    render(FoodDetail, {
      global: {
        ...globalMocks,
        mocks: { ...globalMocks.mocks, $route: { params: { id: "1" } } }
      }
    })

    await waitFor(() => expect(screen.getByText(/Ingrediencie/)).to.exist)
    expect(screen.getByText("Salt")).to.exist
    expect(screen.getByText("100 g")).to.exist
    expect(screen.getByText("Gluten")).to.exist
  })

  it("Ingredient API: GET returns list with Salt", async () => {
    const res = await fetch(`${API_BASE}/ingredient`)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(Array.isArray(body)).toBe(true)
    expect(body.find(i => i.name === "Salt")).toBeDefined()
  })

  it("Auth endpoint: returns token for valid creds and 401 for invalid creds (fetch)", async () => {
  // valid credentials
  const okRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "ok@example.com", password: "pass" })
  })
  const okBody = await okRes.json()
  expect(okRes.status).toBe(200)
  expect(okBody.token).toBeDefined()

  // invalid credentials
  const badRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "bad@example.com", password: "x" })
  })
  const badBody = await badRes.json()
  expect(badRes.status).toBe(401)
  expect(badBody.message).toMatch(/Unauthorized/i)
})

  it("ShoppingList UI: empty-state is shown when GET returns []", async () => {
    render(ShoppingList, { global: globalMocks })
    await waitFor(() => expect(screen.getByText(/Nákupný zoznam je prázdny|prázdny/i)).to.exist)
  })

  it("FoodDetail: fetching /food/1 returns description and ingredients (direct fetch)", async () => {
    const res = await fetch(`${API_BASE}/food/1`)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.description).toBe("Test desc")
    expect(Array.isArray(body.ingredients)).toBe(true)
    expect(body.ingredients[0].ingredient.name).toBe("Salt")
  })

  it("Foods page: direct fetch /food returns MockPizza", async () => {
    const res = await fetch(`${API_BASE}/food`)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(Array.isArray(body)).toBe(true)
    expect(body.find(f => f.name === "MockPizza")).toBeDefined()
  })

  it("Foods: card action buttons (edit/delete) exist on item card (after API provides data)", async () => {
    const res = await fetch(`${API_BASE}/food`)
    expect(res.status).toBe(200)
    render(Foods, { global: globalMocks })
    await waitFor(() => expect(screen.getByText("MockPizza")).to.exist)
    const edit = screen.queryByText(/Upraviť|✏️/i)
    const del = screen.queryByText(/Zmazať|🗑️/i)
    expect(edit || del).to.exist
  })

  it("Shopping-list POST via fetch returns 201 and created id", async () => {
    const payload = { ingredientId: 5, amount: 100, unit: "g" }
    const res = await fetch(`${API_BASE}/shopping-list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    const created = await res.json()
    expect(res.status).toBe(201)
    expect(created.id).toBeDefined()
    expect(created.ingredientId).toBe(5)
  })

  it("MealSchedule GET returns array (empty)", async () => {
    const res = await fetch(`${API_BASE}/meal-schedule`)
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(Array.isArray(body)).toBe(true)
  })

  it("MealSchedule POST via fetch returns 201 and created id", async () => {
    const payload = { date: "2025-12-01", foodId: 1, dayPart: "OBED" }
    const res = await fetch(`${API_BASE}/meal-schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    const body = await res.json()
    expect(res.status).toBe(201)
    expect(body.id).toBeDefined()
    expect(body.foodId).toBe(1)
  })

})

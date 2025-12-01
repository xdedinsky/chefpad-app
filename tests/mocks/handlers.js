import { http, HttpResponse } from 'msw'

const API_BASE = 'https://chefpad.onrender.com'

export const handlers = [
  // auth
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = await request.json()
    if (body.email === 'bad@example.com') {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return HttpResponse.json({ token: 'mock-token' }, { status: 200 })
  }),

  // foods
  http.get(`${API_BASE}/food`, () =>
    HttpResponse.json([{ id: 1, name: 'MockPizza' }])
  ),

  http.get(`${API_BASE}/food/:id`, ({ params }) => {
    const { id } = params
    return HttpResponse.json({
      id: Number(id),
      name: 'MockPizza',
      description: 'Test desc',
      ingredients: [
        {
          id: 10,
          amount: 100,
          unit: 'g',
          ingredient: { id: 5, name: 'Salt', allergens: [{ id: 1, name: 'Gluten' }] }
        }
      ]
    })
  }),

  // ingredient
  http.get(`${API_BASE}/ingredient`, () =>
    HttpResponse.json([{ id: 5, name: 'Salt' }])
  ),

  // shopping-list
  http.get(`${API_BASE}/shopping-list`, () => HttpResponse.json([])),
  http.post(`${API_BASE}/shopping-list`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 99, ...body }, { status: 201 })
  }),

  // meal-schedule
  http.get(`${API_BASE}/meal-schedule`, () => HttpResponse.json([])),
  http.post(`${API_BASE}/meal-schedule`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 101, ...body }, { status: 201 })
  }),
]

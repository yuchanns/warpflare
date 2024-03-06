import app from "./app"

describe('Example', () => {
  test('GET /', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Hello Warp')
  })
})

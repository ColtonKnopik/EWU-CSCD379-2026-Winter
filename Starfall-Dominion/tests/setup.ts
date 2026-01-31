import { vi } from 'vitest'

vi.stubGlobal('fetch', vi.fn(async () => {
  return {
    text: async () => '',
    json: async () => ({}),
    ok: true,
  } as any
}))

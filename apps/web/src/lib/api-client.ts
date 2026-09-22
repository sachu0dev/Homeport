const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed with ${response.status}`, response.status)
  }

  return response.json() as Promise<T>
}

export interface HealthResponse {
  status: string
  service: string
}

export function getHealth() {
  return apiFetch<HealthResponse>('/health')
}

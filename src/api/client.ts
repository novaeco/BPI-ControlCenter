const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

type RequestOptions = RequestInit & { token?: string | null };

export const apiRequest = async <T>(path: string, init: RequestOptions = {}): Promise<T> => {
  const headers = new Headers(init.headers ?? {});
  headers.set('Content-Type', 'application/json');
  if (init.token) {
    headers.set('Authorization', `Bearer ${init.token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `API request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

// src/lib/fetchWithAuth.ts
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    // Handle unauthorized access
    window.location.href = "/login";
    return;
  }

  return response;
}
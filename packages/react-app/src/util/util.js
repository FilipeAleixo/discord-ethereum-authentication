const baseUrl = 'https://dev.api.vorder.io/app'

export function apiRequest({path, method = 'GET', data, accessToken}) {
  return fetch(`${baseUrl}/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  }).then((res) => res.json())
}

export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function getTokenFromURL() {
  return new URLSearchParams(window.location.search).get('token');
}

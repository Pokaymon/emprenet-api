// Decodificar el payload del JWT
export function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

// Obtener token desde la URL (ej: ?token=abc123)
export function getTokenFromURL() {
  return new URLSearchParams(window.location.search).get('token');
}

// Obtener token desde localStorage
export function getAuthToken() {
  return localStorage.getItem('token');
}

// Guardar token en localStorage
export function saveAuthToken(token) {
  localStorage.setItem('token', token);
}

// Eliminar token (logout)
export function clearAuthToken() {
  localStorage.removeItem('token');
}


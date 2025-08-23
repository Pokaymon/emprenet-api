import { getAuthToken } from '../utils/token.utils.js';

export async function changeAvatar(file) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No autenticado');
  }

  const formData = new FormData();
  formData.append('avatar', file);

  const res = await fetch('/users/avatar', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || 'Error al cambiar avatar');
  }

  return res.json(); // { message, avatar }
}

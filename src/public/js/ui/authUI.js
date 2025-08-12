import { parseJwt } from '../utils/jwt.js';
import { toggleVisibility } from '../utils/dom.js';

export function updateAuthUI({ loginFormContainer, loginButton, userImage }) {
  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(token);

  toggleVisibility(loginFormContainer, !isAuthenticated);
  toggleVisibility(loginButton, !isAuthenticated);
  toggleVisibility(userImage, isAuthenticated);

  if (isAuthenticated) {
    const user = parseJwt(token);
    document.querySelector('[data-role="sidebar-username"]').textContent = user?.username || '';
    document.querySelector('[data-role="sidebar-email"]').textContent = user?.email || '';
  }
}

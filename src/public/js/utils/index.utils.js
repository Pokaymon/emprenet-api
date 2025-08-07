function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    console.error('Token invalido:', e);
    return null;
  }
}

export function updateAuthUI({ loginFormContainer, loginButton, userImage }) {
  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(token);

  toggleVisibility(loginFormContainer, !isAuthenticated);
  toggleVisibility(loginButton, !isAuthenticated);
  toggleVisibility(userImage, isAuthenticated);

  if (isAuthenticated) {
    const user = parseJwt(token);
    const username = user?.username || 'Usuario';
    const email = user?.email || 'example@ejemplo.com';

    const usernameUI = document.querySelector('[data-role="sidebar-username"]');
    const emailUI = document.querySelector('[data-role="sidebar-email"]');

    if (usernameUI) usernameUI.textContent = username;
    if (emailUI) emailUI.textContent = email;
  }
}

function toggleVisibility(element, show) {
  if (!element) return;
  element.classList.toggle('opacity-0', !show);
  element.classList.toggle('pointer-events-none', !show);
}

export async function handleLogin(e, loginFormContainer, loginFormFields, onSuccess) {
  e.preventDefault();

  const email = loginFormFields.querySelector('input[type="email"]').value;
  const password = loginFormFields.querySelector('input[type="password"]').value;

  try {
    const response = await fetch('https://api.emprenet.work/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.message || 'Error desconocido'
      });
    }

    localStorage.setItem('token', data.token);

    Swal.fire({
      icon: data.warning ? 'warning' : 'success',
      title: data.warning ? 'Atención' : 'Login exitoso',
      text: data.warning || data.message
    });

    loginFormFields.reset();

    if (typeof onSuccess === 'function') {
      onSuccess();
    }

  } catch (error) {
    console.error('Login error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo conectar al servidor.'
    });
  }
}

export async function handleRegister(e, registerFormFields) {
  e.preventDefault();

  const [usernameInput, emailInput, passwordInput, confirmPasswordInput] = registerFormFields.querySelectorAll('input');

  const username = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const password_confirmation = confirmPasswordInput.value;

  if (password !== password_confirmation) {
    return Swal.fire({
      icon: 'warning',
      title: 'Contraseñas no coinciden',
      text: 'Asegúrate de que ambas contraseñas sean iguales.'
    });
  }

  try {
    const response = await fetch('https://api.emprenet.work/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, password_confirmation })
    });

    const data = await response.json();

    if (!response.ok) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.message || 'Error en el registro.'
      });
    }

    Swal.fire({
      icon: 'success',
      title: 'Registro exitoso',
      text: data.message || 'Verifica tu correo para activar la cuenta.'
    });

    registerFormFields.reset();
  } catch (error) {
    console.error('Register error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo conectar al servidor.'
    });
  }
}

export function closeSidebar(sidebar) {
  if (!sidebar || sidebar.classList.contains('translate-x-full')) return;
  sidebar.classList.add('translate-x-full');
  sidebar.classList.remove('translate-x-0');
}

export function getTokenFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token');
}

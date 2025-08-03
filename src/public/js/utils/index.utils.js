export function updateUIBasedOnToken({ loginForm, loginButton, userImage }) {
  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(token);

  if (loginForm) {
    loginForm.classList.toggle('opacity-0', isAuthenticated);
    loginForm.classList.toggle('pointer-events-none', isAuthenticated);
  }

  if (loginButton) {
    loginButton.classList.toggle('opacity-0', isAuthenticated);
    loginButton.classList.toggle('pointer-events-none', isAuthenticated);
  }

  if (userImage) {
    userImage.classList.toggle('opacity-0', !isAuthenticated);
    userImage.classList.toggle('pointer-events-none', !isAuthenticated);
  }
}

export async function handleLogin(e, loginForm, loginFormCamps, onSuccess) {
  e.preventDefault();

  const email = loginForm.querySelector('input[type="email"]').value;
  const password = loginForm.querySelector('input[type="password"]').value;

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

    loginFormCamps.reset();

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

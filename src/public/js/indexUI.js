document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('[data-role="login-form"]');
  const rightImage = document.querySelector('[data-role="user-image"]');
  const loginButton = document.querySelector('[data-role="login-button"]');

  // Ocultar leftContainer y rightContainer
  if (loginForm) loginForm.classList.add('hidden');
  if (rightImage) rightImage.classList.add('hidden');

  // Mostrar solo al hacer clic en login
  if (loginButton) {
    loginButton.addEventListener('click', (e) => {
      e.preventDefault(); // Prevenir navegación
      loginForm.classList.remove('hidden');
    });
  }
});

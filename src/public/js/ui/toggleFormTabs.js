export function toggleTabs(loginTab, registerTab, loginForm, registerForm) {
  loginTab.addEventListener('click', () => {
    loginForm.classList.replace('hidden', 'flex');
    registerForm.classList.replace('flex', 'hidden');

    loginTab.classList.replace('inactive', 'active');
    registerTab.classList.replace('active', 'inactive');
  });

  registerTab.addEventListener('click', () => {
    registerForm.classList.replace('hidden', 'flex');
    loginForm.classList.replace('flex', 'hidden');

    registerTab.classList.replace('inactive', 'active');
    loginTab.classList.replace('active', 'inactive');
  });
}

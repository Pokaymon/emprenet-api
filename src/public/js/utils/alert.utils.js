export const alertSuccess = (text) =>
  Swal.fire({ icon: 'success', title: 'Éxito', text });

export const alertError = (text) =>
  Swal.fire({ icon: 'error', title: 'Error', text });

export const alertWarning = (text) =>
  Swal.fire({ icon: 'warning', title: 'Atención', text });

// Función genérica
export function showAlert(type, message) {
  switch (type) {
    case 'success':
      return alertSuccess(message);
    case 'error':
      return alertError(message);
    case 'warning':
      return alertWarning(message);
    default:
      console.warn(`Tipo de alerta no soportado: ${type}`);
  }
}


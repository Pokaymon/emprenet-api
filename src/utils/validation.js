// Validar campos
export const validateRequiredFields = (fields) => {
  return Objet.entries(fields).every(([key, value]) => value !== undefined && value !== '');
};

// Match de contraseñas
export const passwordsMatch = (p1, p2) => p1 === p2;

import User from '../../models/User.js';

const USERNAME_EXACT_PATTERN = /^[a-zA-Z0-9_]{3,30}$/; // ajustar longitudes según tu política
const USERNAME_PARTIAL_MIN = 2;
const USERNAME_PARTIAL_MAX = 30;
const MAX_LIMIT = 50;

export async function searchUser(req, res) {
  try {
    // Query params:
    // q -> término (puede incluir @)
    // mode -> 'exact' | 'partial' (default exact if starts with @)
    // page, limit para paginación (solo para partial)
    const q = (req.query.q || '').trim();
    if (!q) return res.status(400).json({ message: 'Parámetro q es requerido.' });

    // Normalizar: si viene con '@', considerar búsqueda exacta
    const isAt = q.startsWith('@');
    const raw = isAt ? q.slice(1) : q;
    const term = raw.trim();

    if (!term) return res.status(400).json({ message: 'Nombre de usuario inválido.' });

    const mode = (req.query.mode || (isAt ? 'exact' : 'partial')).toLowerCase();

    if (mode === 'exact') {
      // Validación estricta
      if (!USERNAME_EXACT_PATTERN.test(term)) {
        return res.status(400).json({ message: 'Formato de username inválido.' });
      }

      const user = await User.findByUsernameExact(term);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

      // Entregamos sólo lo mínimo necesario
      return res.json({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        email_verified: Boolean(user.email_verified)
      });
    }

    if (mode === 'partial') {
      // Validar term length
      if (term.length < USERNAME_PARTIAL_MIN || term.length > USERNAME_PARTIAL_MAX) {
        return res.status(400).json({ message: `El término debe tener entre ${USERNAME_PARTIAL_MIN} y ${USERNAME_PARTIAL_MAX} caracteres.` });
      }

      const page = Math.max(1, parseInt(req.query.page || '1', 10));
      const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit || '10', 10)));

      const results = await User.searchByUsernamePartial(term, page, limit);

      // Mapear para seguridad
      const mapped = results.map(u => ({
        id: u.id,
        username: u.username,
        avatar: u.avatar,
        email_verified: Boolean(u.email_verified)
      }));

      return res.json({
        page,
        limit,
        results: mapped
      });
    }

    return res.status(400).json({ message: 'Modo inválido. Usa `exact` o `partial`.' });
  } catch (err) {
    console.error('Error en searchUser:', err);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

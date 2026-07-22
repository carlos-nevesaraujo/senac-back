import jwt from 'jsonwebtoken';

export function autenticarJWT(req, res, next) {
  const headerAuth = String(req.headers.authorization || '').trim();

  if (!headerAuth) {
    return res.status(401).json({ mensagem: 'Token não enviado.' });
  }

  // Aceita tanto "Bearer <token>" quanto apenas "<token>".
  const token = headerAuth.toLowerCase().startsWith('bearer ')
    ? headerAuth.slice(7).trim()
    : headerAuth;

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não enviado.' });
  }

  try {
    // Se token for valido, payload volta com os dados gravados no login.
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = payload.usuarioId;

    return next();
  } catch (erro) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}

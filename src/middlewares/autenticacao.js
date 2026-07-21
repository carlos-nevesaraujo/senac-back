import jwt from 'jsonwebtoken';

export function autenticarJWT(req, res, next) {
  // Formato esperado: Authorization: Bearer <token>
  const headerAuth = req.headers.authorization;

  if (!headerAuth || !headerAuth.startsWith('Bearer ')) {
    return res.status(401).json({ mensagem: 'Token não enviado.' });
  }

  const token = headerAuth.split(' ')[1];

  try {
    // Se token for valido, payload volta com os dados gravados no login.
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = payload.usuarioId;

    return next();
  } catch (erro) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}

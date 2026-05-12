// Vercel Serverless Function — Admin authentication
// La contraseña se verifica server-side. Nunca expuesta en el bundle del cliente.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ ok: false, error: 'Admin no configurado.' });
  }

  const { password } = req.body || {};
  if (!password) {
    return res.status(400).json({ ok: false, error: 'Contraseña requerida.' });
  }

  if (password === ADMIN_PASSWORD) {
    return res.status(200).json({ ok: true });
  }

  // Delay para evitar brute-force
  await new Promise(r => setTimeout(r, 800));
  return res.status(401).json({ ok: false, error: 'Contraseña incorrecta.' });
}

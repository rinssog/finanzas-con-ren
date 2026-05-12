// Vercel Serverless Function — Mercado Pago preference creation
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  if (!MP_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'MP_ACCESS_TOKEN no configurado en variables de entorno.' });
  }

  const { successUrl, failureUrl, pendingUrl } = req.body || {};

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            id: 'consulta-calculadora',
            title: 'Consulta — Calculadora de Préstamos y Deudas',
            description: 'Resultados comparados de préstamos bancarios en Argentina.',
            quantity: 1,
            unit_price: 1000.0,
            currency_id: 'ARS',
          },
        ],
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl,
        },
        auto_return: 'approved',
        statement_descriptor: 'FINANZAS CON REN',
        external_reference: `consulta_${Date.now()}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errText = typeof data === 'object' ? (data.message || data.error || JSON.stringify(data)) : 'Error MP';
      console.error('MP error status:', response.status, JSON.stringify(data));
      return res.status(response.status).json({ error: errText });
    }

    return res.json({
      status: 'ok',
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
      id: data.id,
    });
  } catch (err) {
    console.error('Serverless error:', err);
    return res.status(500).json({ error: 'Error interno. Intentá nuevamente.' });
  }
}

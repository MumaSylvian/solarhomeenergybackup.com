type OrderRequest = { method?: string; body?: unknown };
type OrderResponse = { status: (code: number) => OrderResponse; json: (body: unknown) => unknown };

export default async function orderRequest(request: OrderRequest, response: OrderResponse) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  const endpoint = process.env.ORDER_REQUEST_WEBHOOK_URL;
  if (!endpoint) return response.status(503).json({ error: 'Order delivery is not connected yet. Add the secure order destination before accepting requests.' });
  const result = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(request.body) });
  if (!result.ok) return response.status(502).json({ error: 'We could not deliver the order request. Please try again.' });
  return response.status(202).json({ ok: true, reference: `SHR-${Date.now().toString(36).toUpperCase()}` });
}

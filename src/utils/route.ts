export async function JSON_POST(path: string, request: Request): Promise<Response> {
  const res = await fetch(`${process.env.API_URL}${path}`, {
    method: 'POST',
    headers: { ...request.headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(await request.json()),
  });
  return Response.json(await res.json());
}

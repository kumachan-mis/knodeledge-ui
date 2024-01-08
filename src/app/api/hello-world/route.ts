export async function POST(request: Request) {
  const res = await fetch(`${process.env.API_URL}/api/hello-world`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(await request.json()),
  });
  return Response.json(await res.json());
}

'use server';

export async function fetchHelloWorld(request: { name?: string }): Promise<string> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hello-world`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const data = await response.json();
  return data.message;
}

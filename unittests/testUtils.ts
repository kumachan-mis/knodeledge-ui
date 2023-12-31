export function createOkResponse<T>(data: T): Partial<Response> {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  };
}

process.env = {
  ...process.env,
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
};

export function createOkResponse<T>(data: T): Partial<Response> {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  };
}

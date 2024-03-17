export function createOkResponse<T>(data: T): Partial<Response> {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  };
}

export function createErrorResponse<T>(data: T): Partial<Response> {
  return {
    ok: false,
    status: 500,
    json: () => Promise.resolve(data),
  };
}

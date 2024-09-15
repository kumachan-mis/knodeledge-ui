export function createOkResponse(data: unknown): Partial<Response> {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  };
}

export function createBadRequestResponse(data: unknown): Partial<Response> {
  return {
    ok: false,
    status: 400,
    json: () => Promise.resolve(data),
  };
}

export function createNotFoundResponse(data: unknown): Partial<Response> {
  return {
    ok: false,
    status: 404,
    json: () => Promise.resolve(data),
  };
}

export function createInternalErrorResponse(data: unknown): Partial<Response> {
  return {
    ok: false,
    status: 500,
    json: () => Promise.resolve(data),
  };
}

export function createOkResponse<T>(data: T): Partial<Response> {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
  };
}

export function createBadRequestResponse<T>(data: T): Partial<Response> {
  return {
    ok: false,
    status: 400,
    json: () => Promise.resolve(data),
  };
}

export function createNotFoundResponse<T>(data: T): Partial<Response> {
  return {
    ok: false,
    status: 404,
    json: () => Promise.resolve(data),
  };
}

export function createInternalErrorResponse<T>(data: T): Partial<Response> {
  return {
    ok: false,
    status: 500,
    json: () => Promise.resolve(data),
  };
}

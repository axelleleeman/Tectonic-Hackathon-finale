// One JSON error format for every API response: { error: { code, message } }.
// Codes are stable and safe to branch on in clients; messages are human-readable and may change.

export const ERROR_CODES = {
  400: 'bad_request',
  401: 'unauthorized',
  403: 'forbidden_origin',
  404: 'not_found',
  413: 'payload_too_large',
  415: 'unsupported_media_type',
  429: 'rate_limited',
  500: 'internal',
  503: 'unavailable',
}

export class HttpError extends Error {
  constructor(status, message, code = ERROR_CODES[status] ?? 'internal') {
    super(message)
    this.status = status
    this.code = code
  }
}

// Body for a caught error. Internal errors never reveal details.
export function errorBody(err) {
  if (err instanceof HttpError) return { error: { code: err.code, message: err.message } }
  return { error: { code: 'internal', message: 'Internal server error' } }
}

export const statusOf = (err) => (err instanceof HttpError ? err.status : 500)

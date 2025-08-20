export const HttpStatus = {
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus];
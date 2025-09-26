// 공통 타입 지정
export type ApiSuccess<T> = { status: 'success'; data: T };
export type ApiError = { status: 'error'; message: string; code?: string; details?: unknown };

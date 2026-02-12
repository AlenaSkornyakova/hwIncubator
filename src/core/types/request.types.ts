import type { Request } from 'express';

export type RequestWithBody<B> = Request<{}, any, B>;
export type RequestWithQuery<Q> = Request<{}, any, any, Q>;
export type RequestWithParams<P> = Request<P>;
export type RequestWithParamsAndBody<P, B> = Request<P, any, B>;



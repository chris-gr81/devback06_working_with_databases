import { NextFunction, Response, Request } from "express";
import { HttpException } from "../db/error/HttpException";
import { InternalServerError } from "../db/error/InternalServerError";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);
  if (err instanceof HttpException || err instanceof InternalServerError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: "An internal error has occurred" });
}

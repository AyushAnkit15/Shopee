import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";

import { Controller } from "../types/types.js";
export const errorf = (
  error: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.message ||= "Internal Server Error";
  error.statusCode ||= 500;
  return res.status(error.statusCode).json({
    success: false + "that function is not defined",
    error: true,
    message: error.message,
  });
};

export const TryCatch =
  (func: Controller) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };

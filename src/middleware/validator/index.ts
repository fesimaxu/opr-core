import { Request, Response ,NextFunction } from "express";
import { validationResult } from "express-validator";
import { sendErrorResponse } from "../../utils/response";

export * from "./inputValidator";

// validate input
export const validator = (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req).array();
  if (error.length) {
    return sendErrorResponse(res, 400, { error: error[0].msg });
  }

  next();
};
import { Request, Response, NextFunction } from "express";
import { IUser } from "../../interface/user";
import { UserInstance } from "../../model/user";
import { verifyToken } from "../../service/authService";
import { sendErrorResponse } from "../../utils/response";

export const isAuth = async (req: any, res: Response, next: NextFunction) => {
    try {
      const token = req.headers?.authorization;
  
      if (!token)
        return sendErrorResponse(
          res,
          401,
          "Invalid token!",
          "Unauthorized Access!"
        );
  
      const jwtToken = token?.split("Bearer ")[1];
  
      if (!jwtToken)
        return sendErrorResponse(
          res,
          401,
          "Invalid token!",
          "Unauthorized Access!"
        );
  
      const decode: any = verifyToken(jwtToken)
  
      const { expiresIn }: any = decode;
      if (Date.now() >= expiresIn * 1000) {
        return sendErrorResponse(
          res,
          401,
          "token time expired!",
          "Unauthorized Access!"
        );
      }
      const { id }: any = decode;
  
      const user = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as IUser;
      if (!user) return sendErrorResponse(res, 401, "Unauthorized User!");
      req.user = user;
  
      next();
    } catch (err: any) {
      sendErrorResponse(res, 401, err);
    }
  };
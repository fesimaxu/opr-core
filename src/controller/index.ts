import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { UserInstance } from "../model/user";
import { IUser } from "../interface/user";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { hashPassword, verifyPassword } from "../service/authService";

export const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, phoneNumber } = req.body;

    const isExistingUser = await UserInstance.findOne({
      where: {
        email,
      },
    });

    if(isExistingUser) {
      sendErrorResponse(res, 404, "User already exist");
    }

    const hashedPassword = await hashPassword(password);

    const user = (await UserInstance.create({
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      registrationDate: `${new Date()}`,
    })) as unknown as IUser;

    sendSuccessResponse(res, 200, user);
  } catch (error) {
    sendErrorResponse(res, 500, "internal server error");
  }
};

export const signInController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const isExistingUser = (await UserInstance.findOne({
      where: {
        email,
      },
    })) as unknown as IUser;

    if (!isExistingUser) {
      sendErrorResponse(res, 404, "User not found");
    }

    const isConfirmedUser = verifyPassword(password, isExistingUser.password);

    if (!isConfirmedUser) {
      sendErrorResponse(res, 401, "invalid user email/password");
    }

    sendSuccessResponse(res, 200, "logged in successfully");
  } catch (error) {
    sendErrorResponse(res, 500, "internal server error")
  }
};

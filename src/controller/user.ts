import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { UserInstance } from "../model/user";
import { IUser } from "../interface/user";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import {
  addPhoneCountryCode,
  generateToken,
  hashValue,
  verifyHash,
} from "../service/authService";

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

    if (isExistingUser) {
      sendErrorResponse(res, 404, "User already exist");
    }

    const hashedPassword = await hashValue(password);

    const user = (await UserInstance.create({
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      phoneNumber: addPhoneCountryCode(phoneNumber),
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

    const user = (await UserInstance.findOne({
      where: {
        email,
      },
    })) as unknown as IUser;

    if (!user) {
      sendErrorResponse(res, 404, "User not found");
    }

    const isConfirmedUser = verifyHash(password, user.password);

    if (!isConfirmedUser) {
      sendErrorResponse(res, 401, "invalid user email/password");
    }

    const token = generateToken(user.id);

    const verifiedUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      token,
    };

    sendSuccessResponse(res, 200, verifiedUser);
  } catch (error) {
    sendErrorResponse(res, 500, "internal server error");
  }
};

export const updateUserPasswordController = async (req: any, res: Response) => {
  try {
    const userId: string = (req.user as unknown as IUser).id;

    const { currentPassword, newPassword } = req.body;

    const user = (await UserInstance.findOne({
      where: { id: userId },
    })) as unknown as IUser;

    const isMatchedPassword = verifyHash(currentPassword, user.password);

    if (!isMatchedPassword) {
      sendErrorResponse(res, 401, "Invalid current password");
    }

    const updateField: Partial<IUser> = {};

    const hashedPassword = await hashValue(newPassword)

    if (newPassword !== "") {
      updateField.password = hashedPassword;
    }

    const updatedUser = (await UserInstance.update(updateField, {
      where: { id: userId },
    })) as unknown as IUser;

    if (!updatedUser) {
      sendErrorResponse(res, 401, "failed to update user password");
    }

    sendSuccessResponse(res, 200, "updated user password successfully");
  } catch (error) {
    sendErrorResponse(res, 500, "interval server error");
  }
};



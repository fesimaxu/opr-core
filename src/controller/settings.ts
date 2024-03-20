import { NextFunction, Request, Response } from "express";
import {
  addPhoneCountryCode,
  hashValue,
  verifyHash,
} from "../service/authService";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response";
import { UserInstance } from "../model/user";
import { OtpInstance } from "../model/otp";
import { IOTP, IUser } from "../interface/user";
import { generate } from "otp-generator";
import { sendSMS } from "../service/messaging";

export const resetPasswordOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { phoneNumber } = req.body;
    phoneNumber = addPhoneCountryCode(phoneNumber);
    if (!phoneNumber)
      return sendErrorResponse(res, 400, "phoneNumber is missing");

    const user = (await UserInstance.findOne({
      where: { phoneNumber },
    })) as unknown as IUser;
    if (!user) return sendErrorResponse(res, 404, "User not found!");

    const alreadyHasOtp = (await OtpInstance.findOne({
      where: { userId: user.id },
    })) as unknown as IOTP;

    if (alreadyHasOtp)
      return sendErrorResponse(
        res,
        400,
        "Wait for five(5) minutes before requesting another otp"
      );

    const otp = generate(6, { upperCaseAlphabets: true, specialChars: true });

    const hashedOtp = await hashValue(otp);

    const newOtp = (await OtpInstance.create({
      userId: user.id,
      otp: hashedOtp,
    })) as unknown as IOTP;

    if (newOtp) {
      await sendSMS(`${otp}`, phoneNumber, 5);
    } else {
      sendErrorResponse(res, 500, "failed to generate otp");
    }

    sendSuccessResponse(
      res,
      200,
      { userId: user.id },
      `An OTP has been sent to ${phoneNumber.slice(
        0,
        4
      )} *** *** **${phoneNumber.slice(-2)} please enter OTP`
    );
  } catch (err: any) {
    sendErrorResponse(res, 500, err);
  }
};

export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { otp } = req.body;

    const user = (await UserInstance.findOne({
      where: { id: userId },
    })) as unknown as IUser;

    if (!user) {
      sendErrorResponse(res, 404, "user not found");
    }

    const userOtp = (await OtpInstance.findOne({
      where: { userId: user.id },
    })) as unknown as IOTP;

    if (!userOtp) {
      sendErrorResponse(res, 404, "otp not found");
    }

    const isMatchedOtp = await verifyHash(otp, userOtp.otp);

    if (!isMatchedOtp) {
      sendErrorResponse(res, 401, "Please submit a valid otp!");
    }

    await OtpInstance.destroy({ where: { userId: user.id, otp: userOtp.otp } });

    sendSuccessResponse(
      res,
      200,
      { data: { phoneNumber: user.phoneNumber, userId: user.id } },
      `Your password has been reset`
    );

    res.end();
  } catch (error) {
    sendErrorResponse(res, 500, "internal server error");
  }
};


export const resetUserPasswordController = async ( req: any, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword)
      return sendErrorResponse(
        res,
        400,
        "password and confirm password do not match!"
      );

    const user = (await UserInstance.findOne({
      where: { id: userId },
    })) as unknown as IUser;

    if (!user) {
      sendErrorResponse(res, 404, "User not found");
    }

    const updatedFields: Partial<IUser> = {};

    if (newPassword !== "") {
      const hashedPassword = await hashValue(newPassword);
      updatedFields.password = hashedPassword;
    }

    const updatedUser = (await UserInstance.update(updatedFields, {
      where: { id: userId },
    })) as unknown as IUser;

    if (!updatedUser) {
      sendErrorResponse(res, 404, "Password failed to update.");
    }

    sendSuccessResponse(res, 200, "Password updated successfully.");

  } catch (error) {
    sendErrorResponse(res, 500, "internal server error")
  }
}
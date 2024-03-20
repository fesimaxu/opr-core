import { Router } from "express";
import { EndPoints } from "../utils/endpoints";
import {
  resetPasswordOtpController,
  resetUserPasswordController,
  verifyOtpController,
} from "../controller/settings";
import {
  dataValidator,
  validatePhoneNumber,
  validateUserOtp,
  validateUserPassword,
} from "../middleware/validator";

const router = Router();

router.post(
  EndPoints.resetPasswordOtp,
  validatePhoneNumber,
  dataValidator,
  resetPasswordOtpController
);

router.post(
  EndPoints.verifyOtp,
  validateUserOtp,
  dataValidator,
  verifyOtpController
);

router.put(
  EndPoints.resetUserPassword,
  validateUserPassword,
  dataValidator,
  resetUserPasswordController
);

export default router;

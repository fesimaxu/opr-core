import { Router } from "express";
import { signInController, signUpController, updateUserPasswordController } from "../controller/user";
import { EndPoints } from "../utils/endpoints";
import { dataValidator, validateSignIn, validateSignUp, validateSetPassword } from "../middleware/validator";
import { isAuth } from "../middleware/auth";



const router = Router();

router.post(EndPoints.signUpUser, validateSignUp, dataValidator, signUpController);

router.post(EndPoints.signInUser, validateSignIn, dataValidator, signInController);

router.put(EndPoints.updateUserPassword, isAuth, validateSetPassword, dataValidator, updateUserPasswordController);

export default router;
import { Router } from "express";
import { signInController, signUpController } from "../controller";
import { EndPoints } from "../utils/endpoints";
import { validator, validateSignIn, validateSignUp } from "../middleware/validator";



const router = Router();

router.post(EndPoints.signUpUser, validateSignUp, validator, signUpController);

router.post(EndPoints.signInUser, validateSignIn, validator, signInController);

export default router;
import { check } from "express-validator";



export const validateSignUp = [
    check("username").trim().not().isEmpty().withMessage("Username is missing!"),
    check("email")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Email is missing!")
      .isEmail(),
    check("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Password is missing!")
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be 8 to 20 characters long!")
      .isStrongPassword()
      .withMessage("Password isn't strong"),
      check("phoneNumber")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Phone number is missing!"),
  ];


  export const validateSignIn = [
    check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email is missing!")
    .isEmail(),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is missing!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long!")
    .isStrongPassword()
    .withMessage("Password isn't strong"),
  ]
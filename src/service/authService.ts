import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const generateSalt = async () => {
  const saltRounds = 10;
  return bcrypt.genSalt(saltRounds);
};
export const hashValue = async (password: string) => {
  const salt = await generateSalt();

  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const verifyHash = async (
  plainPassword: string,
  hashPassword: string
) => {
  return await bcrypt.compare(plainPassword, hashPassword);
};


export const generateToken = (id: string): string => {
  return jwt.sign({ id }, `${process.env.JWT_SECERET_KEY}`, {
    expiresIn: '5m'
  });
};

export const verifyToken = (jwtToken: string) => {
  return jwt.verify(jwtToken, `${process.env.JWT_SECERET_KEY}`);
};


export const addPhoneCountryCode = (phoneNumber: string) => phoneNumber.replace(/^(0|\+234)(?=\d)/, "+234");
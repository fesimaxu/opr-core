import bcrypt from "bcrypt";
import { config } from "dotenv";
config();

const generateSalt = async () => {
  const saltRounds = 10;
  return bcrypt.genSalt(saltRounds);
};
export const hashPassword = async (password: string) => {
  const salt = await generateSalt();

  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const verifyPassword = async (
  plainPassword: string,
  hashPassword: string
) => {
  return await bcrypt.compare(plainPassword, hashPassword);
};

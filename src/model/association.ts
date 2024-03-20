import { OtpInstance } from "./otp";
import { UserInstance } from "./user";



OtpInstance.belongsTo(UserInstance, {
    foreignKey: "userId",
    as: "user",
  });
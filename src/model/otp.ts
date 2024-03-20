import { DataTypes, Model } from "sequelize";
import { IOTP } from "../interface/user";
import { db } from "../config/db";

export class OtpInstance extends Model<IOTP> {}

OtpInstance.init(
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize: db,
    tableName: `OTP`,
    modelName: `OtpInstance`
  }
);


import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { AuthProvider, IUser, UserRole } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { envVars } from "../../configs/envConfig";

const createUser = async (payload: IUser) => {
  const { email, role, password, ...rest } = payload;

  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exist..!");
  }

  if (role === UserRole.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "You are unauthorized..!");
  }

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND) | 10
  );

  const authProvider: AuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    role: UserRole.USER,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

export const userServices = {
  createUser,
};

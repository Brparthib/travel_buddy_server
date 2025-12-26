import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../configs/envConfig";
import { IUser, UserStatus } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT.JWT_ACCESS_SECRET,
    envVars.JWT.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT.JWT_REFRESH_SECRET,
    envVars.JWT.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExists = await User.findOne({
    email: verifiedRefreshToken.email,
  });
  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist!");
  }

  if (isUserExists.status === UserStatus.BLOCKED) {
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${UserStatus.BLOCKED}`);
  }

  if (isUserExists.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  const jwtPayload = {
    userId: isUserExists._id,
    email: isUserExists.email,
    role: isUserExists.role,
  };

  const newAccessToken = generateToken(
    jwtPayload,
    envVars.JWT.JWT_ACCESS_SECRET,
    envVars.JWT.JWT_ACCESS_EXPIRES
  );

  return newAccessToken;
};

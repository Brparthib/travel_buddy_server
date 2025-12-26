import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { envVars } from "../configs/envConfig";
import { UserStatus } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization || req.cookies.accessToken;
      if (!accessToken) {
        throw new AppError(httpStatus.FORBIDDEN, "No Token Received!!");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const isUserExists = await User.findOne({ email: verifiedToken.email });
      if (!isUserExists) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exists!!");
      }

      if (
        isUserExists.status === UserStatus.BLOCKED ||
        isUserExists.status === UserStatus.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExists.status}!!`
        );
      }

      if (isUserExists.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, "User does not found!!");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "Unauthorized Access Happening!!"
        );
      }

      req.user = verifiedToken;

      next();
    } catch (error) {
      next(error);
    }
  };

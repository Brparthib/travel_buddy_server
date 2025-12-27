import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `User Created Successfully.`,
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const verifiedToken = req.user as JwtPayload;
  const user = await userServices.getUserById(verifiedToken.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users Retrieved Successfully.",
    data: user,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const payload = req.body;
  const verifiedToken = req.user as JwtPayload;
  const result = await userServices.updateUser(userId, payload, verifiedToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Updated Successfully.",
    data: result,
  });
});

const deletedUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.deleteUser(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Deleted Successfully.",
    data: result,
  });
});

export const userControllers = {
  createUser,
  getUserById,
  updateUser,
  deletedUser,
};

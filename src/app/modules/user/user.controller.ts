/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IUser } from "./user.interface";
import { UserService } from "./user.service";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Created Successfully!",
      data: result,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await UserService.getAllUsers(
      query as Record<string, string>
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Users Retrieved Successfully!",
      data: result.data,
      meta: result.meta,
    });
  }
);
const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserService.getMe(decodedToken.userId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Your Profile Retrieved Successfully!",
      data: result.data,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;

    const payload: IUser = {
      ...req.body,
      picture: req.file?.path,
    };
    const verifiedToken = req.user; //alternative way of verifyToken function using.

    const result = await UserService.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Updated Successfully!",
      data: result,
    });
  }
);

export const UserControllers = { createUser, getAllUsers, updateUser, getMe };

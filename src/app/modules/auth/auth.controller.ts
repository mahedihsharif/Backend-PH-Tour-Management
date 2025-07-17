import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const credentialsLogin = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthServices.credentialsLogin(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Login Successfully!",
      data: result,
    });
  }
);

export const AuthControllers = { credentialsLogin };

/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userTokens";
import { IAuthError } from "./auth.interface";
import { AuthServices } from "./auth.service";

//Custom login with only express.js
// const credentialsLoginUsingExpressJs = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const loginInfo = await AuthServices.credentialsLogin(req.body);

//     setAuthCookie(res, loginInfo);

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "User Logged In Successfully!",
//       data: loginInfo,
//     });
//   }
// );

//Custom login with Passport.js
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (!user) {
        if (info.type === IAuthError.NOT_FOUND) {
          return next(
            new AppError(httpStatus.NOT_FOUND, info.message, info.type)
          );
        } else if (info.type === IAuthError.NOT_VERIFIED) {
          return next(
            new AppError(httpStatus.FORBIDDEN, info.message, info.type)
          );
        } else if (info.type === IAuthError.UNAUTHORIZED) {
          return next(
            new AppError(httpStatus.UNAUTHORIZED, info.message, info.type)
          );
        }
      }

      const userTokens = createUserTokens(user);

      setAuthCookie(res, userTokens);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Logged In Successfully!",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: user,
        },
      });
    })(req, res, next);
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received!");
    }

    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    );
    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New Access Token Retrieved Successfully!",
      data: tokenInfo,
    });
  }
);

const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const { password } = req.body;
    await AuthServices.setPassword(decodedToken.userId, password);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Set Successfully!",
      data: null,
    });
  }
);
const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    await AuthServices.forgotPassword(email);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Email Sent Successfully",
      data: null,
    });
  }
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    await AuthServices.resetPassword(req.body, decodedToken as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Reset Successfully",
      data: null,
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    const decodedToken = req.user;

    await AuthServices.changePassword(
      oldPassword,
      newPassword,
      confirmPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Changed Successfully!",
      data: null,
    });
  }
);

const googleCallBack = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
    }

    const tokenInfo = createUserTokens(user);
    setAuthCookie(res, tokenInfo);
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

const logout = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Logout Successfully!",
      data: null,
    });
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
  changePassword,
  setPassword,
  forgotPassword,
  googleCallBack,
  logout,
};

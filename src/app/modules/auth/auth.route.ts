import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { AuthControllers } from "./auth.controller";
import {
  createForgetPasswordZodSchema,
  createResetPasswordZodSchema,
} from "./auth.validation";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.changePassword
);
router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.setPassword
);
router.post(
  "/forgot-password",
  validateRequest(createForgetPasswordZodSchema),
  AuthControllers.forgotPassword
);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  validateRequest(createResetPasswordZodSchema),
  AuthControllers.resetPassword
);

router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FRONTEND_URL}/login?error=There are some issues with your account, please contact our support system`,
  }),
  AuthControllers.googleCallBack
);
router.post("/logout", AuthControllers.logout);

export const AuthRoutes = router;

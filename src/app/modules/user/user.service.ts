import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isExistUser = await User.findById(userId);
  if (!isExistUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't found!");
  }

  // 1. Check if trying to update someone else's data
  const isSelf = decodedToken.userId === userId;

  if (!isSelf) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to update other users' data!"
      );
    }

    // ADMIN can only update USER and GUIDE not update to other ADMIN or SUPER_ADMIN
    if (
      decodedToken.role === Role.ADMIN &&
      (isExistUser.role === Role.ADMIN || isExistUser.role === Role.SUPER_ADMIN)
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Admin cannot update other Admin or Super Admin!"
      );
    }
  }

  // 2. If trying to change role
  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to change roles!"
      );
    }
    // Prevent ADMIN from assigning SUPER_ADMIN
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Admins cannot assign Super Admin role!"
      );
    }
  }

  // 3. If trying to change status fields
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to update status fields!"
      );
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

export const UserServices = { createUser, getAllUsers, updateUser };

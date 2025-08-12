import httpStatus from "http-status-codes";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: IDivision) => {
  const existingDivision = await Division.findOne({ name: payload.name });
  if (existingDivision) {
    throw new Error("A Division with this name already exists!");
  }

  const division = await Division.create(payload);
  return division;
};

const getAllDivisions = async () => {
  const divisions = await Division.find({});
  const totalDivisions = await Division.countDocuments();

  return {
    data: divisions,
    meta: {
      total: totalDivisions,
    },
  };
};

const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug: slug });
  return {
    data: division,
  };
};

const updateDivision = async (payload: Partial<IDivision>, id: string) => {
  const session = await Division.startSession();
  session.startTransaction();
  try {
    const existingDivision = await Division.findById(id);
    if (!existingDivision) {
      throw new AppError(httpStatus.BAD_REQUEST, "Division not found");
    }

    const duplicateDivision = await Division.findOne({
      name: payload.name,
      _id: { $ne: id },
    });

    if (duplicateDivision) {
      throw new Error("A Division with this name already exists.");
    }

    const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
      session: session,
    });

    if (payload.thumbnail && existingDivision.thumbnail) {
      await deleteImageFromCLoudinary(existingDivision.thumbnail);
    }
    await session.commitTransaction();
    session.endSession();
    return updatedDivision;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteDivision = async (id: string) => {
  const division = await Division.findById(id);
  if (!division) {
    throw new AppError(httpStatus.NOT_FOUND, "Division not found");
  }
  await Division.findByIdAndDelete(id);
  return null;
};

export const DivisionService = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};

import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IDivision } from "./division.interface";
import { DivisionService } from "./division.service";

const createDivision = catchAsync(async (req: Request, res: Response) => {
  const payload: IDivision = {
    ...req.body,
    thumbnail: req.file?.path,
  };

  const result = await DivisionService.createDivision(payload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Division Created",
    data: result,
  });
});

const getAllDivisions = catchAsync(async (req: Request, res: Response) => {
  const result = await DivisionService.getAllDivisions();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All divisions retrieved successfully",
    data: result,
  });
});

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await DivisionService.getSingleDivision(slug);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Division retrieved",
    data: result.data,
  });
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload: IDivision = {
    ...req.body,
    thumbnail: req.file?.path,
  };
  const result = await DivisionService.updateDivision(payload, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Division update successfully",
    data: result,
  });
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await DivisionService.deleteDivision(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Division deleted",
    data: result,
  });
});

export const DivisionController = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};

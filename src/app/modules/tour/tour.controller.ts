import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TourService } from "./tour.service";

/*---------------- Tour Type Controller ----------------*/
const createTourType = catchAsync(async (req: Request, res: Response) => {
  const result = await TourService.createTourType(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Tour Type Created",
    data: result,
  });
});

const getAllTourTypes = catchAsync(async (_req: Request, res: Response) => {
  const result = await TourService.getAllTourTypes();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Tour Types retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourService.getSingleTourType(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour Type retrieved successfully",
    data: result,
  });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourService.updateTourType(req.body, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour Type updated successfully",
    data: result,
  });
});

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourService.deleteTourType(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour Type deleted",
    data: result,
  });
});

/*---------------- Tour Controller ----------------*/
const createTour = catchAsync(async (req: Request, res: Response) => {
  const result = await TourService.createTour(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Tour Created",
    data: result,
  });
});

const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await TourService.getAllTours(query as Record<string, string>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Tours retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourService.getSingleTour(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour retrieved successfully",
    data: result,
  });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourService.updateTour(req.body, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour updated successfully",
    data: result,
  });
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourService.deleteTour(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour deleted",
    data: result,
  });
});

export const TourController = {
  createTourType,
  getAllTourTypes,
  getSingleTourType,
  updateTourType,
  deleteTourType,
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
};

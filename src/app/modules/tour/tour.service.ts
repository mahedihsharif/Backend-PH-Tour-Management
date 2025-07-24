import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

/*---------------- Tour Type Service ----------------*/
const createTourType = async (payload: ITourType) => {
  const tourType = await TourType.create(payload);
  return tourType;
};

const getAllTourTypes = async () => {
  const tourTypes = await TourType.find({});
  const totalTourTypes = await TourType.countDocuments();
  return {
    data: tourTypes,
    meta: {
      total: totalTourTypes,
    },
  };
};

const getSingleTourType = async (id: string) => {
  const tourType = await TourType.findById(id);
  if (!tourType) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour Type not found");
  }
  return tourType;
};

const updateTourType = async (payload: Partial<ITourType>, id: string) => {
  const existingTourType = await TourType.findById(id);
  if (!existingTourType) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour Type not found");
  }

  const updatedTourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updatedTourType;
};

const deleteTourType = async (id: string) => {
  const tourType = await TourType.findById(id);
  if (!tourType) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour Type not found");
  }
  await TourType.findByIdAndDelete(id);
  return null;
};

/*---------------- Tour Service ----------------*/
const createTour = async (payload: ITour) => {
  const tour = await Tour.create(payload);
  return tour;
};

// const getAllToursOldCode = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchTerm = query.searchTerm || "";
//   const sort = query.sort || "-createdAt";
//   const fields = query.fields?.split(",").join(" ") || "";
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;
//   const skip = (page - 1) * limit;

//   for (const field of excludeFields) {
//     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//     delete filter[field];
//   }

//   const searchQuery = {
//     $or: tourSearchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" },
//     })),
//   };

//   /*[remove][remove][remove][remove][remove][SKIP][][][][][][][][][][]*/
//   /*[][][][][][][][][][][LIMIT][remove][remove][remove][remove][remove]*/

//   /*-----------------Pagination with skip and limit-------------------*/

//   // 1 page => [1][1][1][1][1][1][1][1][1][1] skip = 0 limit =10
//   // 2 page => [1][1][1][1][1][1][1][1][1][1]=>skip=>[2][2][2][2][2][2][2][2][2][2]<=limit skip = 10 limit =10
//   // 3 page => [1][1][1][1][1][1][1][1][1][1]=>skip=>[2][2][2][2][2][2][2][2][2][2]<=limit skip = 20 limit = 10

//   // skip = (page -1) * 10 = 30
//   // ?page=3&limit=10

//   // const tours = await Tour.find(searchQuery)
//   //   .find(filter)
//   //   .sort(sort)
//   //   .select(fields)
//   //   .skip(skip)
//   //   .limit(limit);

//   //alternative way of data filtering
//   const filterQuery = Tour.find(filter);
//   const tours = filterQuery.find(searchQuery);
//   const allTours = await tours
//     .sort(sort)
//     .select(fields)
//     .skip(skip)
//     .limit(limit);

//   const totalToursCount = await Tour.countDocuments();
//   const totalPage = Math.ceil(totalToursCount / limit);
//   const meta = {
//     page: page,
//     limit: limit,
//     total: totalToursCount,
//     totalPage: totalPage,
//   };
//   return {
//     data: allTours,
//     meta: meta,
//   };
// };

const getAllTours = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);

  const tours = await queryBuilder
    .filter()
    .search(tourSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data: data,
    meta: meta,
  };
};

const getSingleTour = async (id: string) => {
  const tour = await Tour.findById(id);
  if (!tour) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour not found");
  }
  return tour;
};

const updateTour = async (payload: Partial<ITour>, id: string) => {
  const existingTour = await Tour.findById(id);
  if (!existingTour) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour not found");
  }

  const updatedTour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return updatedTour;
};

const deleteTour = async (id: string) => {
  const tour = await Tour.findById(id);
  if (!tour) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour not found");
  }
  await Tour.findByIdAndDelete(id);
  return null;
};

export const TourService = {
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

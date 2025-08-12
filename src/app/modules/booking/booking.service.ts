/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { getTransactionId } from "../../utils/getTransactionId";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { Tour } from "../tour/tour.model";
import { User } from "../user/user.model";
import { IBooking } from "./booking.interface";
import { Booking } from "./booking.model";

/**
 * multiple data create or update mane jodi akta data ar creation or update onno akta data creation or update ar upor nirvor kore ai rokom khetre ar jonno amra sob somoy rollback use korbo jeno kono akta model ar data creation fail hole jeno onno akta model ar data o database e save na hoy
 * Duplicate DB Collections / replica
 *
 * Replica DB -> [ Create Booking -> Create Payment ->  Update Booking -> Error] -> Real DB ==> sob gula field success holei data db te save hobe otherwise jodi kono akta fail hoy tahole sob gula rollback kore vanis hoye jave data database e save hobe na.
 */

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);
    if (!user?.phone) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Please Update a Valid Phone Number to Book a Tour"
      );
    }

    const tour = await Tour.findById(payload.tour).select("costFrom");
    if (!tour?.costFrom) {
      throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found");
    }

    const amount = Number(tour.costFrom) * Number(payload.guestCount);

    const booking = await Booking.create(
      [
        {
          user: userId,
          ...payload,
        },
      ],
      { session: session }
    );

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          transactionId: transactionId,
          amount: amount,
        },
      ],
      { session: session }
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session: session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    const userAddress = (updatedBooking?.user as any).address;
    const userEmail = (updatedBooking?.user as any).email;
    const userPhoneNumber = (updatedBooking?.user as any).phone;
    const userName = (updatedBooking?.user as any).name;

    const sslPayload: ISSLCommerz = {
      address: userAddress,
      email: userEmail,
      phoneNumber: userPhoneNumber,
      name: userName,
      amount: amount,
      transactionId: transactionId,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    await session.commitTransaction(); //transaction successful
    session.endSession();
    return { paymentUrl: sslPayment.GatewayPageURL, booking: updatedBooking };
  } catch (error) {
    await session.abortTransaction(); // transaction failed so, rollback
    session.endSession();
    throw error;
  }
};

export const BookingService = { createBooking };

import { TryCatch } from "../../middlewares/error.js";
import ErrorHandler from "../../utils/utility-class.js";
import { Coupon } from "../../models/coupon/Coupon.model.js";
import { stripe } from "../../app.js";
export const newCoupon = TryCatch(async (req, res, next) => {
    const { coupon, amount } = req.body;
    if (!coupon || !amount)
        return next(new ErrorHandler("Please enter both coupon and amount", 400));
    await Coupon.create({ coupon, amount });
    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon} Created Successfully`,
    });
});
export const newDiscount = TryCatch(async (req, res, next) => {
    const { coupon } = req.query;
    const discount = await Coupon.findOne({ coupon: coupon });
    if (!discount)
        return next(new ErrorHandler("Invalid Coupon Code", 400));
    return res.status(200).json({
        success: true,
        discount: discount.amount,
    });
});
export const allCoupons = TryCatch(async (req, res, next) => {
    const coupons = await Coupon.find({});
    return res.status(200).json({
        success: true,
        coupons,
    });
});
export const deleteCoupon = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon)
        return next(new ErrorHandler("Invalid Coupon ID", 400));
    return res.status(200).json({
        success: true,
        message: `Coupon ${coupon} Deleted Successfully`,
    });
});
export const paymentInitiate = TryCatch(async (req, res, next) => {
    const { amount } = req.body;
    if (!amount) {
        throw new ErrorHandler('no amount for transaction', 400);
    }
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "inr"
    });
    return res.status(201).json({
        success: true,
        error: false,
        message: "payment initiated",
        clientSecret: paymentIntent.client_secret
    });
});

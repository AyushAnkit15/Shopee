import express from "express";
import userRouter from "./User/User.router.js";
import productRouter from "./Product/Product.router.js";
import orderRouter from "./Order/Order.router.js";
import paymentRouter from "./Payment/Payment.router.js";
import statsRouter from "./Stats/Statistics.router.js";

const api = express.Router();

api.use("/user", userRouter);
api.use("/product", productRouter);
api.use("/order", orderRouter);
api.use('/payment' , paymentRouter)
api.use('/stats' , statsRouter)

export default api;

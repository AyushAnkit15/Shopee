import { TryCatch } from "../../middlewares/error.js";
import { Order } from "../../models/order/Order.model.js";
import { reduceStock } from "../../utils/base.js";
import ErrorHandler from "../../utils/utility-class.js";
import { NodeCache } from "../../app.js";
import { revalidate } from "../../utils/base.js";
export const newOrder = TryCatch(async (req, res, next) => {
    const { shippingInfo, user, subtotal, discount, shippingCharges, tax, total, orderItems, } = req.body;
    if (!shippingCharges ||
        !tax ||
        !total ||
        !orderItems ||
        !discount ||
        !subtotal ||
        !user ||
        !shippingInfo) {
        return next(new ErrorHandler("all fields are required", 400));
    }
    await Order.create({
        shippingInfo,
        user,
        subtotal,
        discount,
        shippingCharges,
        tax,
        total,
        orderItems,
    });
    await reduceStock(orderItems);
    await revalidate({ product: true, order: true, admin: true, userId: user });
    return res.status(201).json({
        success: true,
        error: false,
        message: "Order created successfully",
    });
});
export const myOrders = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    let order = [];
    if (NodeCache.has(`allorders`)) {
        order = JSON.parse(NodeCache.get(`allorders`));
    }
    else {
        order = await Order.find({ user: id });
        NodeCache.set(`allorders`, JSON.stringify(order));
    }
    if (order.length === 0) {
        throw new ErrorHandler("no order found", 400);
    }
    return res.status(200).json({
        success: true,
        error: false,
        order,
    });
});
export const allOrders = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    let order = [];
    if (NodeCache.has(`myorder-${id}`)) {
        order = JSON.parse(NodeCache.get(`myorder-${id}`));
    }
    else {
        order = await Order.find({}).populate("user", "name");
        NodeCache.set(`myorder-${id}`, JSON.stringify(order));
    }
    if (order.length === 0) {
        throw new ErrorHandler("no order found", 400);
    }
    return res.status(200).json({
        success: true,
        error: false,
        order,
    });
});
export const getOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const key = `order-${id}`;
    let order;
    if (NodeCache.has(key)) {
        order = JSON.parse(NodeCache.get(key));
    }
    else {
        order = await Order.findById(id).populate("user", "name");
        NodeCache.set(key, JSON.stringify(order));
    }
    if (!order) {
        throw new ErrorHandler("no order found", 400);
    }
    return res.status(200).json({
        success: true,
        error: false,
        order,
    });
});
export const deleteOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const key = `order-${id}`;
    const order = await Order.findById(id);
    if (!order) {
        throw new ErrorHandler("no order found", 400);
    }
    await order.deleteOne();
    await revalidate({
        product: false,
        order: true,
        admin: true,
        userId: order.user || "",
        orderId: String(order._id) || "",
    });
    return res.status(201).json({
        success: true,
        error: false,
        message: "Order deleted",
    });
});
export const processOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const key = `order-${id}`;
    const order = await Order.findById(id);
    if (!order) {
        throw new ErrorHandler("no order found", 400);
    }
    switch (order.status) {
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
            break;
    }
    await order.save();
    await revalidate({
        product: false,
        order: true,
        admin: true,
        userId: order.user || "",
        orderId: String(order._id) || "",
    });
    return res.status(201).json({
        success: true,
        error: false,
        message: "Order status changed",
    });
});

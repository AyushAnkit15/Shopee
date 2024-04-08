import express from "express";
import { isAdmin } from "../../middlewares/auth.js";
import { newOrder, myOrders, allOrders, getOrder, deleteOrder, processOrder, } from "../../controllers/order/Order.controller.js";
const orderRouter = express.Router();
orderRouter.get("/user", (req, res) => {
    res.send("hello");
    console.log("hello");
});
orderRouter.post("/new", newOrder);
orderRouter.get("/myorders", myOrders);
orderRouter.get("/allorders", isAdmin, allOrders);
orderRouter.get("/getorder/:id", getOrder);
orderRouter.put("/process/:id", isAdmin, processOrder);
orderRouter.post("/delete/:id", isAdmin, deleteOrder);
export default orderRouter;

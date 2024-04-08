import { NodeCache } from "../app.js";
import { ProductModel } from "../models/product/Product.model.js";
import ErrorHandler from "./utility-class.js";
export const revalidate = async ({ product, order, admin, userId, orderId, }) => {
    if (product) {
        const pk = [
            "all-products",
            "all-categories",
            "all-productsadmin",
        ];
        const products = await ProductModel.find({}).select("_id");
        products.forEach((product) => {
            pk.push(`product-${product._id}`);
        });
        NodeCache.del(pk);
    }
    if (order) {
        const ok = [
            "allorders",
            `myorder-${userId}`,
            `order-${orderId}}`,
        ];
        //  const orders = await Order.find({}).select("_id");
        //   orders.forEach((order) => {
        //     ok.push();
        //   });
        NodeCache.del(ok);
    }
    if (admin) {
        NodeCache.del([
            "admin-stats",
            "admin-pie-charts",
            "admin-bar-charts",
            "admin-line-charts",
        ]);
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await ProductModel.findById(order.productId);
        if (product) {
            product.stock = product.stock - order.quantity;
            await product.save();
        }
        else {
            throw new ErrorHandler("no product with given id found", 400);
        }
    }
};
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
export const getInventories = async ({ categories, productsCount, }) => {
    const categoriesCountPromise = categories.map((category) => ProductModel.countDocuments({ category }));
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount = [];
    categories.forEach((category, i) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productsCount) * 100),
        });
    });
    return categoryCount;
};
export const getChartData = ({ length, docArr, today, property, }) => {
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            if (property) {
                data[length - monthDiff - 1] += i[property];
            }
            else {
                data[length - monthDiff - 1] += 1;
            }
        }
    });
    return data;
};

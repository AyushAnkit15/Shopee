import { Revalidate } from "../types/types.js";
import { NodeCache } from "../app.js";
import { ProductModel } from "../models/product/Product.model.js";
import { OrderItem } from "../types/types.js";
import ErrorHandler from "./utility-class.js";
import { Order } from "../models/order/Order.model.js";

export const revalidate = async ({
  product,
  order,
  admin,
  userId,
  orderId,
}: Revalidate) => {
  if (product) {
    const pk: string[] = [
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
    const ok: string[] = [
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

export const reduceStock = async (orderItems: OrderItem[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];

    const product = await ProductModel.findById(order.productId);
    if (product) {
      product.stock = product.stock - order.quantity;
      await product.save();
    } else {
      throw new ErrorHandler("no product with given id found", 400);
    }
  }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  const percent = (thisMonth / lastMonth) * 100;
  return Number(percent.toFixed(0));
};

export const getInventories = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {
  const categoriesCountPromise = categories.map((category) =>
    ProductModel.countDocuments({ category })
  );

  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCount: Record<string, number>[] = [];

  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / productsCount) * 100),
    });
  });

  return categoryCount;
};

interface MyDocument {
  createdAt: Date;
  discount?: number;
  total?: number;
} // extends Document
type FuncProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total";
};

export const getChartData = ({
  length,
  docArr,
  today,
  property,
}: FuncProps) => {
  const data: number[] = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      if (property) {
        data[length - monthDiff - 1] += i[property]!;
      } else {
        data[length - monthDiff - 1] += 1;
      }
    }
  });

  return data;
};

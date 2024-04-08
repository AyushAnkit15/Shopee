import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../../middlewares/error.js";
import { NewProduct } from "../../types/types.js";
import { ProductModel } from "../../models/product/Product.model.js";
import ErrorHandler from "../../utils/utility-class.js";
import fs from "fs";
import { SearchQuery } from "../../types/types.js";
import { BaseQuery } from "../../types/types.js";
import { faker } from "@faker-js/faker";
import { NodeCache } from "../../app.js";
import { revalidate } from "../../utils/base.js";

import { ObjectId } from "mongodb";

export const newProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProduct>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, stock, category, description } = req.body;
    const photo = req.file;

    if (!photo) {
      return next(new ErrorHandler("photo is required", 400));
    }

    if (!name || !price || !stock || !category) {
      fs.rm(photo.path, () => {
        console.log("file deleted");
      });
      return next(new ErrorHandler("all fields are required", 400));
    }

    await ProductModel.create({
      name,
      price: price,
      category: category,
      stock,
      photo: photo?.path,
      description,
    });

    await revalidate({
      product: true,
    
    });

    return res.status(201).json({
      success: true,
      error: false,
      message: "product created",
    });
  }
);

export const newProducts = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let products;

    if (NodeCache.has("all-products")) {
      products = JSON.parse(NodeCache.get("all-products") as string);
    } else {
      const products = await ProductModel.find()
        .sort({ createdAt: -1 })
        .limit(11);

      NodeCache.set("all-products", JSON.stringify(products));
    }

    if (!products) {
      next(new ErrorHandler("no products found", 400));
    }
    res.status(200).json({
      success: true,
      error: false,
      products,
    });
  }
);

export const allCategories = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let categories;

    if (NodeCache.has("all-categories")) {
      categories = JSON.parse(NodeCache.get("all-categories") as string);
    } else {
      categories = await ProductModel.find().distinct("category");
      NodeCache.set("all-categories", JSON.stringify(categories));
    }

    if (!categories) {
      next(new ErrorHandler("no categories found", 400));
    }
    res.status(200).json({
      success: true,
      error: false,
      categories,
    });
  }
);

export const allProducts = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    let products;

    if (NodeCache.has("all-productsadmin")) {
      products = JSON.parse(NodeCache.get("all-productsadmin") as string);
    } else {
      products = await ProductModel.find();

      NodeCache.set("all-productsadmin", JSON.stringify(products));
    }

    if (!products) {
      next(new ErrorHandler("no products found", 400));
    }
    res.status(200).json({
      success: true,
      error: false,   
      products,
    });
  }
);

export const getProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {

    let product ; 

    if(NodeCache.has(`product-${req.params.id}`)){
      product = JSON.parse(NodeCache.get(`product-${req.params.id}`) as string);
    }
    else{
        product = await ProductModel.findById(req.params.id).select("-_id");
        NodeCache.set(`product-${req.params.id}`, JSON.stringify(product));
    }
    if (!product) {
      next(new ErrorHandler("no product with given id found", 400));
    } else {
      res.status(200).json({
        success: true,
        error: false,
        product,
      });
    }
  }
);

export const deleteProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const product = await ProductModel.findById(id);
    if (!product) {
      next(new ErrorHandler("no product with given id found", 400));
    } else {
      fs.rm(product.photo!, () => {
        console.log("old file deleted");
      });

      await ProductModel.deleteOne({ _id: id });

      revalidate({product: true});
      res.status(201).json({
        success: true,
        error: false,
        message: "product deleted",
      });
    }
  }
);

// export const updateProduct = TryCatch(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     const { name, price, stock, category } = req.body;
//     const photo = req.file;
//     const product = await ProductModel.findById(id);

//     if (!product) return next(new ErrorHandler("Product Not Found", 404));

//     if (photo) {
//       fs.rm(product.photo!, () => {
//         console.log("Old Photo Deleted");
//       });
//       product.photo = photo.path;
//     }

//     if (name) product.name = name;
//     if (price) product.price = price;
//     if (stock) product.stock = stock;
//     if (category) product.category = category;

//     await product.save();

//       return res.status(201).json({
//         success: true,
//         error: false,
//         message: "product updated",
//       });
//     }

// );

export const updateProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, price, stock, category } = req.body;
      const photo = req.file;
      const product = await ProductModel.findById(id);

      if (!product) return next(new ErrorHandler("Product Not Found", 404));

      if (photo) {
        fs.rm(product.photo!, () => {
          console.log("Old Photo Deleted");
        });
        product.photo = photo.path;
      }

      if (name) product.name = name;
      if (price) product.price = price;
      if (stock) product.stock = stock;
      if (category) product.category = category;

      // await product.save();

      const result = await ProductModel.updateOne({ _id: id }, product);

      revalidate({product: true});

      return res.status(200).json({
        success: true,
        error: false,
        message: "Product updated",
        product: product,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  }
);
// export const search = TryCatch(
//   async (
//     req: Request<{}, {}, SearchQuery>,
//     res: Response,
//     next: NextFunction
//   ) => {

//     const { search, sort, category, price } = req.query;
//     let page = Number(req.query.page) || 1;

//     const limit = Number(process.env.PAGELIMIT) || 5;
//     const skip = (page - 1) * limit;

//     const baseQuery: BaseQuery = {};
//     if (search && typeof search === "string")
//       baseQuery.name = {
//         $regex: search,
//         $options: "i",
//       };

//     if (price)
//       baseQuery.price = {
//         $lte: Number(price),
//       };

//     if (category) baseQuery.category = category as string;

//     const Ppromise = ProductModel.find(baseQuery)
//       .sort(sort ? { price: sort === "asc" ? 1 : -1 } : { createdAt: -1 })
//       .limit(limit)
//       .skip(skip);

//     const [products, count] = await Promise.all([
//       Ppromise,
//       await ProductModel.countDocuments(baseQuery),
//     ]);

//     const totalPages = Math.ceil(count / limit);

//     if (!products) {
//       next(new ErrorHandler("no product with given filters found", 400));
//     }

//     return res.status(200).json({
//       success: true,
//       error: false,
//       products,
//       totalPages,
//     });

//   }
// );

export const search = TryCatch(
  async (
    req: Request<{}, {}, SearchQuery>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { search, sort, category, price } = req.query;
      let page = Number(req.query.page) || 1;

      const limit = Number(process.env.PAGELIMIT) || 5;
      const skip = (page - 1) * limit;

      const baseQuery: BaseQuery = {};
      if (search && typeof search === "string") {
        baseQuery.name = {
          $regex: search,
          $options: "i",
        };
      }

      if (price) {
        baseQuery.price = {
          $lte: Number(price),
        };
      }

      if (category && typeof category === "string") {
        baseQuery.category = category;
      }

      const productsPromise = ProductModel.find(baseQuery)
        .sort(
          sort === "asc"
            ? { price: 1 }
            : sort === "desc"
            ? { price: -1 }
            : { createdAt: -1 }
        )
        .limit(limit)
        .skip(skip);

      const [products, count] = await Promise.all([
        productsPromise,
        ProductModel.countDocuments(baseQuery),
      ]);

      const totalPages = Math.ceil(count / limit);

      if (!products || products.length === 0) {
        return res.status(404).json({
          success: false,
          error: true,
          message: "No products found with given filters",
        });
      }

      return res.status(200).json({
        success: true,
        error: false,
        products,
        totalPages,
      });
    } catch (error) {
      console.error("Error searching products:", error);
      next(new ErrorHandler("Internal Server Error", 500));
    }
  }
);

const generateProducts = async (count: number = 12) => {
  const products = [];

  for (let i = 0; i < count; i++) {
    const product = {
      name: faker.commerce.productName(),
      price: faker.commerce.price({ min: 1500, max: 100000 }),
      description: faker.commerce.productDescription(),
      photo: "https://source.unsplash.com/random",
      category: faker.commerce.department(),
      stock: Math.floor(Math.random() * 1000),
      createdAt: new Date(faker.date.past()),
      updatedAt: new Date(faker.date.recent()),
    };

    products.push(product);
  }

  await ProductModel.insertMany(products);
  console.log("all sahi");
};

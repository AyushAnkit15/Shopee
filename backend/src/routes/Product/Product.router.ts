import express from "express";
import { isAdmin } from "../../middlewares/auth.js";

import {
  newProduct,
  newProducts,
  allCategories,
  allProducts,
  getProduct,
  deleteProduct,
  updateProduct,search
} from "../../controllers/product/Product.controller.js";

import { singleUpload } from "../../middlewares/multer.js";
const productRouter = express.Router();

productRouter.get("/product", (req, res) => {
  res.send("hello");
  console.log("hello");
});




productRouter.post("/new", isAdmin, singleUpload, newProduct);
productRouter.get("/latest", newProducts);

productRouter.get("/categories", allCategories);
productRouter.get("/admin/products", allProducts);



productRouter.get("/qu" , search)
productRouter.get("/:id", getProduct);
productRouter.post("/:id", isAdmin, deleteProduct);
productRouter.put("/:id", isAdmin, singleUpload, updateProduct);

export default productRouter;

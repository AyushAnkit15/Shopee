import express from "express";
import { connectDB } from "./utils/connect.js";
import { Request, Response, NextFunction } from "express";
import { errorf } from "./middlewares/error.js";
import "dotenv/config";
import nodeCache from "node-cache";
import morgan from "morgan";
import Stripe from 'stripe'
import cors from 'cors'

import api from "./routes/api.js";

export const NodeCache = new nodeCache({ stdTTL: 100 });

export const stripe = new Stripe(process.env.STRIPEKEY as string)

const app = express();

app.use(cors())

app.use(express.json());

app.use(morgan("combined"));

const port = process.env.PORT || 5000;

app.use("/api/v1", api);

app.use("/uploads", express.static("uploads"));

app.use(errorf);
app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on port Hello ${port}`);
});

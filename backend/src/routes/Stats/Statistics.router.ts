import express from "express";
import {
  baseStats,
  getPieCharts,
  getBarCharts,
  getLineCharts,
} from "../../controllers/stats/Statistics.controller.js";
import { isAdmin } from "../../middlewares/auth.js";

const statsRouter = express.Router();

statsRouter.get("/", (req, res) => {
  res.send("hello");
});

statsRouter.get("/admin/stats", isAdmin, baseStats);
statsRouter.get("/admin/pie", isAdmin, getPieCharts);
statsRouter.get("/admin/bar", isAdmin, getBarCharts);

statsRouter.get("/admin/line", isAdmin, getLineCharts);

export default statsRouter;

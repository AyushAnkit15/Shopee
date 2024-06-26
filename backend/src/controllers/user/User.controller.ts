import User from "../../models/user/User.model.js";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../../utils/utility-class.js";

import { NewUser } from "../../types/types.js";
import { TryCatch } from "../../middlewares/error.js";

export const createUser = TryCatch(
  async (req: Request<{}, {}, NewUser>, res: Response, next: NextFunction) => {
    const { name, email, photo, gender, role, DOB, _id } = req.body;

    if (!_id || !name || !email || !gender || !role ||!DOB ) {
      return next(new ErrorHandler("all fields are requiredddd", 400));
    }

    let newUser = await User.findOne({ _id });

    if (newUser) {
      return res.status(200).json({
        success: true,
        error: false,
        message: "user already exists",
      });
    }

    newUser = await User.create({
      name,
      email,
      photo,
      gender,
      role,
      DOB,
      _id,
    });

    res.status(201).json({
      success: true,
      error: false,
      message: "user created",
    });
  }
);

export const getAllUsers = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find().select("-_id");
    res.status(200).json({
      success: true,
      error: false,
      users,
    });
  }
);

export const getUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      next(new ErrorHandler("no user with given id found", 400));
    } else {
      res.status(200).json({
        success: true,
        error: false,
        user,
      });
    }
  }
);

export const deleteUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      next(new ErrorHandler("no user with given id found", 400));
    } else {
      res.status(200).json({
        success: true,
        error: false,
        message: "user deleted",
      });
    }
  }
);

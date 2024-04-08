import mongoose from "mongoose";
import validator from "validator";

interface Users{  
    _id: string;
    photo: string;
    name: string;
    email: string;
    gender: string;
    role: "admin" | "user";
    DOB: Date;
    createdAt: Date;
    updatedAt: Date;
    age: number;
}

const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    }, 
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: validator.default.isEmail,
    },
    gender: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],

      required: true,
    },
    DOB: {
      type: Date,

      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual("age").get(function () {
  return new Date().getFullYear() - new Date(this.DOB).getFullYear();
});


const User= mongoose.model<Users>("User", UserSchema);

export default User;

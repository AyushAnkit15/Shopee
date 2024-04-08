import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
    // _id: {
    //   type: String,
    //   required: true,
    // },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        //   required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
export const ProductModel = mongoose.model("Product", ProductSchema);

import mongoose from "mongoose";
import validator from "validator";
const UserSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
});
UserSchema.virtual("age").get(function () {
    return new Date().getFullYear() - new Date(this.DOB).getFullYear();
});
const User = mongoose.model("User", UserSchema);
export default User;

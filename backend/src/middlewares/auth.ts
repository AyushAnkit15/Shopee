import { TryCatch } from "./error.js"
import { Request  , Response , NextFunction } from "express"
import ErrorHandler from "../utils/utility-class.js"
import User from "../models/user/User.model.js"
export const isAdmin = TryCatch(
    async (req : Request  ,res : Response , next : NextFunction) => {
const {_id} =req.query

if(!_id){
    next(new ErrorHandler("please enter a valid id" , 401))
}



const user = await User.findById(_id);

if(!user){
    next(new ErrorHandler("no user with given id found" , 400))
}

const role = user?.role

if(role!=="admin"){
    next(new ErrorHandler("you are not an admin" , 401))
}



next()



    }
)
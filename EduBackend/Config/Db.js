import mongoose from "mongoose";
import { User } from "../Models/User.Models.js";

const connectDB = async( req, res) =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connection was successfully estanblish")
    }catch(error){
        console.error("Error in connection with database", {message: error})
        process.exit(1);
    }
} 

export default connectDB;
import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB=async()=>{
    try{
        const connectedInstance=await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`Database connected successfully:${connectedInstance.connection.host}`);
    }catch(err){
        console.error("Connection Error:",err);
        process.exit(1);
    }
}

export default connectDB;
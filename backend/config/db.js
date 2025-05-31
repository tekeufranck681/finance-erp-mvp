import mongoose from "mongoose";
export const connectDB = async() => {
    try{
       const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongo DB connected at ${conn.connection.host}`);
    }catch(error){
        console.error("Internal server error");
        process.exit(1);
    }
}
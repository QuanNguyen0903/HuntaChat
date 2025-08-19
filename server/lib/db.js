import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/Hunta-Chat`)
        console.log("MongoDB Connected Successfully !!");
    } catch (error) {
        console.log("MongoDb Connection is Failed...",Error);
     
    }

}
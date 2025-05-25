import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "HMS_DEPLOYED"
    } ).then(() => {
        console.log("Database connected successfully");
    }).catch(err=>{
        console.log("Database connection failed");
        console.log(err);
    })
}
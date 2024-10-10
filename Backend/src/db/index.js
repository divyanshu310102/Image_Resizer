import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';



const connectDB = async () => {
    try {
        const MongoDB = await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`)
        console.log(`Database connected successfully with ${MongoDB.connection.host}`)
    } catch (error) {
        console.log("Database connection error :", error)
    }
}

export default connectDB;
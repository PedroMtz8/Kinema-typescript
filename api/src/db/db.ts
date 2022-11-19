import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config();


mongoose.connect(process.env.URL_DB || "")

const database = mongoose.connection

export default database

/* (async () => {

    const moongooseOptions: ConnectOptions = {
        useUnifiedToplogy: true,
        useNewUrlParser: true
    }

    await mongoose.connect("mongodb://localhost/mydatabase", moongooseOptions)
    console.log("Database is connected")
})() */



import express from "express";
import morgan from "morgan"
import cors from "cors"
import router from "./routes/index.routes";

const app = express()

app.use(morgan('dev'));


app.use("/", router)


export default app



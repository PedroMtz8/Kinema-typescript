import app from "./app"
import database from "./db/db"
require("dotenv").config()
const PORT = process.env.PORT

database.on("error", (error) => {
    console.log(error)
})

database.once("connected", ()=> {
    console.log("Database connected!")
})


app.listen(PORT, ()=>{
    console.log(`server on port ${PORT}`)
})
import express from "express"
import router from "./routes/router.js"
import cors from "cors"
import {connectMongo} from "./config/db.js"
import cookieParser from "cookie-parser"


connectMongo();
const app = express()
const corsOptions ={
    origin:['http://localhost:5173'],
    credentials:true
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Hello World")
})
app.use(router);

app.listen(3000, () => {
    console.log("Server running on port 3000")
})
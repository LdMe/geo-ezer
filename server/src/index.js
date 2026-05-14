import express from "express"
import router from "./routes/router.js"
import cors from "cors"
import {connectMongo} from "./config/db.js"

connectMongo();
const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World")
})
app.use(router);

app.listen(3000, () => {
    console.log("Server running on port 3000")
})
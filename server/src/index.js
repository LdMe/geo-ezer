import express from "express"
import router from "./routes/router.js"
import cors from "cors"
import {connectMongo} from "./config/db.js"
import cookieParser from "cookie-parser"
import {Server as socketIO} from "socket.io"
import http from "http"
import configureSocket from "./sockets.js"

connectMongo();
const app = express()
const corsOptions ={
    origin:['http://localhost:5173'],
    credentials:true
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())


const server = http.createServer(app);
const io = new socketIO(server, {
    cors: corsOptions
  });

app.use((req, res, next) => {
    req.io = io;
    next();
})

configureSocket(io)

app.get("/", (req, res) => {
    res.send("Hello World")
})
app.use(router);

server.listen(3000, () => {
    console.log("Server running on port 3000")
})
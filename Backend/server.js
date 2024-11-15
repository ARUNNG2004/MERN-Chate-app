

import path from "path"
import  dotenv from  "dotenv"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js"
import messagesRoutes from "./routes/messages.routes.js"
import userRoutes from "./routes/user.routes.js"
import express from "express";
import { connectDB } from "./db/connecttodb.js";
 import {app ,server} from "./socket/socket.js";

dotenv.config()



app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 5000

const __dirname = path.resolve()


app.use ( "/api/auth" ,authRoutes)
app.use ( "/api/messages" ,messagesRoutes)

app.use("/api/users", userRoutes);



app.use(express.static(path.join(__dirname,"/Frontend/dist")))


app.get("*",(req, res)=>
    {res.sendFile(path.join(__dirname,"Frontend","dist", "index.html"),)})



server.listen(PORT,()=>{
    connectDB()
    console.log(`port running on ${PORT}`);
})

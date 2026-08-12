import 'dotenv/config';

import express from "express"; 
import cors from 'cors'
import { userRouter } from "./Routes/UserRoute.js";
import { adminRouter } from "./Routes/AdminRoute.js";


const app = express() 

app.use(cors({
    origin: ["http://localhost:5173"], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}))
app.use(express.json())
app.use('/auth', userRouter)  
app.use('/admin', adminRouter)
 
app.listen(3006, () => { 
    console.log("server is running") 
})
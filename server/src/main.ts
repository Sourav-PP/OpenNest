import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './interface/http/routes/authRoutes'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000
console.log("Main - ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET); 

mongoose.connect(`${process.env.MONGODB_URI}/opennest` || "")
.then(() => {
    console.log("DB connected")
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
})
.catch(err => console.log("DB error: ", err))
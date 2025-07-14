import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

//============ROUTES=============
import authRoutes from './interface/http/routes/authRoutes'
import adminRoutes from './interface/http/routes/adminRoutes'
import userRoutes from './interface/http/routes/userRoutes'
import psychologistRoutes from './interface/http/routes/psychologistRoutes'

dotenv.config()

const app = express()
app.use(cors({
    origin: ['http://localhost:5173', 'http://192.168.20.2:5173/'],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())



app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes )
app.use('/api/user', userRoutes)
app.use('/api/psychologist', psychologistRoutes)

const PORT = Number(process.env.PORT) || 5000

mongoose.connect(`${process.env.MONGODB_URI}/opennest` || "")
.then(() => {
    console.log("DB connected")
    app.listen(PORT, '0.0.0.0', () => console.log(`Server is running on port ${PORT}`))
})
.catch(err => console.log("DB error: ", err))
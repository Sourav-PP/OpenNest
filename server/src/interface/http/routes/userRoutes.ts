import express from 'express'

// -------------- controllers ----------------
import { userGetAllServicesController } from '../../../config/di'

const router = express.Router()

router.get('/services', userGetAllServicesController.handle)

export default router
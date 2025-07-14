import express from 'express'
import { authenticatePsychologist } from '../../../config/di'

//-------------controller--------------
import { getProfileController } from '../../../config/di'

const router = express.Router()

router.get('/profile', authenticatePsychologist, getProfileController.handle)

export default router
import express from 'express'
import { authenticatePsychologist, updatePsychologistProfileController } from '../../../config/di'

//-------------controller--------------
import { getProfileController } from '../../../config/di'
import { uploadSingle } from '../middlewares/multer'

const router = express.Router()

router.get('/profile', authenticatePsychologist, getProfileController.handle)
router.put('/profile', authenticatePsychologist, uploadSingle, updatePsychologistProfileController.handle)

export default router
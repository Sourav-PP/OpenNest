import express from 'express'
import { authenticatePsychologist, createSlotController, getSlotByPsychologistController, updatePsychologistProfileController } from '../../../config/di'

//-------------controller--------------
import { getProfileController } from '../../../config/di'
import { uploadSingle } from '../middlewares/multer'

const router = express.Router()

router.get('/profile', authenticatePsychologist, getProfileController.handle)
router.put('/profile', authenticatePsychologist, uploadSingle, updatePsychologistProfileController.handle)
router.post('/slot', authenticatePsychologist, createSlotController.handle )
router.get('/slot', authenticatePsychologist, getSlotByPsychologistController.handle)

export default router
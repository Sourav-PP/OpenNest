import express from 'express'
import { authenticateUser, getUserProfileController } from '../../../config/di'

// -------------- controllers ----------------
import { userGetAllServicesController } from '../../../config/di'
import { getAllPsychologistsController } from '../../../config/di'
import { updateUserProfileController, getPsychologistDetailsController } from '../../../config/di'
import { uploadSingle } from '../middlewares/multer'


const router = express.Router()

router.get('/services', userGetAllServicesController.handle)
router.get('/psychologists', getAllPsychologistsController.handle )
router.get('/psychologists/:id', getPsychologistDetailsController.handle)
router.get('/profile', authenticateUser, getUserProfileController.handle)
router.put('/profile', authenticateUser, uploadSingle, updateUserProfileController.handle)

export default router
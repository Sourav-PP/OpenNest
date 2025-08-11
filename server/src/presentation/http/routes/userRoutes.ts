import express from 'express'
import { authenticateUser, getSlotsForUserController, getUserProfileController, paymentController } from '../../../config/di'
import expressRaw from 'express';

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
router.get('/psychologists/:userId/slots', authenticateUser, getSlotsForUserController.handle)
router.post('/payment/create-checkout-session', authenticateUser, paymentController.createCheckoutSession)
router.post('/payment/webhook', express.raw({type: 'application/json'}), paymentController.handleWebhook)

export default router
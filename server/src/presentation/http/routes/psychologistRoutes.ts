import express from 'express';
import {
    authenticatePsychologist,
    createSlotController,
    deleteSlotController,
    getSlotByPsychologistController,
    updatePsychologistProfileController,
    getKycDetailsController,
    getProfileController,
    checkBlockedUser,
    getPsychologistConsultationsController,
    psychologistCancelConsultationController,
} from '@/infrastructure/config/di';

import { uploadSingle } from '../middlewares/multer';

const router = express.Router();

router.get('/profile', authenticatePsychologist, getProfileController.handle);
router.put('/profile',authenticatePsychologist, uploadSingle, updatePsychologistProfileController.handle);
router.get('/kyc', authenticatePsychologist, getKycDetailsController.handle);
router.post('/slot', authenticatePsychologist, createSlotController.handle);
router.get('/slot', authenticatePsychologist, getSlotByPsychologistController.handle);
router.delete('/slot/:slotId', authenticatePsychologist, deleteSlotController.handle);
router.get('/consultations', authenticatePsychologist, checkBlockedUser, getPsychologistConsultationsController.handle);
router.put('/consultation/:id/cancel', authenticatePsychologist, checkBlockedUser, psychologistCancelConsultationController.handle);
export default router;

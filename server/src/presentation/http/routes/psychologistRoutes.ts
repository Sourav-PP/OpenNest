import express from 'express';
import {
    authenticatePsychologist,
    checkBlockedUser,
    slotController,
    psychologistConsultationController,
    psychologistProfileController,
    psychologistKycController,
} from '@/infrastructure/config/di';

import { uploadSingle } from '../middlewares/multer';

const router = express.Router();

router.get('/profile', authenticatePsychologist, psychologistProfileController.getProfile);
router.put('/profile',authenticatePsychologist, uploadSingle, psychologistProfileController.updateProfile);
router.get('/kyc', authenticatePsychologist, psychologistKycController.getKycDetails);
router.post('/slot', authenticatePsychologist, slotController.createSlot);
router.get('/slot', authenticatePsychologist, slotController.getSlotByPsychologist);
router.delete('/slot/:slotId', authenticatePsychologist, slotController.deleteSlot);
router.get('/consultations', authenticatePsychologist, checkBlockedUser, psychologistConsultationController.getConsultations);
router.put('/consultation/:id/cancel', authenticatePsychologist, checkBlockedUser, psychologistConsultationController.cancelConsultation);
router.get('/consultation/history', authenticatePsychologist, checkBlockedUser, psychologistConsultationController.getHistory);
router.get('/patients/:patientId/history', authenticatePsychologist, checkBlockedUser, psychologistConsultationController.getPatientHistory);

export default router;

import express from 'express';
import {
    authenticatePsychologist,
    slotController,
    psychologistConsultationController,
    psychologistProfileController,
    psychologistKycController,
    psychologistPayoutController,
} from '@/infrastructure/config/di';

import { uploadSingle } from '../middlewares/multer';

const router = express.Router();

router.get('/profile', authenticatePsychologist, psychologistProfileController.getProfile);
router.put('/profile',authenticatePsychologist, uploadSingle, psychologistProfileController.updateProfile);
router.get('/kyc', authenticatePsychologist, psychologistKycController.getKycDetails);
router.post('/slot', authenticatePsychologist, slotController.createSlot);
router.get('/slot', authenticatePsychologist, slotController.getSlotByPsychologist);
router.delete('/slot/:slotId', authenticatePsychologist, slotController.deleteSlot);
router.get('/consultations', authenticatePsychologist, psychologistConsultationController.getConsultations);
router.put('/consultation/:consultationId/cancel', authenticatePsychologist, psychologistConsultationController.cancelConsultation);
router.get('/consultation/history', authenticatePsychologist, psychologistConsultationController.getHistory);
router.get('/patients/:patientId/history', authenticatePsychologist, psychologistConsultationController.getPatientHistory);
router.get('/payout/pending', authenticatePsychologist, psychologistPayoutController.getPendingAmount);
router.post('/payout-requests', authenticatePsychologist, psychologistPayoutController.requestPayout);
router.get('/payout-requests', authenticatePsychologist, psychologistPayoutController.listPayouts);

export default router;

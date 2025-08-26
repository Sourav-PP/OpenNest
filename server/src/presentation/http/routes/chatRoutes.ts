import express from 'express';
const router = express.Router();

import {
    sendMessageController,
    getHistoryController,
    getUserConsultationsController,
    getPsychologistConsultationsController,
    authenticatePsychologist,
    authenticateUser,
} from '@/infrastructure/config/di';

router.get('/patient', authenticateUser, getUserConsultationsController.handle);
router.get('/psychologist', authenticatePsychologist, getPsychologistConsultationsController.handle);
router.post('/send', sendMessageController.handle);
router.get('/history/:consultationId', getHistoryController.handle);

export default router;
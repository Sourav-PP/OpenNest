import express from 'express';
const router = express.Router();

import {
    sendMessageController,
    getHistoryController,
    authenticatePsychologist,
    authenticateUser,
    getUnreadCountController,
    markAsReadController,
    authenticateAll,
    getUserChatConsultationsController,
    getPsychologistChatConsultationsController,
} from '@/infrastructure/config/di';

router.get('/patient', authenticateUser, getUserChatConsultationsController.handle);
router.get('/psychologist', authenticatePsychologist, getPsychologistChatConsultationsController.handle);
router.post('/send', sendMessageController.handle);
router.get('/history/:consultationId', getHistoryController.handle);
router.get('/:consultationId/unread-count', authenticateAll, getUnreadCountController.handle);
router.put('/:consultationId/mark-read', authenticateAll, markAsReadController.handle);

export default router;
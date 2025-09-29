import express from 'express';
const router = express.Router();

import {
    authenticatePsychologist,
    authenticateUser,
    authenticateAll,
    chatMessageController,
} from '@/infrastructure/config/di';

router.get('/patient', authenticateUser, chatMessageController.getUserChatConsultations);
router.get('/psychologist', authenticatePsychologist, chatMessageController.getPsychologistChatConsultations);
router.post('/send', chatMessageController.send);
router.get('/history/:consultationId', chatMessageController.getHistory);
router.get('/:consultationId/unread-count', authenticateAll, chatMessageController.getUnreadCount);
router.put('/:consultationId/mark-read', authenticateAll, chatMessageController.markAsRead);

export default router;
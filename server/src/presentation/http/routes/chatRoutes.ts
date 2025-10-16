import express from 'express';
const router = express.Router();

import {
    authenticatePsychologist,
    authenticateUser,
    authenticateAll,
    chatMessageController,
    chatFileController,
} from '@/infrastructure/config/di';
import { uploadSingle } from '../middlewares/multer';

router.get('/patient', authenticateUser, chatMessageController.getUserChatConsultations);
router.get('/psychologist', authenticatePsychologist, chatMessageController.getPsychologistChatConsultations);
router.post('/send', chatMessageController.send);
router.post('/upload', uploadSingle, chatFileController.uploadMedia);
router.get('/history/:consultationId', chatMessageController.getHistory);
router.get('/:consultationId/unread-count', authenticateAll, chatMessageController.getUnreadCount);
router.put('/:consultationId/mark-read', authenticateAll, chatMessageController.markAsRead);

export default router;

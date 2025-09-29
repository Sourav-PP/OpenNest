import express from 'express';
import {
    authenticateUser,
    checkBlockedUser,
    paymentController,
    authenticateAll,
    userConsultationController,
    userPsychologistController,
    userProfileController,
    userServiceController,
    userSlotController,
    userWalletController,
} from '@/infrastructure/config/di';

import { uploadSingle } from '../middlewares/multer';


const router = express.Router();

router.get('/services', userServiceController.getAllService);
router.get('/psychologists', userPsychologistController.getAllPsychologists);
router.get('/psychologists/:id', userPsychologistController.getPsychologistDetails);
router.get('/profile', authenticateUser, checkBlockedUser, userProfileController.getProfile);
router.put('/profile', authenticateUser, checkBlockedUser, uploadSingle, userProfileController.updateProfile);
router.get('/psychologists/:userId/slots', userSlotController.getAllSlots);
router.post('/payment/create-checkout-session', authenticateUser, checkBlockedUser, paymentController.createCheckoutSession);
router.post('/payment/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);
router.get('/consultations', authenticateUser, checkBlockedUser, userConsultationController.getConsultations);
router.get('/consultation/:id', authenticateAll, checkBlockedUser, userConsultationController.getConsultationDetail);
router.put('/consultation/:id/cancel', authenticateUser, checkBlockedUser, userConsultationController.cancelConsultation);

router.post('/wallet', authenticateUser, checkBlockedUser, userWalletController.create);
router.get('/wallet', authenticateUser, checkBlockedUser, userWalletController.getByUser);
router.get('/wallet/:walletId', authenticateUser, checkBlockedUser, userWalletController.getById);
router.post('/wallet/:walletId/transactions', authenticateUser, checkBlockedUser, userWalletController.createTransaction);
router.get('/wallet/:walletId/transactions', authenticateUser, checkBlockedUser, userWalletController.listTransactions);

export default router;
import express from 'express';
import {
    authenticateUser,
    paymentController,
    authenticateAll,
    userConsultationController,
    userPsychologistController,
    userProfileController,
    userServiceController,
    userSlotController,
    userWalletController,
    notificationController,
    subscriptionController,
} from '@/infrastructure/config/di';

import { uploadSingle } from '../middlewares/multer';


const router = express.Router();

router.get('/services', userServiceController.getAllService);
router.get('/psychologists', userPsychologistController.getAllPsychologists);
router.get('/psychologists/:id', userPsychologistController.getPsychologistDetails);
router.get('/profile', authenticateUser, userProfileController.getProfile);
router.put('/profile', authenticateUser, uploadSingle, userProfileController.updateProfile);
router.get('/psychologists/:userId/slots', userSlotController.getAllSlots);
router.post('/payment/create-checkout-session', authenticateUser, paymentController.createCheckoutSession);
router.post('/payment/create-subscription-session', authenticateUser, paymentController.createSubscriptionCheckoutSession);
router.post('/consultation/book-with-subscription', authenticateUser, paymentController.bookConsultationWithSubscription);
router.post('/payment/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);
router.get('/consultations', authenticateUser, userConsultationController.getConsultations);
router.get('/consultation/history', authenticateUser, userConsultationController.getHistory);
router.get('/consultation/:consultationId/history', authenticateAll, userConsultationController.getHistoryDetails);
router.get('/consultation/:consultationId', authenticateAll, userConsultationController.getConsultationDetail);
router.put('/consultation/:consultationId/cancel', authenticateUser, userConsultationController.cancelConsultation);
router.get('/subscription/active', authenticateUser, subscriptionController.getActiveSubscription);
router.post('/subscription/cancel', authenticateUser, subscriptionController.cancelSubscription);
router.get('/plans', subscriptionController.listPlans);

router.get('/notification', authenticateAll, notificationController.getNotifications);
router.patch('/notification/mark-all-read', authenticateAll, notificationController.markAsRead);

router.post('/wallet', authenticateUser, userWalletController.create);
router.get('/wallet', authenticateUser, userWalletController.getByUser);
router.get('/wallet/:walletId', authenticateUser, userWalletController.getById);
router.post('/wallet/:walletId/transactions', authenticateUser, userWalletController.createTransaction);
router.get('/wallet/:walletId/transactions', authenticateUser, userWalletController.listTransactions);

export default router;
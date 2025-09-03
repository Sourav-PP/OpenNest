import express from 'express';
import {
    authenticateUser,
    checkBlockedUser,
    getSlotsForUserController,
    getUserConsultationsController,
    getUserProfileController,
    paymentController,
    userGetAllServicesController,
    getAllPsychologistsController,
    updateUserProfileController,
    getPsychologistDetailsController,
    createWalletController,
    getWalletByUserController,
    getWalletByIdController,
    createWalletTransactionController,
    listWalletTransactionController,
    getUserConsultationDetailController,
    cancelConsultationController,
} from '@/infrastructure/config/di';

import { uploadSingle } from '../middlewares/multer';


const router = express.Router();

router.get('/services', userGetAllServicesController.handle);
router.get('/psychologists', getAllPsychologistsController.handle );
router.get('/psychologists/:id', getPsychologistDetailsController.handle);
router.get('/profile', authenticateUser, checkBlockedUser, getUserProfileController.handle);
router.put('/profile', authenticateUser, checkBlockedUser, uploadSingle, updateUserProfileController.handle);
router.get('/psychologists/:userId/slots', getSlotsForUserController.handle);
router.post('/payment/create-checkout-session', authenticateUser, checkBlockedUser, paymentController.createCheckoutSession);
router.post('/payment/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);
router.get('/consultations', authenticateUser, checkBlockedUser, getUserConsultationsController.handle);
router.get('/consultation/:id', authenticateUser, checkBlockedUser, getUserConsultationDetailController.handle);
router.put('/consultation/:id/cancel', authenticateUser, checkBlockedUser, cancelConsultationController.handle);

router.post('/wallet', authenticateUser, checkBlockedUser, createWalletController.handle);
router.get('/wallet', authenticateUser, checkBlockedUser, getWalletByUserController.handle);
router.get('/wallet/:walletId', authenticateUser, checkBlockedUser, getWalletByIdController.handle);
router.post('/wallet/:walletId/transactions', authenticateUser, checkBlockedUser, createWalletTransactionController.handle);
router.get('/wallet/:walletId/transactions', authenticateUser, checkBlockedUser, listWalletTransactionController.handle);

export default router;
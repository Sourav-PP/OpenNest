import express from 'express';
import { uploadSingle } from '../middlewares/multer';
//validators
import { loginValidate, loginValidator } from '../validators/loginValidator';
import { createServiceValidator, validateCreateService } from '../validators/createServiceValidator';
//controllers
import {
    adminAuthController,
    adminRefreshTokenController,
    authenticateAdmin,
    adminKycController,
    adminUserManagementController,
    adminServiceController,
    adminConsultationController,
    planController,
    adminPayoutController,
    adminDashboardController,
} from '@/infrastructure/config/di';

const router = express.Router();

router.post('/login', loginValidator, loginValidate, adminAuthController.login);
router.post('/logout', adminAuthController.logout);
router.post('/refresh-token', adminRefreshTokenController.handle);
router.post('/services', uploadSingle, createServiceValidator, validateCreateService, adminServiceController.create);
router.delete('/services/:serviceId', authenticateAdmin, adminServiceController.delete);
router.get('/users', authenticateAdmin, adminUserManagementController.getAllUsers);
router.get('/psychologists', authenticateAdmin, adminUserManagementController.getAllPsychologists);
router.get('/kyc', authenticateAdmin, adminKycController.getAllKyc);
router.get('/kyc/:psychologistId', authenticateAdmin, adminKycController.getKycForPsychologist);
router.patch('/kyc/:psychologistId/approve', authenticateAdmin, adminKycController.approveKyc);
router.patch('/kyc/:psychologistId/reject', authenticateAdmin, adminKycController.rejectKyc);
router.patch('/users/:userId/status', authenticateAdmin, adminUserManagementController.toggleUserStatus);
router.get('/consultations', authenticateAdmin, adminConsultationController.getAllConsultations);
router.post('/plans', authenticateAdmin, planController.createPlan);
router.get('/plans', authenticateAdmin, planController.getAllPlans);
router.delete('/plans/:planId', authenticateAdmin, planController.deletePlan);
router.get('/payout-requests', authenticateAdmin, adminPayoutController.listPayoutRequests);
router.patch('/payout-requests/:payoutRequestId/approve', authenticateAdmin, adminPayoutController.approvePayout);
router.patch('/payout-requests/:payoutRequestId/reject', authenticateAdmin, adminPayoutController.rejectPayout);
router.get('/top-psychologists', adminConsultationController.getTopPsychologists);
router.get('/dashboard/totals', adminDashboardController.getDashboardTotals);
router.get('/revenue-stats', adminDashboardController.getRevenueStats);

export default router;

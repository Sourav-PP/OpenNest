import express from "express";
import {
  authenticatePsychologist,
  createSlotController,
  deleteSlotController,
  getSlotByPsychologistController,
  updatePsychologistProfileController,
  getKycDetailsController
} from "../../../config/di";

//-------------controller--------------
import { getProfileController } from "../../../config/di";
import { uploadSingle } from "../middlewares/multer";

const router = express.Router();

router.get("/profile", authenticatePsychologist, getProfileController.handle);
router.put("/profile",authenticatePsychologist, uploadSingle, updatePsychologistProfileController.handle);
router.get('/kyc', authenticatePsychologist, getKycDetailsController.handle)
router.post("/slot", authenticatePsychologist, createSlotController.handle);
router.get("/slot", authenticatePsychologist, getSlotByPsychologistController.handle);
router.delete("/slot/:slotId", authenticatePsychologist, deleteSlotController.handle);

export default router;

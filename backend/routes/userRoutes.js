import express from "express";
import { createUserProfile, getNextEmployeeId, upload } from "../controllers/userController.js";

const router = express.Router();

router.post("/create", upload.single("profilePic"), createUserProfile); // <-- include multer here
router.get("/next-id", getNextEmployeeId);

export default router;

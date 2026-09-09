import express from "express";
import { registerUserController, loginuserController } from "../controllers/auth.controller.js";

const router = express.Router();
/**
 * @desc register user
 * @route POST /api/auth/register
 * @access public
 */
router.post("/register", registerUserController);

/**
 * @desc login user
 * @route POST /api/auth/login
 * @access public
 */
router.post("/login", loginuserController);

export default router;
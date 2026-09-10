import express from "express";
import { registerUserController, loginUserController, getUserController, refreshTokenController, logoutUserController } from "../controllers/auth.controller.js";

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
router.post("/login", loginUserController);

/**
 * @desc get current user
 * @route GET /api/auth/get-user
 * @access private
 */
router.get("/get-user", getUserController);

/**
 * @desc refresh token
 * @route POST /api/auth/refresh
 * @access private
 */
router.post("/refresh", refreshTokenController);

/**
 * @desc logout user
 * @route POST /api/auth/logout
 * @access private
 */
router.post("/logout", logoutUserController);

export default router;
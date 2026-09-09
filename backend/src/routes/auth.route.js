const express = require("express")
const { registerUserController, loginuserController } = require("../controllers/auth.controller")

const router = express.Router()
/**
 * @desc register user
 * @route POST /api/auth/register
 * @access public
 */
router.post("/register", registerUserController)

/**
 * @desc login user
 * @route POST /api/auth/login
 * @access public
 */
router.post("/login", loginuserController)

module.exports = router
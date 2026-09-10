import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken, verifyAccessToken, verifyRefreshToken } from "../utils/auth.js";

const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
});

// Register user controller
export const registerUserController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required",
                success: false
            });
        }

        const userAlreadyExist = await userModel.findOne({ email });

        if (userAlreadyExist) {
            return res.status(400).json({
                path: "email",
                message: "User with this email already exists",
                success: false
            });
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const user = await userModel.create({
            username, email, password: hashPassword
        });

        const { accessToken, refreshToken } = generateToken({ id: user._id });

        user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        await user.save();

        res.cookie("refreshToken", refreshToken, getCookieOptions());

        return res.status(201).json({
            message: "User created successfully",
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            },
            accessToken
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Login user controller
export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false
            });
        }

        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false
            });
        }

        const { accessToken, refreshToken } = generateToken({ id: user._id });

        user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
        await user.save();

        res.cookie("refreshToken", refreshToken, getCookieOptions());

        return res.status(200).json({
            message: "User logged in successfully",
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            },
            accessToken
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Get user controller
export const getUserController = async (req, res) => {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.startsWith("Bearer ") 
        ? authHeader.split(" ")[1] 
        : null;

    if (!accessToken) {
        return res.status(401).json({
            message: "Unauthorized - Access token missing",
            success: false
        });
    }

    try {
        const decoded = verifyAccessToken(accessToken);
        if (!decoded || !decoded.id) {
            return res.status(401).json({
                message: "Unauthorized - Invalid access token",
                success: false
            });
        }

        const user = await userModel.findById(decoded.id).select("-password -refreshTokenHash");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            }
        });
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized - Invalid or expired token",
            error: error.message
        });
    }
};

// Refresh Token controller
export const refreshTokenController = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Unauthorized - No refresh token provided",
            success: false
        });
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded || !decoded.id) {
            return res.status(401).json({
                message: "Unauthorized - Invalid refresh token signature",
                success: false
            });
        }

        const user = await userModel.findById(decoded.id);

        if (!user || !user.refreshTokenHash) {
            return res.status(401).json({
                message: "Unauthorized - User session invalid",
                success: false
            });
        }

        const validRefreshToken = await bcrypt.compare(refreshToken, user.refreshTokenHash);

        if (!validRefreshToken) {
            user.refreshTokenHash = null;
            await user.save();
            res.clearCookie("refreshToken", getCookieOptions());
            return res.status(401).json({
                message: "Unauthorized - Refresh token revoked",
                success: false
            });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateToken({ id: user._id });

        user.refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
        await user.save();

        res.cookie("refreshToken", newRefreshToken, getCookieOptions());

        return res.status(200).json({
            message: "Token refreshed successfully",
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            },
            accessToken
        });

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized - Token refresh failed",
            error: error.message
        });
    }
};

// Logout user controller
export const logoutUserController = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false
        });
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const validRefreshToken = await bcrypt.compare(refreshToken, user.refreshTokenHash);

        if (!validRefreshToken) {
            user.refreshTokenHash = null;
            await user.save();
            res.clearCookie("refreshToken", getCookieOptions());
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            });
        }

        user.refreshTokenHash = null;
        await user.save();

        res.clearCookie("refreshToken", getCookieOptions());

        return res.status(200).json({
            message: "User logged out successfully",
            success: true
        });
    } catch (error) {
        res.clearCookie("refreshToken", getCookieOptions());
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};
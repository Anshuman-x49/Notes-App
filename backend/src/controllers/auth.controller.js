import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/auth.js";

// Register user controller
export const registerUserController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userAlreadyExist = await userModel.findOne({ email });

        if (userAlreadyExist) {
            return res.status(400).json({
                path: "email",
                message: "User already exists",
                success: false
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name, email, password: hashPassword
        })

        const { accessToken, refreshToken } = generateToken({ id: user._id })

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User created successfully",
            success: true,
            data: {
                user: {
                    name: user.name,
                    email: user.email
                }
            },
            accessToken
        })



    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const loginuserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "all feilds are required",
                success: false
            })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(401).json({
                message: "Invalid Credentials",
                success: false
            })
        }

        const {accessToken, refreshToken} = generateToken({id: user._id});

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "User logged in successfully",
            success: true,
            data: {
                user: {
                    name: user.name,
                    email: user.email
                }
            },
            accessToken
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}
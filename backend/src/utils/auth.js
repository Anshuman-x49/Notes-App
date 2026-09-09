import jwt from "jsonwebtoken";
import config from "../config/config.js";

export function generateToken({id}) {
    const accessToken = jwt.sign(id, config.access_token_secret, { expiresIn: "15m" });
    const refreshToken = jwt.sign(id, config.refresh_token_secret, { expiresIn: "7d" });
    return { accessToken, refreshToken };
}
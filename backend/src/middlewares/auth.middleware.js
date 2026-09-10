import { verifyAccessToken } from "../utils/auth.js";

const protectRoute = (req, res, next) => {
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
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized - Token expired or invalid",
            success: false
        });
    }
};

export default protectRoute;

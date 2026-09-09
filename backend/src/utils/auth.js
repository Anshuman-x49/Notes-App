const jwt = require("jsonwebtoken");
const config = require("../config/config");

function generateToken(payload) {
    const accessToken = jwt.sign(payload, config.access_token_secret, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, config.refresh_token_secret, { expiresIn: "7d" });
    return { accessToken, refreshToken }
}

module.export = {
    generateToken, 
}
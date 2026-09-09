import dotenv from "dotenv";
dotenv.config();

const config = {
    db_url: process.env.MONGODB_URI,
    port: process.env.PORT || 3000,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
};

console.log("Environmental variables loading : ", {
    db: config.db_url ? '✓' : '✗',
    port: config.port ? '✓' : '✗',
    accessToken: config.access_token_secret ? '✓' : '✗',
    refreshToken: config.refresh_token_secret ? '✓' : '✗'
});

if (!config.db_url || !config.port || !config.access_token_secret || !config.refresh_token_secret) {
    throw new Error("Please provide all the required environment variables");
}

export default config;

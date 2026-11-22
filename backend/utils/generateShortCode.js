
const crypto = require("crypto");

const generateShortCode = () => {
    return crypto.randomBytes(4).toString("base64url");
};

module.exports = generateShortCode;

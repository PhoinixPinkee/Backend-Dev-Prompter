const jwt = require("jsonwebtoken");
require("dotenv").config();
const generateResetToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};
const verifyResetToken = (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded successfully:", decoded);
      return decoded.userId;
    } catch (err) {
      console.error("Invalid or expired token:", err.message);
      return null;
    }
  };
module.exports = { generateResetToken, verifyResetToken };

const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const transporter = require("../Utils/email.js");
const { generateResetToken, verifyResetToken } = require("../Utils/token");
const { signupValidation, loginValidation } = require("../Middlewares/AuthValidation");
const { signup, login } = require("../Controllers/ÁuthController");

// Signup & Login
router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = generateResetToken(user._id);
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      from: '"DevPromptor" <no-reply@devpromptor.com>',
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
    });

    res.json({ message: "Password reset link sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while sending email" });
  }
});

// Reset Password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const userId = verifyResetToken(token);
    if (!userId) return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting password" });
  }
});
// In routes/auth.js or similar
router.get("/verify", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ success: true, user: decoded });
    } catch (err) {
      res.json({ success: false, message: "Invalid token" });
    }
  });
  
module.exports = router;

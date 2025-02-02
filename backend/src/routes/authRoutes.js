const express = require("express");
const passport = require("../config/passportGoogle");
const authController = require("../controllers/authController");
const {
  loginValidator,
  registerValidator,
  emailValidator,
  changePasswordValidator,
  resetPasswordValidator,
} = require("../request-validators/authValidator");
const {
  checkAccessToken,
  checkRefreshToken,
  checkEmailVerificationToken,
  checkForgotPasswordToken,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginValidator, authController.login);

router.post("/register", registerValidator, authController.register);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallback
);

router.delete(
  "/logout",
  checkAccessToken,
  checkRefreshToken,
  authController.logout
);

router.post("/token", checkRefreshToken, authController.getAccessToken);
















router.post(
  "/send-verification-email",
  checkAccessToken,
  emailValidator,
  authController.sendVerificationEmail
);
router.get(
  "/verify-email",
  checkEmailVerificationToken,
  authController.verifyEmail
);
















router.post(
  "/change-password",
  checkAccessToken,
  changePasswordValidator,
  authController.changePassword
);

router.post(
  "/send-forgot-password-email",
  emailValidator,
  authController.sendForgotPasswordEmail
);
router.post(
  "/reset-password",
  checkForgotPasswordToken,
  resetPasswordValidator,
  authController.resetPassword
);

module.exports = router;

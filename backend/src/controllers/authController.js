require("dotenv").config();
const ApiResponse = require("../responses/apiResponse");
const authService = require("../services/internal/authService");
const { getGoogleAuthRedirectUrl } = require("../utils/constants");
const {
  StatusCodes,
  AuthMessages,
  ResponseTypes,
} = require("../responses/apiConstants");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const payload = { email, password };

    const result = await authService.login(payload);
    ApiResponse.handleResponse(res, result);
  } catch (error) {
    console.log(error);
    ApiResponse.error(res, {
      statusCode: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorLogin,
    });
  }
};

const register = async (req, res) => {
  try {
    const { userName, email, password, confirmPassword } = req.body;
    const payload = { userName, email, password, confirmPassword };

    const result = await authService.register(payload);
    ApiResponse.handleResponse(res, result);
  } catch (error) {
    console.log(error);
    ApiResponse.error(res, {
      statusCode: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorRegister,
    });
  }
};

const googleCallback = async (req, res) => {
  try {
    if (req.user.isSuccess !== undefined) {
      const response = {
        isSuccess: false,
        message: "Authentication failed",
      };
      return res.redirect(
        `${process.env.CLIENT_URL}/google-auth?success=false&message=${encodeURIComponent(
          response.message
        )}`
      );
    }

    const { _id, userName, email, verified } = req.user;
    const payload = { _id, userName, email, verified };

    const result = await authService.handleGoogleCallback(payload);

    if (result.type === ResponseTypes.Success) {
      return res.redirect(
        `${process.env.CLIENT_URL}/google-auth?success=true&token=${result.data.token}&refreshToken=${result.data.refreshToken}`
      );
    } else {
      return res.redirect(
        `${process.env.CLIENT_URL}/google-auth?success=false&message=${encodeURIComponent(
          result.error
        )}`
      );
    }
  } catch (error) {
    console.error("Google authentication error.", error);
    return res.redirect(
      `${process.env.CLIENT_URL}/google-auth?success=false&message=Server error`
    );
  }
};


const logout = async (req, res) => {
  try {
    const userId = req.currentUser.userId;
    const refreshToken = req.body.refreshToken;

    const result = await authService.logout(userId, refreshToken);
    ApiResponse.handleResponse(res, result);
  } catch (error) {
    console.log(error);
    ApiResponse.error(res, {
      statusCode: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorLogout,
    });
  }
};

const getAccessToken = async (req, res) => {
  try {
    const userId = req.currentUser.userId;
    const refreshToken = req.body.refreshToken;

    const result = await authService.getAccessToken(userId, refreshToken);
    ApiResponse.handleResponse(res, result);
  } catch (error) {
    console.log(error);
    ApiResponse.error(res, {
      statusCode: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorGetAccessToken,
    });
  }
};

const sendVerificationEmail = async (req, res) => {
  try {
    const email = req.body.email;

    const result = await authService.sendVerificationEmail(email);
    ApiResponse.handleResponse(res, result);
  } catch (error) {
    console.log(error);
    ApiResponse.error(res, {
      statusCode: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorSendVerificationEmail,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const verificationToken = req.query.token;
    const result = await authService.verifyEmail(verificationToken);

    if (result.type === "success") {
      res.redirect("http://localhost:3000/verify-email-result?success=true");
    } else {
      res.redirect("http://localhost:3000/verify-email-result?success=false");
    }
  } catch (error) {
    console.log(error);
    ApiResponse.error(res, {
      statusCode: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorVerifyEmail,
    });
  }
};























const changePassword = async (req, res) => {
  try {
    const userId = req.currentUser.userId;
    const { oldPassword, password } = req.body;
    const payload = { oldPassword, password };

    const result = await authService.changePassword(userId, payload);
    ApiResponse.handleResponse(res, result);
  } catch (error) {
    console.log(error);
    ApiResponse.error(res, {
      statusCode: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorPasswordChange,
    });
  }
};

const sendForgotPasswordEmail = async (req, res) => {
  try {
    const email = req.body.email;

    const result = await authService.sendForgotPasswordEmail(email);
    ApiResponse.handleResponse(res, result);
  } catch (error) {
    console.log(error);
    ApiResponse.error(res, {
      statusCode: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorForgotPassword,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const userId = req.currentUser.userId;
    const { forgotPasswordToken, password } = req.body;
    const payload = { forgotPasswordToken, password };

    const result = await authService.resetPassword(userId, payload);
    ApiResponse.handleResponse(res, result);
  } catch (error) {
    console.log(error);
    ApiResponse.error(res, {
      statusCode: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorResetPassword,
    });
  }
};

module.exports = {
  register,
  login,
  googleCallback,
  logout,
  getAccessToken,
  sendVerificationEmail,
  verifyEmail,
  changePassword,
  sendForgotPasswordEmail,
  resetPassword,
};

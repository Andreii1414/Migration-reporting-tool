require("dotenv").config();
const User = require("../../models/userModel");
const RefreshToken = require("../../models/refreshTokenModel");
const emailService = require("../external/emailService");
const {
  getVerificationUrl,
  getVerificationEmailHtml,
  getResetPasswordEmailHtml,
} = require("../../utils/constants");
const {
  createJwtToken,
  extractPayloadJwt,
  getTokenHash,
  isValidJwt,
} = require("../../utils/authUtils");
const {
  StatusCodes,
  ResponseTypes,
  UserMessages,
  TokenMessages,
  GoogleMessages,
  AuthMessages,
} = require("../../responses/apiConstants");

const login = async (payload) => {
  try {
    const email = payload.email.toLowerCase();
    const password = payload.password;
    const user = await User.findOne({ email: email }).exec();

    if (!user) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.BadRequest,
        error: UserMessages.UserEmailNotExists,
      };
    }

    if (user.googleId) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.BadRequest,
        error: GoogleMessages.UserExistsLogin,
      };
    }

    const passwordValid = await user.validatePassword(password);
    if (!passwordValid) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.BadRequest,
        error: UserMessages.InvalidPassword,
      };
    }

    const tokenPayload = {
      userId: user._id,
      email: user.email,
      userName: user.userName,
      verified: user.verified,
    };

    const token = createJwtToken(
      process.env.ACCESS_TOKEN_SECRET,
      "15m",
      tokenPayload
    );
    const refreshToken = createJwtToken(
      process.env.REFRESH_TOKEN_SECRET,
      "7d",
      tokenPayload
    );

    if (!token || !refreshToken) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.InternalServerError,
        error: TokenMessages.TokenCreationError,
      };
    }

    const saveRefreshToken = await saveRefreshTokenToCollection(
      refreshToken,
      user._id
    );

    if (!saveRefreshToken) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.InternalServerError,
        error: TokenMessages.FailedSavingToken,
      };
    }

    if (user.verified === false) {
      const sendVerificationResult = await sendVerificationEmail(user.email);
    }

    return {
      type: ResponseTypes.Success,
      status: StatusCodes.Ok,
      data: {
        message: AuthMessages.LoginSuccess,
        token,
        refreshToken,
      },
    };
  } catch (error) {
    console.error("Login service error:", error);
    return {
      type: ResponseTypes.Error,
      status: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorLogin,
    };
  }
};

const register = async (payload) => {
  try {
    const { userName, email, password } = payload;
    const userExists = await User.findOne({
      email: email.toLowerCase(),
    }).exec();

    if (userExists) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.BadRequest,
        error: UserMessages.Exists,
      };
    }

    const user = new User({
      userName,
      email: email.toLowerCase(),
      passwordHash: password,
    });

    const tokenPayload = {
      userId: user._id,
      email: user.email,
      userName: user.userName,
      verified: user.verified,
    };

    const token = createJwtToken(
      process.env.ACCESS_TOKEN_SECRET,
      "15m",
      tokenPayload
    );
    const refreshToken = createJwtToken(
      process.env.REFRESH_TOKEN_SECRET,
      "7d",
      tokenPayload
    );

    if (!token || !refreshToken) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.InternalServerError,
        error: TokenMessages.TokenCreationError,
      };
    }

    const saveRefreshToken = await saveRefreshTokenToCollection(
      refreshToken,
      user._id
    );

    if (!saveRefreshToken) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.InternalServerError,
        error: TokenMessages.FailedSavingToken,
      };
    }
    await user.save();

    const sendVerificationResult = await sendVerificationEmail(user.email);

    return {
      type: ResponseTypes.Success,
      status: StatusCodes.Created,
      data: {
        message: AuthMessages.RegisterSuccess,
        sentVerification:
          sendVerificationResult.type === "success" ? true : false,
        token,
        refreshToken,
      },
    };
  } catch (error) {
    console.error("Register service error:", error);
    return {
      type: ResponseTypes.Error,
      status: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorRegister,
    };
  }
};

const handleGoogleCallback = async (payload) => {
  try {
    const { _id, userName, email, verified } = payload;
    const tokenPayload = {
      userId: _id,
      email,
      userName,
      verified,
    };

    const token = createJwtToken(
      process.env.ACCESS_TOKEN_SECRET,
      "15m",
      tokenPayload
    );
    const refreshToken = createJwtToken(
      process.env.REFRESH_TOKEN_SECRET,
      "7d",
      tokenPayload
    );

    if (!token || !refreshToken) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.InternalServerError,
        error: "Google authentication error.",
      };
    }

    const saveRefreshToken = await saveRefreshTokenToCollection(
      refreshToken,
      _id
    );

    if (!saveRefreshToken) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.InternalServerError,
        error: "Google authentication error.",
      };
    }

    return {
      type: ResponseTypes.Success,
      status: StatusCodes.Ok,
      data: {
        message: "Google authentication success.",
        token,
        refreshToken,
      },
    };
  } catch (error) {
    console.error("Google authentication service error.", error);
    return {
      type: ResponseTypes.Error,
      status: StatusCodes.InternalServerError,
      error: "Google authentication error.",
    };
  }
};

const logout = async (userId, refreshToken) => {
  try {
    const refreshTokenHash = getTokenHash(refreshToken);
    const result = await RefreshToken.findOneAndDelete({
      user: userId,
      tokenHash: refreshTokenHash,
    }).exec();

    if (!refreshTokenHash || !result) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.NotFound,
        error: TokenMessages.NoTokenFound,
      };
    }

    return {
      type: ResponseTypes.Success,
      status: StatusCodes.Ok,
      data: { message: AuthMessages.LogoutSuccess },
    };
  } catch (error) {
    console.error("Error during logout:", error);
    return {
      type: ResponseTypes.Error,
      status: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorLogout,
    };
  }
};

const getAccessToken = async (userId, refreshToken) => {
  try {
    const refreshTokenHash = getTokenHash(refreshToken);
    const existsRefreshToken = await RefreshToken.findOne({
      user: userId,
      tokenHash: refreshTokenHash,
    }).exec();

    if (!refreshTokenHash || !existsRefreshToken) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.NotFound,
        error: TokenMessages.NoTokenFound,
      };
    }

    if (existsRefreshToken.expires < new Date()) {
      await RefreshToken.findByIdAndDelete(existsRefreshToken._id).exec();
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.Unauthorized,
        error: TokenMessages.TokenExpired,
      };
    }

    const extracted = extractPayloadJwt(refreshToken);

    const newAccessTokenPayload = {
      userId: extracted.userId,
      userName: extracted.userName,
      email: extracted.email,
      verified: extracted.verified,
    };

    const newAccessToken = createJwtToken(
      process.env.ACCESS_TOKEN_SECRET,
      "15m",
      newAccessTokenPayload
    );

    if (!newAccessToken) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.InternalServerError,
        error: TokenMessages.TokenCreationError,
      };
    }

    return {
      type: ResponseTypes.Success,
      status: StatusCodes.Ok,
      data: {
        message: TokenMessages.TokenRefreshed,
        token: newAccessToken,
      },
    };
  } catch (error) {
    console.error("Error during new access token generation:", error);
    return {
      type: ResponseTypes.Error,
      status: StatusCodes.InternalServerError,
      error: TokenMessages.UnexpectedError,
    };
  }
};

const sendVerificationEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() }).exec();

    if (!user) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.NotFound,
        error: UserMessages.UserEmailNotExists,
      };
    }

    if (user.verified) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.BadRequest,
        error: UserMessages.UserAlreadyVerified,
      };
    }

    const tokenPayload = {
      userId: user._id,
      email: user.email.toLowerCase(),
      userName: user.userName,
    };

    const verificationToken = createJwtToken(
      process.env.VERIFICATION_TOKEN_SECRET,
      "1h",
      tokenPayload
    );

    if (!verificationToken) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.InternalServerError,
        error: TokenMessages.TokenCreationError,
      };
    }

    const verificationUrl = getVerificationUrl(verificationToken);
    const html = getVerificationEmailHtml(verificationUrl);

    const sendResult = await emailService.sendEmail(
      email,
      "Verify Your Email",
      html
    );

    if (!sendResult) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.InternalServerError,
        error: AuthMessages.EmailSendError,
      };
    }

    return {
      type: ResponseTypes.Success,
      status: StatusCodes.Ok,
      data: {
        message: AuthMessages.EmailVerificationSent,
      },
    };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return {
      type: ResponseTypes.Error,
      status: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorVerifyEmail,
    };
  }
};

const verifyEmail = async (verificationToken) => {
  try {
    const tokenPayload = extractPayloadJwt(verificationToken);
    const { userId, email } = tokenPayload;

    const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.NotFound,
        error: UserMessages.UserEmailNotExists,
      };
    }

    if (user.verified) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.BadRequest,
        error: UserMessages.UserAlreadyVerified,
      };
    }

    if (user.email !== email.toLowerCase()) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.BadRequest,
        error: UserMessages.InvalidEmail,
      };
    }

    user.verified = true;
    await user.save();

    return {
      type: ResponseTypes.Success,
      status: StatusCodes.Ok,
      data: {
        message: AuthMessages.EmailVerified,
      },
    };
  } catch (error) {
    console.error("Error verifying email:", error);
    return {
      type: ResponseTypes.Error,
      status: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorVerifyEmail,
    };
  }
};

const changePassword = async (userId, payload) => {
  try {
    const { oldPassword, password } = payload;

    const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.NotFound,
        error: UserMessages.NotFound,
      };
    }

    if (user.googleId) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.BadRequest,
        error: GoogleMessages.ChangePasswordFromGoogle,
      };
    }

    const oldPasswordValid = await user.validatePassword(oldPassword);
    if (!oldPasswordValid) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.BadRequest,
        error: AuthMessages.InvalidOldPassword,
      };
    }

    user.passwordHash = password;
    await user.save();

    return {
      type: ResponseTypes.Success,
      status: StatusCodes.Ok,
      data: {
        message: AuthMessages.PasswordChanged,
      },
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      type: ResponseTypes.Error,
      status: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorPasswordChange,
    };
  }
};

const sendForgotPasswordEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() }).exec();
    if (!user) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.NotFound,
        error: UserMessages.UserEmailNotExists,
      };
    }

    if (user.googleId) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.BadRequest,
        error: GoogleMessages.ResetPasswordFromGoogle,
      };
    }

    const tokenPayload = {
      userId: user._id,
      email: user.email.toLowerCase(),
    };

    const forgotPasswordToken = createJwtToken(
      process.env.FORGOT_PASSWORD_TOKEN_SECRET,
      "15m",
      tokenPayload
    );

    if (!forgotPasswordToken) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.InternalServerError,
        error: TokenMessages.TokenCreationError,
      };
    }
    const html = getResetPasswordEmailHtml(forgotPasswordToken);

    const sendResult = await emailService.sendEmail(
      email,
      "Reset Your Password",
      html
    );

    if (!sendResult) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.InternalServerError,
        error: AuthMessages.ForgotPasswordEmailFailed,
      };
    }

    return {
      type: ResponseTypes.Success,
      status: StatusCodes.Ok,
      data: {
        message: AuthMessages.ForgotPasswordEmailSent,
      },
    };
  } catch (error) {
    console.error("Failed to send forgot password email:", error);
    return {
      type: ResponseTypes.Error,
      status: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorForgotPassword,
    };
  }
};

const resetPassword = async (userId, payload) => {
  try {
    const { forgotPasswordToken, password } = payload;
    const user = await User.findOne({ _id: userId }).exec();

    if (!user) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.NotFound,
        error: UserMessages.NotFound,
      };
    }

    if (user.googleId) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.BadRequest,
        error: GoogleMessages.ResetPasswordFromGoogle,
      };
    }

    const tokenPayload = extractPayloadJwt(forgotPasswordToken);
    if (tokenPayload.userId !== userId) {
      return {
        type: ResponseTypes.Error,
        status: StatusCodes.BadRequest,
        error: TokenMessages.TokenPayloadInvalid,
      };
    }

    user.passwordHash = password;
    await user.save();

    return {
      type: ResponseTypes.Success,
      status: StatusCodes.Ok,
      data: {
        message: AuthMessages.PasswordResetSuccess,
      },
    };
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      type: ResponseTypes.Error,
      status: StatusCodes.InternalServerError,
      error: AuthMessages.UnexpectedErrorResetPassword,
    };
  }
};

// PRIVATE helper function to create a refresh token in the database
const saveRefreshTokenToCollection = async (refreshToken, userId) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);

  const hash = getTokenHash(refreshToken);
  if (!hash) return false;

  await new RefreshToken({
    user: userId,
    tokenHash: hash,
    expires: expirationDate,
  }).save();

  return true;
};

module.exports = {
  login,
  register,
  logout,
  getAccessToken,
  handleGoogleCallback,
  sendVerificationEmail,
  verifyEmail,
  changePassword,
  sendForgotPasswordEmail,
  resetPassword,
};

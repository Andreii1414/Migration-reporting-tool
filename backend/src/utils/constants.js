require("dotenv").config();

const regexPatterns = {
  nameRegex: /^[a-zA-Z]+([ \-][a-zA-Z]+)*$/,
  emailRegex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
};

const getVerificationUrl = (token) => {
  const verificationUrl = `${process.env.SERVER_URL}/api/auth/verify-email?token=${token}`;
  return verificationUrl;
};

const getVerificationEmailHtml = (verificationUrl) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #ffffff;
        color: #333333;
        padding: 20px;
        margin: 0;
      }
      h1 {
        color: #333333;
      }
      p {
        font-size: 16px;
      }
      a {
        color: #1a0dab;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <h1>Verify Your Email</h1>
    <p>Please click on the link below to verify your email address:</p>
    <a href="${verificationUrl}">Click here!</a>
  </body>
  </html>`;
};

const getResetPasswordEmailHtml = (forgotPasswordToken) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f9;
        color: #333;
        line-height: 1.6;
        padding: 20px;
        text-align: center;
      }
      h1 {
        color: #00457c;
      }
      p {
        font-size: 16px;
      }
      .reset-container {
        margin-top: 20px;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .reset-link {
        display: inline-block;
        background-color: #304ffe;
        color: white;
        text-decoration: none;
        font-size: 18px;
        padding: 10px 20px;
        border-radius: 5px;
        margin-top: 10px;
      }
      .reset-link:hover {
        background-color: #002984;
      }
    </style>
  </head>
  <body>
    <h1>Reset Your Password</h1>
    <p>If you requested a password reset, click the button below:</p>
    <div class="reset-container">
      <a href="${process.env.CLIENT_URL}/reset-password?token=${forgotPasswordToken}" class="reset-link">Reset Password</a>
    </div>
    <p>If you didn't request this, please ignore this email.</p>
  </body>
  </html>`;
};

module.exports = {
  getVerificationUrl,
  getVerificationEmailHtml,
  getResetPasswordEmailHtml,
  regexPatterns,
};

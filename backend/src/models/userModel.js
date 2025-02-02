const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { regexPatterns } = require("../utils/constants");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "UserName name is required"],
      trim: true,
      minlength: [2, "UserName name needs to be at least 2 characters long"],
      maxlength: [100, "UserName name can be no more than 100 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: [true, "Email already exists"],
      lowercase: true,
      match: [regexPatterns.emailRegex, "Email is not valid"],
    },
    passwordHash: {
      type: String,
    },
    googleId: {
      type: String,
      unique: [true, "Google ID already exists"],
      sparse: true,
    },
    profilePhoto: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
      required: [true, "Email verification status is required"],
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("passwordHash")) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});

userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

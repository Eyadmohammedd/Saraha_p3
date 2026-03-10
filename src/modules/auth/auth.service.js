import {
  generateHash,
  compareHash,
} from "../../common/utils/security/hash.security.js";

import { generateEncryption } from "../../common/utils/security/encryption.security.js";

import {
  ProviderEnum,
  RoleEnum,
} from "../../common/enums/user.enum.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../common/utils/security/token.security.js";

import { OAuth2Client } from "google-auth-library";

import { sendEmail } from "./email.service.js";

import { UserModel } from "../../DB/model/user.model.js";

import {
  findOne,
  create,
  findOneAndUpdate,
} from "../../DB/database.repository.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



/* ================= SIGNUP ================= */

export const signup = async (inputs) => {

  const { firstName, lastName, email, password, phone } = inputs;

  const existingUser = await findOne({
    model: UserModel,
    filter: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await generateHash(password);

  const encryptedPhone = await generateEncryption(phone);

  const otp = Math.floor(100000 + Math.random() * 900000);

  await create({
    model: UserModel,
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone: JSON.stringify(encryptedPhone),

      provider: ProviderEnum.System,
      role: RoleEnum.User,

      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    },
  });

  await sendEmail(
    email,
    "Verify your account",
    `<h2>Your OTP is: ${otp}</h2>`
  );

  return { message: "Signup successful, please verify OTP" };
};



/* ================= VERIFY OTP ================= */

export const verifyOtp = async ({ email, otp }) => {

  const user = await findOne({
    model: UserModel,
    filter: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.otp !== Number(otp)) {
    throw new Error("Invalid OTP");
  }

  if (Date.now() > user.otpExpires) {
    throw new Error("OTP expired");
  }

  await findOneAndUpdate({
    model: UserModel,
    filter: { email },
    update: {
      isVerified: true,
      otp: null,
      otpExpires: null,
    },
  });

  return { message: "Account verified successfully" };
};



/* ================= LOGIN ================= */

export const login = async ({ email, password }) => {

  const user = await findOne({
    model: UserModel,
    filter: { email },
  });

  if (!user) {
    throw new Error("Email not found");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your account first");
  }

  const match = await compareHash(password, user.password);

  if (!match) {
    throw new Error("Incorrect password");
  }

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user._id,
    role: user.role,
  });

  return {
    accessToken,
    refreshToken,
  };
};



/* ================= RESEND OTP ================= */

export const resendOtp = async ({ email }) => {

  const user = await findOne({
    model: UserModel,
    filter: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  await findOneAndUpdate({
    model: UserModel,
    filter: { email },
    update: {
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    },
  });

  await sendEmail(
    email,
    "Resend OTP",
    `<h2>Your new OTP is: ${otp}</h2>`
  );

  return { message: "OTP resent successfully" };
};



/* ================= GOOGLE LOGIN ================= */

export const googleLoginService = async (idToken) => {

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const { email, name, picture } = payload;

  const names = name.split(" ");
  const firstName = names[0];
  const lastName = names.slice(1).join(" ") || "GoogleUser";

  let user = await findOne({
    model: UserModel,
    filter: { email },
  });

  if (!user) {

    user = await create({
      model: UserModel,
      data: {
        email,
        firstName,
        lastName,

        provider: ProviderEnum.Google,
        role: RoleEnum.User,

        isVerified: true,
        profilePicture: picture,
      },
    });

  }

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role || RoleEnum.User,
  });

  const refreshToken = generateRefreshToken({
    id: user._id,
    role: user.role || RoleEnum.User,
  });

  return {
    accessToken,
    refreshToken,
    user,
  };

};
import mongoose from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from "../../common/enums/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },

    lastName: {
      type: String,
      required: function () {
        return this.provider === ProviderEnum.System;
      },
      minLength: 3,
      maxLength: 20,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === ProviderEnum.System;
      },
    },

    phone: {
      type: String,
      required: function () {
        return this.provider === ProviderEnum.System;
      },
    },

    confirmEmail: {
      type: Date,
    },

    otp: {
      type: Number,
    },

    otpExpires: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    provider: {
      type: Number,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.System,
    },

    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.User,
    },

    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.Male,
    },

    profilePicture: {
      type: String,
    },

    coverPicture: [
      {
        type: String,
      },
    ],
  },
  {
    collection: "saraha_users",
    timestamps: true,
    strictQuery: true,
    strict: true,
    optimisticConcurrency: true,
    autoIndex: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("username").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);
import jwt from "jsonwebtoken";
import { RoleEnum } from "../../enums/user.enum.js";
export const generateAccessToken = ({ id, role }) => {
  if (!role) {
    throw new Error("Role is required to generate token");
  }

  const secret =
    role === "ADMIN"
      ? process.env.ADMIN_ACCESS_SECRET
      : process.env.USER_ACCESS_SECRET;

  return jwt.sign({ id, role }, secret, {
    expiresIn: "15m",
    audience: role.toString(),
  });
};

export const generateRefreshToken = ({ id, role }) => {
  if (!role) {
    throw new Error("Role is required to generate token");
  }

  const secret =
    role === RoleEnum.Admin
      ? process.env.ADMIN_REFRESH_SECRET
      : process.env.USER_REFRESH_SECRET;

  return jwt.sign({ id, role }, secret, {
    expiresIn: "7d",
    audience: role.toString(),
  });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.USER_ACCESS_SECRET, {
      audience: "USER",
    });
  } catch {
    return jwt.verify(token, process.env.ADMIN_ACCESS_SECRET, {
      audience: "ADMIN",
    });
  }
};

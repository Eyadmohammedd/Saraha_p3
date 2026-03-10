import jwt from "jsonwebtoken";
import redisClient from "../redis/redis.client.js";

export const authMiddleware = async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {

    // Check if token is revoked in Redis
    const revoked = await redisClient.get(`bl_${token}`);

    if (revoked) {
      return res.status(401).json({ message: "Token revoked" });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.USER_ACCESS_SECRET);
    } catch {
      decoded = jwt.verify(token, process.env.ADMIN_ACCESS_SECRET);
    }

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token"
    });

  }

};
export const authorization = (roles = []) => {

  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
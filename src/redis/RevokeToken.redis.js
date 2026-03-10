import redisClient from "./redis.client.js";

export const revokeToken = async (token, exp) => {

 const ttl = exp - Math.floor(Date.now() / 1000);

 await redisClient.set(`bl_${token}`, "revoked", {
   EX: ttl
 });

};
import { Router } from "express";
import * as authService from "./auth.service.js";

const router = Router();

router.post("/signup", async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/verify-otp", async (req, res, next) => {
  try {
    const result = await authService.verifyOtp(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/resend-otp", async (req, res, next) => {
  try {
    const result = await authService.resendOtp(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/google-login", async (req, res, next) => {
  try {
    const { token } = req.body;
    const result = await authService.googleLoginService(token);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
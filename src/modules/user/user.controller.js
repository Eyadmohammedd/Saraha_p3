import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { deactivateAccountService } from "./user.service.js";
import upload from "../../middleware/multer.middleware.js";
import {
  getProfileService,
  updateProfilePictureService,   
} from "./user.service.js";
const router = Router();

router.get("/profile", authMiddleware, async (req, res, next) => {
  try {
    const user = await getProfileService(req.user.id);

    res.json(user);
  } catch (error) {
    next(error);
  }
});
router.post(
  "/profile-picture",
  authMiddleware,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const user = await updateProfilePictureService(
        req.user.id,
        req.file.path,
      );

      res.status(200).json({
        message: "Profile picture updated",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
);


router.patch("/deactivate", authMiddleware, async (req, res, next) => {
  try {
    await deactivateAccountService(req.user.id);

    res.status(200).json({
      message: "Account deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/profile", authMiddleware, async (req, res, next) => {
  try {
    const user = await updateProfileService(req.user.id, req.body);

    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;

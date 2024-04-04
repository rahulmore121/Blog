const express = require("express");
const {
  registerUser,
  login,
  createAccessTokenFromRefreshToken,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/auth.controller.js");

const { upload } = require("../middlewares/multer.js");
const { verifyToken } = require("../middlewares/verifyToken.js");
const router = express.Router();

router.post("/register", upload.single("avatar"), registerUser);
router.post("/signin", login);
router.get("/logout", logout);
router.get("/refresh", createAccessTokenFromRefreshToken);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);
router.patch("/updatepassword", verifyToken, updatePassword);

module.exports = router;

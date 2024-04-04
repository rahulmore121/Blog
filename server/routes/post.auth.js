const express = require("express");
const {
  createPost,
  getAllPost,
  getAllUserPost,
  getUserParticularPost,
  updatetUserPost,
  deletePost,
} = require("../controllers/post.controller");
const { verifyToken } = require("../middlewares/verifyToken.js");
const { upload } = require("../middlewares/multer.js");
const router = express.Router();

router.post("/", verifyToken, upload.single("post"), createPost);
router.get("/", getAllPost);
router.get("/user", verifyToken, getAllUserPost);
router.get("/user/:postId", verifyToken, getUserParticularPost);
router.patch("/user/:postId", verifyToken, updatetUserPost);
router.delete("/user/:postId", verifyToken, deletePost);
module.exports = router;

const Post = require("../models/post.model");
const CustomError = require("../utils/CustomError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const { uploadOnCloudinary } = require("../utils/cloudinary");
exports.createPost = asyncErrorHandler(async (req, res, next) => {
  const { name, description } = req.body;
  if (!name || !description) {
    const error = new CustomError("All fields are required", 400);
    return next(error);
    // return res
    //   .status(400)
    //   .json({ status: "failed", msg: "All fields are required", data: null });
  }

  const existingPost = await Post.findOne({ name });
  const postPath = req?.file?.path;
  if (existingPost) {
    fs.unlink(postPath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
      console.log("File deleted");
    });
    const error = new CustomError("post with name already exist", 400);
    return next(error);
    // return res.status(400).json({
    //   status: "failed",
    //   msg: "post with name already exist",
    //   data: null,
    // });
  }
  if (!postPath) {
    const error = new CustomError("Blog Image is reuired", 400);
    return next(error);
  }
  const postUrlFromCloudinary = await uploadOnCloudinary(postPath);
  if (!postUrlFromCloudinary) {
    const error = new CustomError("failed to upload Blog picture", 400);
    return next(error);
  }
  // console.log(postUrlFromCloudinary);
  const post = await Post.create({
    name,
    description,
    userId: req.user,
    postPicturePath: postUrlFromCloudinary.url,
  }); // userId: existingPost._id
  return res.status(201).json({
    status: "sucess",
    msg: `Blog with name ${name} created successfully`,
  });
});

exports.getAllPost = asyncErrorHandler(async (req, res, next) => {
  const allPosts = await Post.find();
  return res.status(200).json({
    status: "sucess",
    msg: `succcess`,
    data: allPosts,
  });
});

exports.getAllUserPost = asyncErrorHandler(async (req, res, next) => {
  const post = await Post.find({ userId: req.user });
  return res.status(200).json({
    status: "sucess",
    msg: `succcess`,
    data: post,
  });
});

exports.getUserParticularPost = asyncErrorHandler(async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const singlePost = await Post.findOne({ _id: postId });
    if (!singlePost) {
      const error = new CustomError("Post doesnt exists", 400);
      return next(error);
      // return res
      //   .status(400)
      //   .json({ status: "failed", msg: "Post doesnt exists", data: null });
    }
    return res.status(200).json({
      status: "sucess",
      msg: `succcess`,
      data: singlePost,
    });
  } catch (error) {
    return res.status(404).json({
      status: "failed",
      msg: `No Post Found`,
      data: null,
    });
  }
});

exports.updatetUserPost = asyncErrorHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const body = req.body;

  try {
    const updatePost = await Post.findByIdAndUpdate(postId, body, {
      new: true,
      runValidators: true,
    });

    if (!updatePost) {
      const error = new CustomError("Post doesnt exists", 400);
      return next(error);
      // return res.status(400).json({
      //   status: "failed",
      //   msg: `Post doesnt exists `,
      //   data: null,
      // });
    }

    return res.status(200).json({
      status: "sucess",
      msg: `succcess`,
      data: updatePost,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      msg: `duplicate post ${error.message}`,
      data: null,
    });
  }
});
exports.deletePost = asyncErrorHandler(async (req, res, next) => {
  const postId = req.params.postId;
  const deletePost = await Post.findByIdAndDelete(postId);
  if (!deletePost) {
    const error = new CustomError("Post doesnt exists", 400);
    return next(error);
    // return res.status(400).json({
    //   status: "failed",
    //   msg: `Post doesnt exists `,
    //   data: null,
    // });
  }

  return res.status(204).json({
    status: "sucess",
    msg: `post deleted successfully`,
    data: null,
  });
});

const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("../utils/asyncErrorHandler.js");
const CustomError = require("../utils/CustomError.js");
const fs = require("fs");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const sendEmail = require("../utils/email.js");
const crypto = require("crypto");
exports.registerUser = asyncErrorHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = new CustomError("All fields are required", 400);
    return next(error);
    // return res
    //   .status(400)
    //   .json({ status: "failed", msg: "All fields are required", data: null });
  }
  const avatarPath = req.file?.path;
  const existingUser = await User.findOne({ $or: [{ email }] });
  if (existingUser) {
    fs.unlink(avatarPath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
      console.log("File deleted");
    });
    const error = new CustomError("user with the id already exist", 400);
    return next(error);
    // return res.status(400).json({
    //   status: "failed",
    //   msg: "user with the id already exist",
    //   data: null,
    // });
  }

  if (!avatarPath) {
    const error = new CustomError("Avatar file is required", 400);
    return next(error);
  }
  const avatar = await uploadOnCloudinary(avatarPath);
  if (!avatar) {
    const error = new CustomError("failed to upload profile picture", 400);
    return next(error);
  }
  const hashedPwd = await bcrypt.hash(password, 10);
  await User.create({
    name,
    email,
    password: hashedPwd,
    profilePhotoPath: avatar.url,
  });
  return res
    .status(201)
    .json({ status: "sucess", msg: `user ${name} created successfully` });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //   console.log(name, email, password);
  if (!email || !password) {
    const error = new CustomError("All fields are required", 400);
    return next(error);
    // return res
    //   .status(400)
    //   .json({ status: "failed", msg: "All fields are required", data: null });
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    const error = new CustomError("user not found", 400);
    return next(error);
    // return res.status(400).json({
    //   status: "failed",
    //   msg: "user not found",
    //   data: null,
    // });
  }
  const matchpwd = await bcrypt.compare(password, existingUser.password);
  if (!matchpwd) {
    const error = new CustomError("email or password is invalid", 400);
    return next(error);
    // return res.status(401).json({
    //   status: "failed",
    //   msg: "email or password is invalid",
    //   data: null,
    // });
  }
  const accessToken = jwt.sign(
    { id: existingUser._id },
    process.env.ACCESS_TOKEN,
    { expiresIn: "1m" }
  );
  const refreshToken = jwt.sign(
    { id: existingUser._id },
    process.env.REFRESH_TOKEN,
    { expiresIn: "10m" }
  );
  existingUser.refreshToken = refreshToken;
  await existingUser.save();
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.status(201).json({
    status: "sucess",
    data: accessToken,
    msg: "user logged successfully",
  });
});

exports.logout = asyncErrorHandler(async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //no content
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.sendStatus(204); //no content
  }

  foundUser.refreshToken = "";
  const result = await foundUser.save();
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  }); // secure :true only serve on https
  res.sendStatus(204);
});

exports.createAccessTokenFromRefreshToken = asyncErrorHandler(
  async (req, res, next) => {
    const cookies = req.cookies;
    if (!req.cookies?.jwt) return res.sendStatus(401);
    const refreshToken = req.cookies.jwt;
    const user = await User.findOne({ refreshToken });
    // console.log("===============", user);
    if (!user) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err || user._id.toString() !== decoded.id) {
        const error = new CustomError(
          `either token is tampered or it got expired please login ${err}`,
          403
        );
        return next(error);
        // return res.status(403).json({
        //   status: "failed",
        //   msg: `either token is tampered or it got expired please login ${err}`,
        //   data: null,
        // });
      }
      const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
        expiresIn: "1m",
      });
      return res.status(201).json({
        status: "sucess",
        data: accessToken,
        msg: "token created successfully",
      });
    });
  }
);

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  //get the user based on post email
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    const error = new CustomError("user cannot found", 404);
    return next(error);
  }

  //generate a random rest token
  const resetToken = await user.createResetPasswordToken();
  await user.save({
    validateBeforeSave: false,
  });

  //sendtoken back to the user  email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetPassword/${resetToken}`;
  const message = `we have received a password rest text please refer the below lin \n\n ${resetUrl}\n\n this reset password link is valid for 10 minutes`;
  try {
    await sendEmail({
      email: user.email,
      subject: "password change request",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "password link is send to email",
    });
  } catch (error) {
    user.passwordRestToken = undefined;
    user.passwordResetTokenExpire = undefined;
    user.save({ validateBeforeSave: false });
    return next(new CustomError(error, 500));
  }
});

exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  const token = req.params.token;
  const passwordRestToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordRestToken,
    passwordRestTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    const error = new CustomError("Token has been expired", 400);
    return next(error);
  }
  const hashedPwd = await bcrypt.hash(req.body.password, 10);
  user.password = hashedPwd;
  user.passwordRestTokenExpires = undefined;
  user.passwordRestToken = undefined;
  const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
    expiresIn: "1m",
  });
  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
    expiresIn: "1d",
  });
  user.refreshToken = refreshToken;
  await user.save();
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.status(201).json({
    status: "sucess",
    data: accessToken,
    msg: "password reset successfull",
  });
});

exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  console.log(req.user);
  const user = await User.findOne({ _id: req.user }).select("+password");
  console.log(user);
  const matchedPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  console.log(matchedPassword);
  if (!matchedPassword) {
    const error = new CustomError("password doesnt match", 401);
    return next(error);
  }
  const hashedPwd = await bcrypt.hash(req.body.newPassword, 10);
  user.password = hashedPwd;
  await user.save();
  return res.status(200).json({
    status: "sucess",
    msg: "password updated successfully",
  });
});

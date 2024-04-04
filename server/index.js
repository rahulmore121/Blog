const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "./env" });
const authrouter = require("./routes/auth.route.js");
const postRouter = require("./routes/post.auth.js");
const { connectDb } = require("./models/connection.js");
const cookieParser = require("cookie-parser");
const CustomError = require("./utils/CustomError.js");

const app = express();
app.use(express.json());

const whiteList = ["http://localhost:5173", "http://127.0.0.1:5173"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by Origin"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   console.log(origin);
//   if (whiteList.includes(origin)) {
//     res.headers("Access-Control-Allow-Credentials", true);
//     res.headers("Access-Control-Allow-Origin", "*");
//   }
//   next();
// });

app.use(cors(corsOptions));
// app.use(cors());
app.use(cookieParser());

const port = process.env.PORT || 3000;
app.use("/api/v1/auth", authrouter);
app.use("/api/v1/post", postRouter);

app.all("*", (req, res, next) => {
  const error = new CustomError("no path found", 404);
  return next(error);
  // res.status(404).json({ status: "error", data: null, msg: "no path found" });
  // throw new Error("no path found");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const error = new CustomError(err.message, statusCode);
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stackTrace: error.stack,
    error,
  });
});

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`DB connected and Server is running on the port ${port}`);
  });
});

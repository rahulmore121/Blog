const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  try {
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader && !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "failed",
        msg: "Invalid token",
        data: null,
      });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) return res.sendStatus(403); //invalid
      req.user = decoded.id;
      next();
    });
  } catch (error) {
    res.status(500).json({ status: "error", data: null, msg: error.message });
  }
};

import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // อ่าน JWT จาก Cookie
    const token = req.cookies.auth_token;

    // ไม่มี Cookie
    if (!token) {
      return res.status(401).json({
        message: "กรุณาเข้าสู่ระบบก่อน",
      });
    }

    // ตรวจ JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // เก็บข้อมูล user ไว้ใน request
    req.user = decoded;

    // ผ่าน
    next();

  } catch (error) {
    console.error("Auth middleware error:", error.message);

    return res.status(401).json({
      message: "Session หมดอายุหรือไม่ถูกต้อง",
    });
  }
};

export default authMiddleware;
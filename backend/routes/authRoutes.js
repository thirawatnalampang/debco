import express from "express";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // ตรวจข้อมูล
    if (!username || !password) {
      return res.status(400).json({
        message: "กรุณากรอกรหัสพนักงานและรหัสผ่าน",
      });
    }

    // ค้นหาผู้ใช้
    const result = await pool.query(
      `
      SELECT
        id,
        username,
        password,
        full_name,
        phone,
        role
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    // ไม่พบ user
    if (result.rowCount === 0) {
      return res.status(401).json({
        message: "รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    const user = result.rows[0];

    // ตรวจ password
    // หมายเหตุ: ตอนนี้ยังใช้ plaintext ตาม DB เดิมของมึง
    if (password !== user.password) {
      return res.status(401).json({
        message: "รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    // =====================================================
    // CREATE JWT
    // =====================================================

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // =====================================================
    // SET HTTPONLY COOKIE
    // =====================================================

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.json({
      message: "เข้าสู่ระบบสำเร็จ",

      user: {
  user_id: user.id,
  username: user.username,
  full_name: user.full_name,
  phone: user.phone,
  role: user.role,
},
    });

  } catch (error) {
    console.error("POST /api/auth/login error:", error);

    return res.status(500).json({
      message: "เข้าสู่ระบบไม่สำเร็จ",
    });
  }
});

// =====================================================
// LOGOUT
// POST /api/auth/logout
// =====================================================

router.post("/logout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({
    message: "ออกจากระบบสำเร็จ",
  });
});
// =====================================================
// GET CURRENT USER
// GET /api/auth/me
// =====================================================

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({
        message: "กรุณาเข้าสู่ระบบก่อน",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const result = await pool.query(
      `
      SELECT
        id,
        username,
        full_name,
        phone,
        role
      FROM users
      WHERE id = $1
      `,
      [decoded.id]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        message: "ไม่พบผู้ใช้งาน",
      });
    }

   return res.json({
  user: {
    user_id: result.rows[0].id,
    username: result.rows[0].username,
    full_name: result.rows[0].full_name,
    phone: result.rows[0].phone,
    role: result.rows[0].role,
  },
});

  } catch (error) {
    console.error("GET /api/auth/me error:", error);

    return res.status(401).json({
      message: "Session หมดอายุหรือไม่ถูกต้อง",
    });
  }
});
export default router;
import express from "express";
import pool from "../db.js";

const router = express.Router();

// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({
        error: "กรุณากรอกรหัสพนักงานและรหัสผ่าน",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        username,
        password,
        full_name,
        role
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        error: "รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    const user = result.rows[0];

    // เช็ก password ตรง ๆ ก่อน
    if (password !== user.password) {
      return res.status(401).json({
        error: "รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    res.json({
      message: "เข้าสู่ระบบสำเร็จ",

      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
      },
    });

  } catch (error) {

    console.error(
      "POST /api/auth/login error:",
      error
    );

    res.status(500).json({
      error: "เข้าสู่ระบบไม่สำเร็จ",
    });
  }
});

export default router;
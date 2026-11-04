
import express from "express";
import pool from "../db.js";

const router = express.Router();

// =====================================================
// GET CUSTOMER BY ACCOUNT NUMBER
// GET /api/tasks/lookup?accountNo=0000553353
// =====================================================
router.get("/lookup", async (req, res) => {
  try {
    const accountNo = String(req.query.accountNo || "").trim();

    if (!accountNo) {
      return res.status(400).json({
        message: "กรุณาระบุเลขที่บัญชี",
      });
    }

    const result = await pool.query(
      `SELECT id, cust_no, name
       FROM customers
       WHERE cust_no = $1
       LIMIT 1`,
      [accountNo]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        message: "ไม่พบเลขที่บัญชีนี้ในระบบ",
      });
    }

    return res.json({
      customer: result.rows[0],
    });
  } catch (error) {
    console.error("Lookup customer error:", error);

    return res.status(500).json({
      message: "ค้นหาข้อมูลลูกค้าไม่สำเร็จ",
      error: error.message,
    });
  }
});

// =====================================================
// GET ALL COLLECTION TASKS
// GET /api/tasks?status=Pending&date=2026-10-21
// =====================================================
router.get("/", async (req, res) => {
  try {
    const { status, date } = req.query;
    const values = [];
    const conditions = [];

    if (status) {
      values.push(status);
      conditions.push(`t.status = $${values.length}`);
    }

    if (date) {
      values.push(date);
      conditions.push(`t.due_date = $${values.length}`);
    }

    const where = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const result = await pool.query(
      `
      SELECT
        t.id,
        t.customer_id,
        t.task_type,
        t.target_amount,
        t.due_date,
        t.priority,
        t.description,
        t.status,
        t.created_at,
        t.updated_at,

        c.cust_no,
        c.name AS customer_name,

        COALESCE(ab.os_bal, 0) AS os_bal,
        COALESCE(ab.ovd_amt, 0) AS ovd_amt,

        COALESCE(
          (
            SELECT json_agg(p ORDER BY p.created_at DESC)
            FROM payment_promises p
            WHERE p.task_id = t.id
          ),
          '[]'::json
        ) AS promises

      FROM collection_tasks t

      JOIN customers c
        ON c.id = t.customer_id

      LEFT JOIN LATERAL (
        SELECT os_bal, ovd_amt
        FROM account_balances
        WHERE cust_no = c.cust_no
        LIMIT 1
      ) ab ON TRUE

      ${where}

      ORDER BY t.due_date ASC, t.created_at DESC
      `,
      values
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      message: "โหลดรายการงานไม่สำเร็จ",
      error: error.message,
    });
  }
});

// =====================================================
// CREATE COLLECTION TASK
// POST /api/tasks
// =====================================================
router.post("/", async (req, res) => {
  try {
    const {
      accountNo,
      taskType = "Phone",
      targetAmount = 0,
      dueDate,
      priority = "Medium",
      description = "",
    } = req.body;

    const normalizedAccountNo = String(accountNo || "").trim();

    if (!normalizedAccountNo || !dueDate) {
      return res.status(400).json({
        message: "กรุณาระบุเลขที่บัญชีและวันนัดติดตาม",
      });
    }

    const amount = Number(targetAmount);

    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({
        message: "ยอดเงินเป้าหมายไม่ถูกต้อง",
      });
    }

    if (!["Low", "Medium", "High"].includes(priority)) {
      return res.status(400).json({
        message: "ระดับความสำคัญไม่ถูกต้อง",
      });
    }

    if (!["Phone", "Mobile", "Home", "Office"].includes(taskType)) {
      return res.status(400).json({
        message: "ประเภทงานไม่ถูกต้อง",
      });
    }

    const customerResult = await pool.query(
      `SELECT id, cust_no, name
       FROM customers
       WHERE cust_no = $1
       LIMIT 1`,
      [normalizedAccountNo]
    );

    if (!customerResult.rowCount) {
      return res.status(404).json({
        message: "ไม่พบเลขที่บัญชีนี้ในระบบ",
      });
    }

    const customer = customerResult.rows[0];

    const result = await pool.query(
      `
      INSERT INTO collection_tasks (
        customer_id,
        task_type,
        target_amount,
        due_date,
        priority,
        description
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        customer.id,
        taskType,
        amount,
        dueDate,
        priority,
        String(description || "").trim() || null,
      ]
    );

    return res.status(201).json({
      message: "สร้างงานติดตามสำเร็จ",
      task: {
        ...result.rows[0],
        cust_no: customer.cust_no,
        customer_name: customer.name,
      },
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      message: "สร้างงานติดตามไม่สำเร็จ",
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE TASK STATUS
// PATCH /api/tasks/:id/status
// =====================================================
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "สถานะงานไม่ถูกต้อง",
      });
    }

    const result = await pool.query(
      `
      UPDATE collection_tasks
      SET status = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [status, req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        message: "ไม่พบงานติดตามนี้",
      });
    }

    return res.json({
      message: "อัปเดตสถานะสำเร็จ",
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Update task status error:", error);

    return res.status(500).json({
      message: "อัปเดตสถานะไม่สำเร็จ",
      error: error.message,
    });
  }
});

// =====================================================
// ADD PAYMENT PROMISE
// POST /api/tasks/:id/promises
// =====================================================
router.post("/:id/promises", async (req, res) => {
  try {
    const {
      promisedAmount,
      promisedDate,
      note = "",
    } = req.body;

    const amount = Number(promisedAmount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !promisedDate
    ) {
      return res.status(400).json({
        message: "กรุณาระบุยอดเงินและวันที่ลูกค้ารับปากว่าจะจ่าย",
      });
    }

    const taskResult = await pool.query(
      `SELECT id
       FROM collection_tasks
       WHERE id = $1`,
      [req.params.id]
    );

    if (!taskResult.rowCount) {
      return res.status(404).json({
        message: "ไม่พบงานติดตามนี้",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO payment_promises (
        task_id,
        promised_amount,
        promised_date,
        note
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        req.params.id,
        amount,
        promisedDate,
        String(note || "").trim() || null,
      ]
    );

    return res.status(201).json({
      message: "บันทึกยอดรับปากชำระสำเร็จ",
      promise: result.rows[0],
    });
  } catch (error) {
    console.error("Create payment promise error:", error);

    return res.status(500).json({
      message: "บันทึกยอดรับปากไม่สำเร็จ",
      error: error.message,
    });
  }
});

export default router;

import express from "express";
import pool from "../db.js";

const router = express.Router();

// =====================================================
// GET ALL ACCOUNTS
// =====================================================
// =====================================================
// GET ALL ACCOUNTS
// =====================================================
// =====================================================
// GET ALL ACCOUNTS
// =====================================================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.cust_no,
        c.name,
        c.acct_mark,
        c.status,

        ab.os_bal,
        ab.prin_bal,
        ab.os_bal_cust,
        ab.ovd_amt,

        ad.status_flag,
        ad.dpd,
        ad.max_bucket,
        ad.bucket,

        pi.due_date,
        pi.debtor_type

      FROM customers c

      LEFT JOIN account_balances ab
        ON ab.customer_id = c.id

      LEFT JOIN account_details ad
        ON ad.customer_id = c.id

      LEFT JOIN LATERAL (
        SELECT
          pi.due_date,
          pi.debtor_type
        FROM payment_info pi
        WHERE pi.customer_id = c.id
        ORDER BY
          pi.due_date DESC NULLS LAST,
          pi.id DESC
        LIMIT 1
      ) pi ON true

      ORDER BY c.id ASC
    `);

    res.json({
      accounts: result.rows,
    });

  } catch (error) {

    console.error(
      "GET /api/accounts error:",
      error
    );

    res.status(500).json({
      error: "ไม่สามารถโหลดข้อมูล Accounts ได้",
    });
  }
});
// =====================================================
// GET FULL ACCOUNT BY CUSTOMER NO
// =====================================================

router.get("/:custNo", async (req, res) => {

  const { custNo } = req.params;

  try {

    const customerResult = await pool.query(
      `
      SELECT *
      FROM customers
      WHERE cust_no = $1
      `,
      [custNo]
    );

    if (customerResult.rowCount === 0) {

      return res.status(404).json({
        error: "Customer not found",
      });

    }

    const customer =
      customerResult.rows[0];


    const [
      phones,
      balances,
      details,
      payment,
      notes,
    ] = await Promise.all([

      pool.query(
        `
        SELECT label, number
        FROM customer_phones
        WHERE customer_id = $1
        `,
        [customer.id]
      ),

      pool.query(
        `
        SELECT *
        FROM account_balances
        WHERE customer_id = $1
        `,
        [customer.id]
      ),

      pool.query(
        `
        SELECT *
        FROM account_details
        WHERE customer_id = $1
        `,
        [customer.id]
      ),

      pool.query(
        `
        SELECT *
        FROM payment_info
        WHERE customer_id = $1
        `,
        [customer.id]
      ),

      pool.query(
        `
        SELECT *
        FROM collection_notes
        WHERE customer_id = $1
        ORDER BY created_at DESC
        `,
        [customer.id]
      ),

    ]);


    res.json({

      customer,

      phones: phones.rows,

      balances:
        balances.rows[0] || null,

      details:
        details.rows[0] || null,

      payment:
        payment.rows[0] || null,

      notes:
        notes.rows,

    });

  } catch (error) {

    console.error(
      "GET /api/accounts/:custNo error:",
      error
    );

    res.status(500).json({
      error: "Server error",
    });

  }

});
// =====================================================
// PATCH PAYMENT INFO
// PATCH /api/accounts/:custNo/payment
// =====================================================

router.patch("/:custNo/payment", async (req, res) => {

  const { custNo } = req.params;

  const {
    call_result,
    due_date,
    due_amount,
    forecast_pct,
    debtor_type,
    contact_date,
    last_phone,
    status_tag,
  } = req.body;

  try {

    // =================================================
    // FIND CUSTOMER
    // =================================================

    const customerResult = await pool.query(
      `
      SELECT id
      FROM customers
      WHERE cust_no = $1
      `,
      [custNo]
    );

    if (customerResult.rowCount === 0) {

      return res.status(404).json({
        error: "Customer not found",
      });

    }

    const customerId =
      customerResult.rows[0].id;


    // =================================================
    // UPDATE PAYMENT INFO
    // =================================================

    const result = await pool.query(
      `
      UPDATE payment_info
      SET
        call_result = $1,
        due_date = $2,
        due_amount = $3,
        forecast_pct = $4,
        debtor_type = $5,
        contact_date = $6,
        last_phone = $7,
        status_tag = $8

      WHERE customer_id = $9

      RETURNING *
      `,
      [
        call_result,
        due_date || null,
        due_amount || null,
        forecast_pct || null,
        debtor_type || null,
        contact_date || null,
        last_phone || null,
        status_tag || null,
        customerId,
      ]
    );


    // =================================================
    // PAYMENT INFO ไม่มี
    // =================================================

    if (result.rowCount === 0) {

      return res.status(404).json({
        error: "Payment info not found",
      });

    }


    // =================================================
    // SUCCESS
    // =================================================

    res.json(result.rows[0]);

  } catch (error) {

    console.error(
      "PATCH /api/accounts/:custNo/payment error:",
      error
    );

    res.status(500).json({
      error: "แก้ไขข้อมูลการชำระไม่สำเร็จ",
      message: error.message,
    });

  }

});
// =====================================================
// ADD COLLECTION NOTE
// POST /api/accounts/:custNo/notes
// =====================================================

router.post("/:custNo/notes", async (req, res) => {

  const { custNo } = req.params;

  const {
    action_code,
    note_type,
    telephone,
    note,
    created_at,
  } = req.body;

  try {

    // =================================================
    // FIND CUSTOMER
    // =================================================

    const customerResult = await pool.query(
      `
      SELECT id
      FROM customers
      WHERE cust_no = $1
      `,
      [custNo]
    );

    if (customerResult.rowCount === 0) {

      return res.status(404).json({
        error: "Customer not found",
      });

    }

    const customerId =
      customerResult.rows[0].id;


    // =================================================
    // INSERT COLLECTION NOTE
    // =================================================

    const result = await pool.query(
      `
      INSERT INTO collection_notes (
        customer_id,
        action_code,
        note_type,
        telephone,
        note,
        created_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
      RETURNING *
      `,
      [
        customerId,
        action_code || null,
        note_type || null,
        telephone || null,
        note || null,
        created_at || new Date(),
      ]
    );


    // =================================================
    // SUCCESS
    // =================================================

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(
      "POST /api/accounts/:custNo/notes error:",
      error
    );

    res.status(500).json({
      error: "เพิ่ม Collection Note ไม่สำเร็จ",
      message: error.message,
    });

  }

});
// =====================================================
// DELETE COLLECTION NOTE
// DELETE /api/accounts/notes/:noteId
// =====================================================

router.delete("/notes/:noteId", async (req, res) => {
  const { noteId } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM collection_notes
      WHERE id = $1
      RETURNING *
      `,
      [noteId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "ไม่พบ Collection Note",
      });
    }

    res.json({
      message: "ลบ Collection Note สำเร็จ",
      note: result.rows[0],
    });

  } catch (error) {

    console.error(
      "DELETE /api/accounts/notes/:noteId error:",
      error
    );

    res.status(500).json({
      error: "ลบ Collection Note ไม่สำเร็จ",
      message: error.message,
    });

  }
});
export default router;
import express from 'express';
import pool from '../db.js';

const router = express.Router();

// =====================================================
// ADD COLLECTION NOTE
// POST /api/notes/accounts/:custNo
// =====================================================

router.post('/accounts/:custNo', async (req, res) => {
  try {
    const { custNo } = req.params;

    const {
      action_code,
      note_type,
      telephone,
      note,
      created_at,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO collection_notes (
        cust_no,
        action_code,
        note_type,
        telephone,
        note,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        custNo,
        action_code,
        note_type,
        telephone,
        note,
        created_at || new Date(),
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(
      '❌ Add Collection Note Error:',
      error
    );

    res.status(500).json({
      message: 'เพิ่ม Collection Note ไม่สำเร็จ',
      error: error.message,
    });
  }
});
// =====================================================
// GET COLLECTION NOTES
// GET /api/notes/accounts/:custNo
// =====================================================

router.get('/accounts/:custNo', async (req, res) => {
  try {
    const { custNo } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM collection_notes
      WHERE cust_no = $1
      ORDER BY created_at DESC
      `,
      [custNo]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(
      '❌ Get Collection Notes Error:',
      error
    );

    res.status(500).json({
      message: 'โหลด Collection Notes ไม่สำเร็จ',
      error: error.message,
    });
  }
});
// =====================================================
// UPDATE COLLECTION NOTE
// PATCH /api/notes/:id
// =====================================================

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      action_code,
      note_type,
      telephone,
      note,
      created_at,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE collection_notes
      SET
        action_code = $1,
        note_type = $2,
        telephone = $3,
        note = $4,
        created_at = $5
      WHERE id = $6
      RETURNING *
      `,
      [
        action_code,
        note_type,
        telephone,
        note,
        created_at,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'ไม่พบ Collection Note',
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(
      '❌ Update Collection Note Error:',
      error
    );

    res.status(500).json({
      message: 'แก้ไข Collection Note ไม่สำเร็จ',
      error: error.message,
    });
  }
});

export default router;
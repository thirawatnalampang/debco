import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchAccount,
  addNote,
  updateNote,
  deleteNote,
  updatePayment,
} from "../api";
import Sidebar from "../components/Sidebar";
// =====================================================
// FORMAT
// =====================================================

const fmt = (n) =>
  n == null
    ? "—"
    : Number(n).toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("th-TH") : "—";

// =====================================================
// SIDEBAR
// =====================================================


// =====================================================
// CUSTOMER INFO
// =====================================================

function CustomerInfo({ customer, phones, address }) {
  return (
    <div className="panel">
      <h4>Customer Information</h4>

      <div className="info-grid">

        <div>
          <div className="field-label">NAME</div>
          <div className="field-value">
            {customer.name}
          </div>
        </div>

        <div>
          <div className="field-label">IDCard</div>
          <div className="field-value">
            {customer.id_card}
          </div>
        </div>

        <div>
          <div className="field-label">BirthDate</div>
          <div className="field-value">
            {fmtDate(customer.birth_date)}
          </div>
        </div>

        <div>
          <div className="field-label">Occupation</div>
          <div className="field-value">
            {customer.occupation}
          </div>
        </div>

        <div>
          <div className="field-label">Position</div>
          <div className="field-value">
            {customer.position}
          </div>
        </div>

      </div>

      <div className="contact-grid">

        {phones.map((p) => (
          <div
            className="contact-item"
            key={p.label}
          >
            <div className="lbl">
              {p.label}
            </div>

            <div className="val">
              {p.number}
            </div>
          </div>
        ))}

      </div>

      <div className="address-row">
        📍 {address}
      </div>
    </div>
  );
}

// =====================================================
// BALANCES
// =====================================================

function Balances({ balances, acctMark }) {
  if (!balances) return null;

  return (
    <div className="panel">

      <h4>Account Balances</h4>

      <div className="table-wrap">

        <table className="balances-table">

          <thead>
            <tr>
              <th>ACCTMark</th>
              <th>PrinBal</th>
              <th>OSbal</th>
              <th>OSbalCust</th>
              <th>OVDamt</th>
            </tr>
          </thead>

          <tbody>
            <tr>

              <td>
                ▷ {acctMark}
              </td>

              <td>
                {fmt(balances.prin_bal)}
              </td>

              <td>
                {fmt(balances.os_bal)}
              </td>

              <td>
                {fmt(balances.os_bal_cust)}
              </td>

              <td className="accent">
                {fmt(balances.ovd_amt)}
              </td>

            </tr>
          </tbody>

        </table>

      </div>
    </div>
  );
}

// =====================================================
// ACCOUNT DETAILS
// =====================================================

function AccountDetails({
  d,
  custNo,
  acctMark,
  name,
}) {
  if (!d) return null;

  const col1 = [
    ["OA_Name", d.oa_name],
    ["AssignDate", fmtDate(d.assign_date)],
    ["GRPDebt", d.grp_debt],
    ["OA_ID", d.oa_id],
    ["Cusno", custNo],
    ["ACCTMark", acctMark],
    ["OSBalCust", fmt(d.os_bal_cust)],
    ["NAME", name],
    ["Paycondition", fmt(d.paycondition)],
    ["ProdDebt", d.prod_debt],
    ["PrinBal", fmt(d.prin_bal)],
    ["OSBal", fmt(d.os_bal)],
  ];

  const col2 = [
    ["MemoAccr", d.memo_accr],
    ["OVDamt", fmt(d.ovd_amt)],
    ["DPD", d.dpd],
    ["Cycle", d.cycle],
    ["Block", d.block],
    ["LstPrchDT", fmtDate(d.lst_prch_dt)],
    ["MaxBucket", d.max_bucket],
    ["Bucket", d.bucket],
    ["LstCshAdvDT", fmtDate(d.lst_cshadv_dt)],
    ["LstPayDate", fmtDate(d.lst_pay_date)],
    ["LstPayAmt", fmt(d.lst_pay_amt)],
    [
      "Start Lead Group",
      fmtDate(d.start_lead_group),
    ],
  ];

  const col3 = [
    ["OpenDate", fmtDate(d.open_date)],
    ["Queue", d.queue],
    ["Round", d.round],
    ["LECgroup", d.le_group],
    [
      "MaxBucketDate",
      fmtDate(d.max_bucket_date),
    ],
    ["BucketDate", fmtDate(d.bucket_date)],
    ["TDRDate", fmtDate(d.tdr_date)],
    ["FileDate", fmtDate(d.file_date)],
    ["StatusFlag", d.status_flag],
    ["OlimitAMT", d.olimit_amt],
    ["INSTAMT", fmt(d.instamt)],
    [
      "End Lead Group",
      fmtDate(d.end_lead_group),
    ],
  ];

  const col4 = [
    ["Remark", d.remark],
    ["CRLimit", fmt(d.cr_limit)],
    ["chkหมาย", d.chk_number],
    ["AO", d.ao],
    ["FlagStaff", d.flag_staff],
    ["StrategyCode", d.strategy_code],
    ["TDRCode", d.tdr_code],
    ["GRP_N", d.grp_n],
    ["Type_DebtRe", d.type_debtre],
    ["BF_EffRate", d.bt_eff_rate],
    ["Lead Group", d.lead_group],
    ["รหัสยุทธศาสตร์", d.strategy_npl],
    ["PRODDESC", d.prod_desc],
    ["IntNotpost", d.int_notpod],
  ];

  const cols = [col1, col2, col3, col4];

  return (
    <div className="panel">

      <h4>Account Details</h4>

      <div className="account-details-grid">

        {cols.map((col, ci) => (
          <div
            className="ad-col"
            key={ci}
          >

            {col.map(([label, val]) => (
              <div
                className="ad-row"
                key={label}
              >

                <div className="field-label">
                  {label}:
                </div>

                <div className="field-value">
                  {val === null ||
                  val === undefined ||
                  val === ""
                    ? "—"
                    : val}
                </div>

              </div>
            ))}

          </div>
        ))}

      </div>
    </div>
  );
}
// =====================================================
// COLLECTION NOTES
// =====================================================

function CollectionNotes({ notes, onAdd, onUpdate, onDelete }) {
  const [draft, setDraft] = useState({
  action_code_1: "",
  action_code_2: "",
  note_type: "Mobile",
  telephone: "",
  note: "",
  created_at: "",
});

  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // ===================================================
  // PARSE ACTION CODE
  // ===================================================

  const parseActionCode = (value) => {
    if (!value) {
      return {
        first: "",
        second: "",
      };
    }

    const parts = value
      .split("|")
      .map((x) => x.trim());

    return {
      first: parts[0] || "",
      second: parts[1] || "",
    };
  };

  // ===================================================
  // FORMAT DATETIME FOR INPUT
  // ===================================================

  const toDateTimeLocal = (value) => {
    if (!value) return "";

    const d = new Date(value);

    if (Number.isNaN(d.getTime())) return "";

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  // ===================================================
  // START EDIT
  // ===================================================

  const startEdit = (n) => {
    const action = parseActionCode(n.action_code);

    setEditingId(n.id);

    setEditData({
      action_code_1: action.first,
      action_code_2: action.second,
      note_type: n.note_type || "Mobile",
      telephone: n.telephone || "",
      note: n.note || "",
      created_at: toDateTimeLocal(n.created_at),
    });
  };

  // ===================================================
  // CANCEL EDIT
  // ===================================================

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };
const handleDelete = async (noteId) => {
  try {
    setSaving(true);

    await onDelete(noteId);

    // ถ้ากำลังแก้รายการนี้อยู่ ให้ยกเลิก edit
    if (editingId === noteId) {
      setEditingId(null);
      setEditData({});
    }

  } catch (error) {
    alert(
      error.message || "ลบข้อมูลไม่สำเร็จ"
    );
  } finally {
    setSaving(false);
  }
};
  // ===================================================
  // UPDATE OLD NOTE
  // ===================================================

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      setSaving(true);

      const actionCode = editData.action_code_1
        ? `${editData.action_code_1}${
            editData.action_code_2
              ? ` | ${editData.action_code_2}`
              : ""
          }`
        : editData.action_code_2;

      await onUpdate(editingId, {
        action_code: actionCode,
        note_type: editData.note_type,
        telephone: editData.telephone,
        note: editData.note,
        created_at: editData.created_at,
      });

      setEditingId(null);
      setEditData({});
    } catch (error) {
      alert(error.message || "แก้ไขข้อมูลไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // ADD NEW NOTE
  // ===================================================

  const submit = async () => {
    if (!draft.note.trim()) {
      alert("กรุณากรอก Collection Note");
      return;
    }

    try {
      setSaving(true);

      await onAdd({
  action_code: draft.action_code_1
    ? `${draft.action_code_1}${
        draft.action_code_2
          ? ` | ${draft.action_code_2}`
          : ""
      }`
    : draft.action_code_2,

  note_type: draft.note_type,
  telephone: draft.telephone,
  note: draft.note,

  created_at: draft.created_at,
});

    setDraft({
  action_code_1: "",
  action_code_2: "",
  note_type: "Mobile",
  telephone: "",
  note: "",
  created_at: "",
});
    } catch (error) {
      alert(error.message || "เพิ่มข้อมูลไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tabs-panel">

      {/* =================================================
          TABS
      ================================================= */}

      <div className="tabs-header">
        <div className="tabs-list">

          <div className="tab-link active">
            Collection_Note
          </div>

          <div className="tab-link">
            ByBucket
          </div>

          <div className="tab-link">
            Stickynote
          </div>

          <div className="tab-link">
            TDR-operation-phone
          </div>

        </div>
      </div>


      {/* =================================================
          TABLE
      ================================================= */}

      <div className="table-wrap">

        <table className="note-table">

          <thead>
            <tr>

              <th>
                DateTime
              </th>

              <th>
                Action_Code
              </th>

              <th>
                Telephone number
              </th>

              <th>
                Collection_Note
              </th>

              <th>
                จัดการ
              </th>

            </tr>
          </thead>


          <tbody>

            {/* =================================================
                OLD DATA
            ================================================= */}

            {notes.map((n) => {

              const isEditing =
                editingId === n.id;

              const action =
                parseActionCode(n.action_code);

              return (
                <tr key={n.id}>

                {/* =================================================
    DATE TIME
================================================= */}

<td>

  {isEditing ? (

    <input
      type="datetime-local"
      className="edit-date-input"
      value={editData.created_at || ""}
      onChange={(e) =>
        setEditData({
          ...editData,
          created_at: e.target.value,
        })
      }
      onClick={(e) => {
        if (e.target.showPicker) {
          e.target.showPicker();
        }
      }}
    />

  ) : (

   <span
  className="editable-cell"
  onClick={() => startEdit(n)}
>
  {new Date(
    n.created_at
  ).toLocaleString("th-TH")}
</span>

  )}

</td>

                  {/* =================================================
                      ACTION CODE
                  ================================================= */}

                  <td>

                    {isEditing ? (

                      <div className="action-code-group">

                        <select
                          value={
                            editData.action_code_1
                          }
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              action_code_1:
                                e.target.value,
                            })
                          }
                        >

                          <option value="">
                            —
                          </option>

                          <option value="NOA">
                            NOA
                          </option>

                          <option value="OC">
                            OC
                          </option>

                        </select>


                        <select
                          value={
                            editData.action_code_2
                          }
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              action_code_2:
                                e.target.value,
                            })
                          }
                        >

                          <option value="">
                            —
                          </option>

                          <option value="OC">
                            OC
                          </option>

                          <option value="NOA">
                            NOA
                          </option>

                        </select>

                      </div>

                    ) : (

                      <div className="action-code-group">

                        <select
                          value={action.first}
                          onChange={(e) => {
                            startEdit(n);

                            setEditData((prev) => ({
                              ...prev,
                              action_code_1:
                                e.target.value,
                              action_code_2:
                                action.second,
                            }));
                          }}
                        >

                          <option value="">
                            —
                          </option>

                          <option value="NOA">
                            NOA
                          </option>

                          <option value="OC">
                            OC
                          </option>

                        </select>


                        <select
                          value={action.second}
                          onChange={(e) => {
                            startEdit(n);

                            setEditData((prev) => ({
                              ...prev,
                              action_code_1:
                                action.first,
                              action_code_2:
                                e.target.value,
                            }));
                          }}
                        >

                          <option value="">
                            —
                          </option>

                          <option value="OC">
                            OC
                          </option>

                          <option value="NOA">
                            NOA
                          </option>

                        </select>

                      </div>

                    )}

                  </td>


                  {/* =================================================
                      TELEPHONE
                  ================================================= */}

                  <td>

                    {isEditing ? (

                      <div className="telephone-group">

                        <select
                          value={
                            editData.note_type ||
                            "Mobile"
                          }
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              note_type:
                                e.target.value,
                            })
                          }
                        >

                          <option value="Mobile">
                            Mobile
                          </option>

                          <option value="Phone">
                            Phone
                          </option>

                          <option value="Home">
                            Home
                          </option>

                          <option value="Office">
                            Office
                          </option>

                        </select>


                        <input
                          value={
                            editData.telephone
                          }
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              telephone:
                                e.target.value,
                            })
                          }
                        />

                      </div>

                    ) : (

                      <div className="telephone-group">

                        <select
                          value={
                            n.note_type ||
                            "Mobile"
                          }
                          onChange={(e) => {
                            startEdit(n);

                            setEditData((prev) => ({
                              ...prev,
                              note_type:
                                e.target.value,
                            }));
                          }}
                        >

                          <option value="Mobile">
                            Mobile
                          </option>

                          <option value="Phone">
                            Phone
                          </option>

                          <option value="Home">
                            Home
                          </option>

                          <option value="Office">
                            Office
                          </option>

                        </select>


                        <input
                          value={
                            n.telephone || ""
                          }
                          onChange={(e) => {
                            startEdit(n);

                            setEditData((prev) => ({
                              ...prev,
                              telephone:
                                e.target.value,
                            }));
                          }}
                        />

                      </div>

                    )}

                  </td>


                  {/* =================================================
                      COLLECTION NOTE
                  ================================================= */}

                  <td>

                    {isEditing ? (

                      <input
                        className="note-edit-input"
                        value={
                          editData.note || ""
                        }
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            note: e.target.value,
                          })
                        }
                      />

                    ) : (

                      <input
                        className="note-view-input"
                        value={n.note || ""}
                        readOnly
                        onDoubleClick={() =>
                          startEdit(n)
                        }
                      />

                    )}

                  </td>


                  {/* =================================================
                      ACTION BUTTON
                  ================================================= */}
{/* =================================================
    ACTION BUTTON
================================================= */}

<td>
  {isEditing ? (
    <div className="edit-actions">

      <button
        type="button"
        className="save-note-btn"
        disabled={saving}
        onClick={saveEdit}
      >
        {saving ? "กำลังบันทึก..." : "บันทึก"}
      </button>

      <button
        type="button"
        className="cancel-note-btn"
        disabled={saving}
        onClick={cancelEdit}
      >
        ยกเลิก
      </button>

      <button
        type="button"
        className="delete-note-btn"
        disabled={saving}
        onClick={() => handleDelete(n.id)}
      >
        ลบ
      </button>

    </div>
  ) : (
    <div className="note-actions">

      <button
        type="button"
        className="edit-note-btn"
        onClick={() => startEdit(n)}
      >
        แก้ไข
      </button>

      <button
        type="button"
        className="delete-note-btn"
        onClick={() => handleDelete(n.id)}
      >
        ลบ
      </button>

    </div>
  )}
</td>

                </tr>
              );
            })}


            {/* =================================================
                NEW ROW
            ================================================= */}

            <tr className="new-note-row">

              <td>
  <input
  type="datetime-local"
  className="edit-date-input"
  value={draft.created_at || ""}
  onChange={(e) =>
    setDraft({
      ...draft,
      created_at: e.target.value,
    })
  }
/>
</td>


              {/* ACTION */}

              <td>

                <div className="action-code-group">

                  <select
                    value={
                      draft.action_code_1
                    }
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        action_code_1:
                          e.target.value,
                      })
                    }
                  >

                    <option value="">
                      —
                    </option>

                    <option value="NOA">
                      NOA
                    </option>

                    <option value="OC">
                      OC
                    </option>

                  </select>


                  <select
                    value={
                      draft.action_code_2
                    }
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        action_code_2:
                          e.target.value,
                      })
                    }
                  >

                    <option value="">
                      —
                    </option>

                    <option value="OC">
                      OC
                    </option>

                    <option value="NOA">
                      NOA
                    </option>

                  </select>

                </div>

              </td>


              {/* TELEPHONE */}

              <td>

                <div className="telephone-group">

                  <select
                    value={draft.note_type}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        note_type:
                          e.target.value,
                      })
                    }
                  >

                    <option value="Mobile">
                      Mobile
                    </option>

                    <option value="Phone">
                      Phone
                    </option>

                    <option value="Home">
                      Home
                    </option>

                    <option value="Office">
                      Office
                    </option>

                  </select>


                  <input
                    value={
                      draft.telephone
                    }
                    placeholder="เบอร์โทร"
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        telephone:
                          e.target.value,
                      })
                    }
                  />

                </div>

              </td>


              {/* NOTE */}

              <td>

                <input
                  className="note-input"
                  placeholder="พิมพ์ Collection Note..."
                  value={draft.note}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      note: e.target.value,
                    })
                  }
                />

              </td>


              {/* ADD */}

              <td>

                <button
                  className="add-note-btn"
                  disabled={saving}
                  onClick={submit}
                >
                  {saving
                    ? "กำลังบันทึก..."
                    : "เพิ่ม"}
                </button>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}
// =====================================================
// PAYMENT PANEL
// =====================================================
// =====================================================
// PAYMENT PANEL
// =====================================================

function PaymentPanel({ payment, custNo, onUpdate }) {
  const [editData, setEditData] = useState({
    call_result: payment?.call_result || "",
    due_date: payment?.due_date || "",
    due_amount: payment?.due_amount || "",
    forecast_pct: payment?.forecast_pct || "",
    debtor_type: payment?.debtor_type || "",
    contact_date: payment?.contact_date || "",
    last_phone: payment?.last_phone || "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!payment) return;

    setEditData({
      call_result: payment.call_result || "",
      due_date: payment.due_date || "",
      due_amount: payment.due_amount || "",
      forecast_pct: payment.forecast_pct || "",
      debtor_type: payment.debtor_type || "",
      contact_date: payment.contact_date || "",
      last_phone: payment.last_phone || "",
    });
  }, [payment]);

  const handleChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await onUpdate(editData);

      alert("บันทึกข้อมูลการชำระสำเร็จ");
    } catch (error) {
      alert(
        error.message ||
        "บันทึกข้อมูลการชำระไม่สำเร็จ"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!payment) {
    return (
      <div className="pay-panel">
        <div className="pay-empty">
          ไม่มีข้อมูลการชำระ
        </div>
      </div>
    );
  }

  return (
    <div className="pay-panel">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="pay-header">

        <div>
          <div className="pay-title">
            ข้อมูลการชำระ
          </div>

          <div className="pay-subtitle">
            Payment Information
          </div>
        </div>

        <div className="pay-account-badge">
          {custNo}
        </div>

      </div>


      {/* =================================================
          BASIC PAYMENT INFO
      ================================================= */}

      <div className="pay-section">

        <div className="pay-section-title">
          ข้อมูลการติดตาม
        </div>

        <div className="pay-form-grid">

          {/* CALL RESULT */}

          <div className="pay-field">

            <label>
              ผลการ Call
            </label>

            <select
              value={editData.call_result}
              onChange={(e) =>
                handleChange(
                  "call_result",
                  e.target.value
                )
              }
            >
              <option value="">
                — เลือกผลการ Call —
              </option>

              <option value="ติดต่อได้">
                ติดต่อได้
              </option>

              <option value="ติดต่อไม่ได้">
                ติดต่อไม่ได้
              </option>

              <option value="ไม่รับสาย">
                ไม่รับสาย
              </option>

              <option value="ปิดเครื่อง">
                ปิดเครื่อง
              </option>
            </select>

          </div>


          {/* DEBTOR TYPE */}

          <div className="pay-field">

            <label>
              ประเภทลูกหนี้
            </label>

            <select
              value={editData.debtor_type}
              onChange={(e) =>
                handleChange(
                  "debtor_type",
                  e.target.value
                )
              }
            >
              <option value="">
                — เลือกประเภท —
              </option>

              <option value="YPN">
                YPN
              </option>

              <option value="YPL">
                YPL
              </option>

              <option value="NPL">
                NPL
              </option>

              <option value="Normal">
                Normal
              </option>

            </select>

          </div>


          {/* DUE DATE */}

          <div className="pay-field">

            <label>
              วันครบกำหนด
            </label>

            <input
              type="date"
              value={
                editData.due_date
                  ? String(
                      editData.due_date
                    ).slice(0, 10)
                  : ""
              }
              onChange={(e) =>
                handleChange(
                  "due_date",
                  e.target.value
                )
              }
            />

          </div>


          {/* DUE AMOUNT */}

          <div className="pay-field">

            <label>
              ยอดครบกำหนด
            </label>

            <div className="money-input">

              <span>฿</span>

              <input
                type="number"
                value={
                  editData.due_amount
                }
                placeholder="0.00"
                onChange={(e) =>
                  handleChange(
                    "due_amount",
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* FORECAST */}

          <div className="pay-field">

            <label>
              % Forecast
            </label>

            <select
              value={
                editData.forecast_pct
              }
              onChange={(e) =>
                handleChange(
                  "forecast_pct",
                  e.target.value
                )
              }
            >

              <option value="">
                — เลือก —
              </option>

              <option value="0">0%</option>
              <option value="10">10%</option>
              <option value="20">20%</option>
              <option value="30">30%</option>
              <option value="40">40%</option>
              <option value="50">50%</option>
              <option value="60">60%</option>
              <option value="70">70%</option>
              <option value="80">80%</option>
              <option value="90">90%</option>
              <option value="100">100%</option>

            </select>

          </div>


          {/* CONTACT DATE */}

          <div className="pay-field">

            <label>
              วันที่ติดต่อ
            </label>

            <input
              type="date"
              value={
                editData.contact_date
                  ? String(
                      editData.contact_date
                    ).slice(0, 10)
                  : ""
              }
              onChange={(e) =>
                handleChange(
                  "contact_date",
                  e.target.value
                )
              }
            />

          </div>

        </div>

      </div>


      {/* =================================================
          CONTACT RESULT
      ================================================= */}

      <div className="pay-section">

        <div className="pay-section-title">
          ผลการติดต่อ
        </div>

        <div className="action-grid">

          <button
            type="button"
            className={`action-btn maroon ${
              editData.call_result ===
              "ไม่ใช่เบอร์ลูกค้า"
                ? "selected"
                : ""
            }`}
            onClick={() =>
              handleChange(
                "call_result",
                "ไม่ใช่เบอร์ลูกค้า"
              )
            }
          >
            <span className="action-icon">
              ✕
            </span>

            <span>
              ไม่ใช่
              <br />
              เบอร์ลูกค้า
            </span>
          </button>


          <button
            type="button"
            className={`action-btn red ${
              editData.call_result ===
              "ติดต่อไม่ได้"
                ? "selected"
                : ""
            }`}
            onClick={() =>
              handleChange(
                "call_result",
                "ติดต่อไม่ได้"
              )
            }
          >
            <span className="action-icon">
              ☎
            </span>

            <span>
              ติดต่อ
              <br />
              ไม่ได้
            </span>
          </button>


          <button
            type="button"
            className={`action-btn teal-dark ${
              editData.call_result ===
              "ปิดเครื่อง"
                ? "selected"
                : ""
            }`}
            onClick={() =>
              handleChange(
                "call_result",
                "ปิดเครื่อง"
              )
            }
          >
            <span className="action-icon">
              ◉
            </span>

            <span>
              ปิดเครื่อง
            </span>
          </button>


          <button
            type="button"
            className={`action-btn amber ${
              editData.call_result ===
              "ไม่รับสาย"
                ? "selected"
                : ""
            }`}
            onClick={() =>
              handleChange(
                "call_result",
                "ไม่รับสาย"
              )
            }
          >
            <span className="action-icon">
              ☎
            </span>

            <span>
              ไม่รับ
              <br />
              สาย
            </span>
          </button>

        </div>

      </div>


      {/* =================================================
          LAST PHONE
      ================================================= */}
<div className="last-phone-box">

  <div className="last-phone-label">
    เบอร์โทรล่าสุด
  </div>

  <div className="last-phone-input-wrap">
    <span className="last-phone-icon">
      📞
    </span>

    <input
      type="text"
      className="last-phone-input"
      value={editData.last_phone || ""}
      placeholder="กรอกเบอร์โทรล่าสุด"
      onChange={(e) =>
        handleChange(
          "last_phone",
          e.target.value
        )
      }
    />
  </div>

</div>


      {/* =================================================
          SAVE
      ================================================= */}

      <button
        type="button"
        className="save-payment-btn"
        disabled={saving}
        onClick={handleSave}
      >
        {saving ? (
          <>
            <span className="save-spinner">
              ⟳
            </span>

            กำลังบันทึก...
          </>
        ) : (
          <>
            ✓
            &nbsp;
            บันทึกข้อมูลการชำระ
          </>
        )}
      </button>

    </div>
  );
}

// =====================================================
// ACCOUNT DETAIL PAGE
// =====================================================

export default function AccountDetail() {

  // รับ custNo จาก URL
  // เช่น /accounts/0000553349
  const { custNo } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // ===================================================
  // LOAD ACCOUNT
  // ===================================================

  const load = useCallback(async () => {

    try {
      setError(null);

      const d = await fetchAccount(custNo);

      setData(d);

    } catch (e) {
      setError(e.message);
    }

  }, [custNo]);

  useEffect(() => {
    load();
  }, [load]);

  // ===================================================
  // ADD NOTE
  // ===================================================

const handleAddNote = async (draft) => {
  await addNote(custNo, draft);
  await load();
};

const handleUpdateNote = async (noteId, data) => {
  await updateNote(noteId, data);
  await load();
};
const handleDeleteNote = async (noteId) => {
  const confirmed = window.confirm(
    "ต้องการลบ Collection Note นี้ใช่หรือไม่?"
  );

  if (!confirmed) return;

  await deleteNote(noteId);
  await load();
};
const handleUpdatePayment = async (data) => {
  await updatePayment(custNo, data);
  await load();
};
  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <div className="state-msg">

        <p>
          เชื่อมต่อ API ไม่ได้: {error}
        </p>

        <button
          onClick={() => navigate("/accounts")}
        >
          ← กลับ Accounts
        </button>

      </div>
    );
  }

  // ===================================================
  // LOADING
  // ===================================================

  if (!data) {
    return (
      <div className="state-msg">
        กำลังโหลดข้อมูล…
      </div>
    );
  }

  // ===================================================
  // DATA
  // ===================================================

  const {
    customer,
    phones,
    balances,
    details,
    payment,
    notes,
  } = data;

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="app">

      {/* SIDEBAR */}

      <Sidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="main">

        {/* TOPBAR */}

        <div className="topbar">

          <div className="topbar-left">

            <button
              className="hamburger"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              ☰
            </button>

            <span className="app-name">
              DebtCollect Pro
            </span>

            <span className="pill">
              Queue
            </span>

          </div>

        </div>

        {/* CONTENT */}

        <div className="content">

          {/* CASE HEADER */}

          <div className="case-header">

            <div>

              <div className="case-title">
                K-Bank PRL (ข้อมูลทั้งหมด)
              </div>

              <div className="case-meta">

                Cusno:{" "}
                <b>
                  {customer.cust_no}
                </b>

                <span className="badge-acctmark-outline">
                  ACCTMark{" "}
                  {customer.acct_mark}
                </span>

              </div>

            </div>

            <div className="case-badges">

              <span className="badge-warn">
                ⚠ NPL ลด
                {customer.npl_pct}%
              </span>

              <span className="badge-acctmark-solid">
                ACCTMark:{" "}
                {customer.acct_mark}
              </span>

            </div>

          </div>

          {/* BACK BUTTON */}

          <button
            className="back-btn"
            onClick={() =>
              navigate("/accounts")
            }
          >
            ← Back to Accounts
          </button>

          {/* MAIN GRID */}

          <div className="grid">

            <div>

              <AccountDetails
                d={{
                  ...details,
                  ...balances,
                }}
                custNo={customer.cust_no}
                acctMark={
                  customer.acct_mark
                }
                name={customer.name}
              />

              <CustomerInfo
                customer={customer}
                phones={phones}
                address={customer.address}
              />

              <Balances
                balances={balances}
                acctMark={
                  customer.acct_mark
                }
              />

           <CollectionNotes
  notes={notes}
  onAdd={handleAddNote}
  onUpdate={handleUpdateNote}
  onDelete={handleDeleteNote}
/>

            </div>

            <div>

              <PaymentPanel
  payment={payment}
  custNo={custNo}
  onUpdate={handleUpdatePayment}
/>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="footer-bar">

          <span>
            AR NO: {customer.ar_no}
            &nbsp; เจ้าหน้าที่:{" "}
            {customer.officer_name}
            &nbsp;{" "}
            {customer.officer_phone}
          </span>

        </div>

      </div>

    </div>
  );
}
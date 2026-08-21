import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

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
  d
    ? new Date(d).toLocaleDateString("th-TH")
    : "—";

// =====================================================
// COMMON CLASS
// =====================================================

const inputClass =
  "h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const selectClass =
  "h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const panelClass =
  "rounded-xl border border-gray-200 bg-white p-5 shadow-sm";

// =====================================================
// CUSTOMER INFO
// =====================================================

function CustomerInfo({
  customer,
  phones,
  address,
}) {
  return (
    <div className={panelClass}>
      <h4 className="mb-5 text-base font-bold text-gray-800">
        Customer Information
      </h4>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div>
          <div className="mb-1 text-xs font-medium text-gray-500">
            NAME
          </div>

          <div className="text-sm font-semibold text-gray-800">
            {customer.name || "—"}
          </div>
        </div>

        <div>
          <div className="mb-1 text-xs font-medium text-gray-500">
            IDCard
          </div>

          <div className="text-sm text-gray-800">
            {customer.id_card || "—"}
          </div>
        </div>

        <div>
          <div className="mb-1 text-xs font-medium text-gray-500">
            BirthDate
          </div>

          <div className="text-sm text-gray-800">
            {fmtDate(customer.birth_date)}
          </div>
        </div>

        <div>
          <div className="mb-1 text-xs font-medium text-gray-500">
            Occupation
          </div>

          <div className="text-sm text-gray-800">
            {customer.occupation || "—"}
          </div>
        </div>

        <div>
          <div className="mb-1 text-xs font-medium text-gray-500">
            Position
          </div>

          <div className="text-sm text-gray-800">
            {customer.position || "—"}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {phones.map((p) => (
          <div
            key={p.label}
            className="rounded-lg bg-gray-50 px-4 py-3"
          >
            <div className="text-xs font-medium text-gray-500">
              {p.label}
            </div>

            <div className="mt-1 text-sm font-semibold text-gray-800">
              {p.number || "—"}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
        📍 {address || "—"}
      </div>
    </div>
  );
}

// =====================================================
// BALANCES
// =====================================================

function Balances({
  balances,
  acctMark,
}) {
  if (!balances) return null;

  return (
    <div className={panelClass}>
      <h4 className="mb-5 text-base font-bold text-gray-800">
        Account Balances
      </h4>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-600">
                ACCTMark
              </th>

              <th className="px-4 py-3 text-right font-semibold text-gray-600">
                PrinBal
              </th>

              <th className="px-4 py-3 text-right font-semibold text-gray-600">
                OSbal
              </th>

              <th className="px-4 py-3 text-right font-semibold text-gray-600">
                OSbalCust
              </th>

              <th className="px-4 py-3 text-right font-semibold text-gray-600">
                OVDamt
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-800">
                ▷ {acctMark}
              </td>

              <td className="px-4 py-3 text-right text-gray-700">
                {fmt(balances.prin_bal)}
              </td>

              <td className="px-4 py-3 text-right text-gray-700">
                {fmt(balances.os_bal)}
              </td>

              <td className="px-4 py-3 text-right text-gray-700">
                {fmt(balances.os_bal_cust)}
              </td>

              <td className="px-4 py-3 text-right font-bold text-red-600">
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

  const cols = [
    col1,
    col2,
    col3,
    col4,
  ];

  return (
    <div className={panelClass}>
      <h4 className="mb-5 text-base font-bold text-gray-800">
        Account Details
      </h4>

      <div className="grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2 xl:grid-cols-4">
        {cols.map((col, ci) => (
          <div key={ci}>
            {col.map(([label, val]) => (
              <div
                key={label}
                className="grid grid-cols-[120px_1fr] gap-2 border-b border-gray-100 py-2"
              >
                <div className="text-xs font-medium text-gray-500">
                  {label}:
                </div>

                <div className="break-words text-xs text-gray-800">
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

function CollectionNotes({
  notes,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [draft, setDraft] = useState({
    action_code_1: "",
    action_code_2: "",
    note_type: "Mobile",
    telephone: "",
    note: "",
    created_at: "",
  });

  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] =
    useState(null);

  const [editData, setEditData] =
    useState({});

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

  const toDateTimeLocal = (value) => {
    if (!value) return "";

    const d = new Date(value);

    if (Number.isNaN(d.getTime())) {
      return "";
    }

    const year = d.getFullYear();

    const month = String(
      d.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      d.getDate()
    ).padStart(2, "0");

    const hour = String(
      d.getHours()
    ).padStart(2, "0");

    const minute = String(
      d.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  const startEdit = (n) => {
    const action = parseActionCode(
      n.action_code
    );

    setEditingId(n.id);

    setEditData({
      action_code_1: action.first,
      action_code_2: action.second,
      note_type:
        n.note_type || "Mobile",
      telephone: n.telephone || "",
      note: n.note || "",
      created_at: toDateTimeLocal(
        n.created_at
      ),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (noteId) => {
    try {
      setSaving(true);

      await onDelete(noteId);

      if (editingId === noteId) {
        setEditingId(null);
        setEditData({});
      }
    } catch (error) {
      alert(
        error.message ||
          "ลบข้อมูลไม่สำเร็จ"
      );
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      setSaving(true);

      const actionCode =
        editData.action_code_1
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
        created_at:
          editData.created_at,
      });

      setEditingId(null);
      setEditData({});
    } catch (error) {
      alert(
        error.message ||
          "แก้ไขข้อมูลไม่สำเร็จ"
      );
    } finally {
      setSaving(false);
    }
  };

  const submit = async () => {
    if (!draft.note.trim()) {
      alert("กรุณากรอก Collection Note");
      return;
    }

    try {
      setSaving(true);

      const actionCode =
        draft.action_code_1
          ? `${draft.action_code_1}${
              draft.action_code_2
                ? ` | ${draft.action_code_2}`
                : ""
            }`
          : draft.action_code_2;

      await onAdd({
        action_code: actionCode,
        note_type: draft.note_type,
        telephone: draft.telephone,
        note: draft.note,
        created_at:
          draft.created_at,
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
      alert(
        error.message ||
          "เพิ่มข้อมูลไม่สำเร็จ"
      );
    } finally {
      setSaving(false);
    }
  };

  const ActionSelect = ({
    value,
    onChange,
    second = false,
  }) => (
    <select
      value={value}
      onChange={onChange}
      className={selectClass}
    >
      <option value="">—</option>

      {!second ? (
        <>
          <option value="NOA">NOA</option>
          <option value="OC">OC</option>
        </>
      ) : (
        <>
          <option value="OC">OC</option>
          <option value="NOA">NOA</option>
        </>
      )}
    </select>
  );

  const PhoneTypeSelect = ({
    value,
    onChange,
  }) => (
    <select
      value={value || "Mobile"}
      onChange={onChange}
      className={selectClass}
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
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* TABS */}

      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto">
          <div className="border-b-2 border-blue-600 bg-white px-5 py-3 text-sm font-semibold text-blue-600">
            Collection_Note
          </div>

          <div className="px-5 py-3 text-sm text-gray-500">
            ByBucket
          </div>

          <div className="px-5 py-3 text-sm text-gray-500">
            Stickynote
          </div>

          <div className="px-5 py-3 text-sm text-gray-500">
            TDR-operation-phone
          </div>
        </div>
      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-600">
                DateTime
              </th>

              <th className="px-4 py-3 text-left font-semibold text-gray-600">
                Action_Code
              </th>

              <th className="px-4 py-3 text-left font-semibold text-gray-600">
                Telephone number
              </th>

              <th className="px-4 py-3 text-left font-semibold text-gray-600">
                Collection_Note
              </th>

              <th className="px-4 py-3 text-left font-semibold text-gray-600">
                จัดการ
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">

            {notes.map((n) => {
              const isEditing =
                editingId === n.id;

              const action =
                parseActionCode(
                  n.action_code
                );

              return (
                <tr
                  key={n.id}
                  className="align-middle hover:bg-gray-50"
                >

                  {/* DATE */}

                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="datetime-local"
                        className={inputClass}
                        value={
                          editData.created_at ||
                          ""
                        }
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            created_at:
                              e.target.value,
                          })
                        }
                      />
                    ) : (
                      <button
                        type="button"
                        className="text-left text-xs text-gray-700 hover:text-blue-600"
                        onClick={() =>
                          startEdit(n)
                        }
                      >
                        {new Date(
                          n.created_at
                        ).toLocaleString(
                          "th-TH"
                        )}
                      </button>
                    )}
                  </td>

                  {/* ACTION CODE */}

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <ActionSelect
                        value={
                          isEditing
                            ? editData.action_code_1
                            : action.first
                        }
                        onChange={(e) => {
                          if (!isEditing) {
                            startEdit(n);
                          }

                          setEditData((prev) => ({
                            ...prev,
                            action_code_1:
                              e.target.value,
                            action_code_2:
                              isEditing
                                ? prev.action_code_2
                                : action.second,
                          }));
                        }}
                      />

                      <ActionSelect
                        second
                        value={
                          isEditing
                            ? editData.action_code_2
                            : action.second
                        }
                        onChange={(e) => {
                          if (!isEditing) {
                            startEdit(n);
                          }

                          setEditData((prev) => ({
                            ...prev,
                            action_code_1:
                              isEditing
                                ? prev.action_code_1
                                : action.first,
                            action_code_2:
                              e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </td>

                  {/* TELEPHONE */}

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <PhoneTypeSelect
                        value={
                          isEditing
                            ? editData.note_type
                            : n.note_type
                        }
                        onChange={(e) => {
                          if (!isEditing) {
                            startEdit(n);
                          }

                          setEditData((prev) => ({
                            ...prev,
                            note_type:
                              e.target.value,
                          }));
                        }}
                      />

                      <input
                        className={inputClass}
                        value={
                          isEditing
                            ? editData.telephone
                            : n.telephone || ""
                        }
                        placeholder="เบอร์โทร"
                        onChange={(e) => {
                          if (!isEditing) {
                            startEdit(n);
                          }

                          setEditData((prev) => ({
                            ...prev,
                            telephone:
                              e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </td>

                  {/* NOTE */}

                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        className={inputClass}
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
                        className={`${inputClass} bg-gray-50`}
                        value={
                          n.note || ""
                        }
                        readOnly
                        onDoubleClick={() =>
                          startEdit(n)
                        }
                      />
                    )}
                  </td>

                  {/* ACTION */}

                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={saveEdit}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          {saving
                            ? "กำลังบันทึก..."
                            : "บันทึก"}
                        </button>

                        <button
                          type="button"
                          disabled={saving}
                          onClick={cancelEdit}
                          className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                        >
                          ยกเลิก
                        </button>

                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            handleDelete(n.id)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                          ลบ
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            startEdit(n)
                          }
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                        >
                          แก้ไข
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(n.id)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          ลบ
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {/* NEW NOTE */}

            <tr className="bg-blue-50/40">

              {/* DATE */}

              <td className="px-4 py-3">
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={
                    draft.created_at || ""
                  }
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      created_at:
                        e.target.value,
                    })
                  }
                />
              </td>

              {/* ACTION */}

              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <ActionSelect
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
                  />

                  <ActionSelect
                    second
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
                  />
                </div>
              </td>

              {/* TELEPHONE */}

              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <PhoneTypeSelect
                    value={draft.note_type}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        note_type:
                          e.target.value,
                      })
                    }
                  />

                  <input
                    className={inputClass}
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

              <td className="px-4 py-3">
                <input
                  className={inputClass}
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

              <td className="px-4 py-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={submit}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
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

function PaymentPanel({
  payment,
  custNo,
  onUpdate,
}) {
  const [editData, setEditData] =
    useState({
      call_result:
        payment?.call_result || "",
      due_date:
        payment?.due_date || "",
      due_amount:
        payment?.due_amount || "",
      forecast_pct:
        payment?.forecast_pct || "",
      debtor_type:
        payment?.debtor_type || "",
      contact_date:
        payment?.contact_date || "",
      last_phone:
        payment?.last_phone || "",
    });

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (!payment) return;

    setEditData({
      call_result:
        payment.call_result || "",
      due_date:
        payment.due_date || "",
      due_amount:
        payment.due_amount || "",
      forecast_pct:
        payment.forecast_pct || "",
      debtor_type:
        payment.debtor_type || "",
      contact_date:
        payment.contact_date || "",
      last_phone:
        payment.last_phone || "",
    });
  }, [payment]);

  const handleChange = (
    field,
    value
  ) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await onUpdate(editData);

      alert(
        "บันทึกข้อมูลการชำระสำเร็จ"
      );
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
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="py-10 text-center text-sm text-gray-500">
          ไม่มีข้อมูลการชำระ
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

      {/* HEADER */}

      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <div className="text-lg font-bold text-gray-800">
            ข้อมูลการชำระ
          </div>

          <div className="mt-1 text-xs text-gray-500">
            Payment Information
          </div>
        </div>

        <div className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600">
          {custNo}
        </div>
      </div>

      {/* PAYMENT FORM */}

      <div className="mb-6">
        <div className="mb-4 text-sm font-bold text-gray-700">
          ข้อมูลการติดตาม
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* CALL RESULT */}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              ผลการ Call
            </label>

            <select
              value={
                editData.call_result
              }
              onChange={(e) =>
                handleChange(
                  "call_result",
                  e.target.value
                )
              }
              className={inputClass}
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

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              ประเภทลูกหนี้
            </label>

            <select
              value={
                editData.debtor_type
              }
              onChange={(e) =>
                handleChange(
                  "debtor_type",
                  e.target.value
                )
              }
              className={inputClass}
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

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
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
              className={inputClass}
            />
          </div>

          {/* DUE AMOUNT */}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
              ยอดครบกำหนด
            </label>

            <div className="flex h-9 overflow-hidden rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <span className="flex w-9 items-center justify-center bg-gray-50 text-sm font-semibold text-gray-500">
                ฿
              </span>

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
                className="w-full border-0 px-3 text-sm outline-none"
              />
            </div>
          </div>

          {/* FORECAST */}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
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
              className={inputClass}
            >
              <option value="">
                — เลือก —
              </option>

              {[
                0,
                10,
                20,
                30,
                40,
                50,
                60,
                70,
                80,
                90,
                100,
              ].map((x) => (
                <option
                  key={x}
                  value={x}
                >
                  {x}%
                </option>
              ))}
            </select>
          </div>

          {/* CONTACT DATE */}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-600">
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
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* CONTACT RESULT */}

      <div className="mb-6">
        <div className="mb-4 text-sm font-bold text-gray-700">
          ผลการติดต่อ
        </div>

        <div className="grid grid-cols-2 gap-3">

          <button
            type="button"
            className={`rounded-xl border p-4 text-sm font-semibold transition ${
              editData.call_result ===
              "ไม่ใช่เบอร์ลูกค้า"
                ? "border-red-500 bg-red-100 text-red-700 ring-2 ring-red-200"
                : "border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
            }`}
            onClick={() =>
              handleChange(
                "call_result",
                "ไม่ใช่เบอร์ลูกค้า"
              )
            }
          >
            <div className="mb-1 text-xl">
              ✕
            </div>

            ไม่ใช่
            <br />
            เบอร์ลูกค้า
          </button>

          <button
            type="button"
            className={`rounded-xl border p-4 text-sm font-semibold transition ${
              editData.call_result ===
              "ติดต่อไม่ได้"
                ? "border-red-600 bg-red-100 text-red-700 ring-2 ring-red-200"
                : "border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
            }`}
            onClick={() =>
              handleChange(
                "call_result",
                "ติดต่อไม่ได้"
              )
            }
          >
            <div className="mb-1 text-xl">
              ☎
            </div>

            ติดต่อ
            <br />
            ไม่ได้
          </button>

          <button
            type="button"
            className={`rounded-xl border p-4 text-sm font-semibold transition ${
              editData.call_result ===
              "ปิดเครื่อง"
                ? "border-teal-600 bg-teal-100 text-teal-700 ring-2 ring-teal-200"
                : "border-teal-100 bg-teal-50 text-teal-700 hover:bg-teal-100"
            }`}
            onClick={() =>
              handleChange(
                "call_result",
                "ปิดเครื่อง"
              )
            }
          >
            <div className="mb-1 text-xl">
              ◉
            </div>

            ปิดเครื่อง
          </button>

          <button
            type="button"
            className={`rounded-xl border p-4 text-sm font-semibold transition ${
              editData.call_result ===
              "ไม่รับสาย"
                ? "border-amber-500 bg-amber-100 text-amber-700 ring-2 ring-amber-200"
                : "border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
            onClick={() =>
              handleChange(
                "call_result",
                "ไม่รับสาย"
              )
            }
          >
            <div className="mb-1 text-xl">
              ☎
            </div>

            ไม่รับ
            <br />
            สาย
          </button>
        </div>
      </div>

      {/* LAST PHONE */}

      <div className="mb-5">
        <label className="mb-2 block text-sm font-bold text-gray-700">
          เบอร์โทรล่าสุด
        </label>

        <div className="flex h-11 items-center overflow-hidden rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          <span className="px-3 text-lg">
            📞
          </span>

          <input
            type="text"
            value={
              editData.last_phone || ""
            }
            placeholder="กรอกเบอร์โทรล่าสุด"
            onChange={(e) =>
              handleChange(
                "last_phone",
                e.target.value
              )
            }
            className="h-full w-full border-0 pr-3 text-sm outline-none"
          />
        </div>
      </div>

      {/* SAVE */}

      <button
        type="button"
        disabled={saving}
        onClick={handleSave}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? (
          <>
            <span className="animate-spin">
              ⟳
            </span>

            กำลังบันทึก...
          </>
        ) : (
          <>
            ✓
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
  const { custNo } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [data, setData] =
    useState(null);

  const [error, setError] =
    useState(null);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // ===================================================
  // LOAD
  // ===================================================

  const load = useCallback(
    async () => {
      try {
        setError(null);

        const d =
          await fetchAccount(custNo);

        setData(d);
      } catch (e) {
        setError(e.message);
      }
    },
    [custNo]
  );

  useEffect(() => {
    load();
  }, [load]);

  // ===================================================
  // NOTE
  // ===================================================

  const handleAddNote = async (draft) => {
    await addNote(
      custNo,
      draft
    );

    await load();
  };

  const handleUpdateNote = async (
    noteId,
    noteData
  ) => {
    await updateNote(
      noteId,
      noteData
    );

    await load();
  };

  const handleDeleteNote = async (
    noteId
  ) => {
    const confirmed =
      window.confirm(
        "ต้องการลบ Collection Note นี้ใช่หรือไม่?"
      );

    if (!confirmed) return;

    await deleteNote(noteId);

    await load();
  };

  // ===================================================
  // PAYMENT
  // ===================================================

  const handleUpdatePayment =
    async (paymentData) => {
      await updatePayment(
        custNo,
        paymentData
      );

      await load();
    };

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">

          <div className="mb-3 text-3xl">
            ⚠️
          </div>

          <p className="mb-5 text-sm text-red-600">
            เชื่อมต่อ API ไม่ได้:{" "}
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/accounts")
            }
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            ← กลับ Accounts
          </button>
        </div>
      </div>
    );
  }

  // ===================================================
  // LOADING
  // ===================================================

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-500">
          กำลังโหลดข้อมูล…
        </div>
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
    <div className="min-h-screen bg-gray-100">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {/* =================================================
          MAIN APP AREA

          สำคัญ:
          lg:ml-64 = เว้นพื้นที่ Sidebar 256px
      ================================================= */}

      <div className="min-h-screen lg:ml-64">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <div className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-200 bg-white px-4 shadow-sm">

          <div className="flex items-center gap-3">

            {/* MOBILE MENU */}

            <button
              type="button"
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              ☰
            </button>

            <span className="text-lg font-bold text-gray-800">
              DebtCollect Pro
            </span>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              Queue
            </span>
          </div>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="mx-auto w-full max-w-[1800px] p-4 md:p-6">

          {/* CASE HEADER */}

          <div className="mb-4 flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center">

            <div>

              <div className="text-xl font-bold text-gray-800">
                K-Bank PRL{" "}
                <span className="text-gray-500">
                  (ข้อมูลทั้งหมด)
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">

                <span>
                  Cusno:{" "}
                  <b className="text-gray-800">
                    {customer.cust_no}
                  </b>
                </span>

                <span className="rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  ACCTMark{" "}
                  {customer.acct_mark}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">

              <span className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600">
                ⚠ NPL ลด{" "}
                {customer.npl_pct}%
              </span>

              <span className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white">
                ACCTMark:{" "}
                {customer.acct_mark}
              </span>

            </div>
          </div>

          {/* BACK */}

          <button
            type="button"
            onClick={() =>
              navigate("/accounts")
            }
            className="mb-5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-50 hover:text-blue-600"
          >
            ← Back to Accounts
          </button>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(380px,0.8fr)]">

            {/* =================================================
                LEFT
            ================================================= */}

            <div className="min-w-0 space-y-5">

              <AccountDetails
                d={{
                  ...details,
                  ...balances,
                }}
                custNo={
                  customer.cust_no
                }
                acctMark={
                  customer.acct_mark
                }
                name={
                  customer.name
                }
              />

              <CustomerInfo
                customer={customer}
                phones={phones}
                address={
                  customer.address
                }
              />

              <Balances
                balances={balances}
                acctMark={
                  customer.acct_mark
                }
              />

              <CollectionNotes
                notes={notes}
                onAdd={
                  handleAddNote
                }
                onUpdate={
                  handleUpdateNote
                }
                onDelete={
                  handleDeleteNote
                }
              />

            </div>

            {/* =================================================
                RIGHT
            ================================================= */}

            <div className="min-w-0">

              <PaymentPanel
                payment={payment}
                custNo={custNo}
                onUpdate={
                  handleUpdatePayment
                }
              />

            </div>

          </div>
        </main>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="mt-5 border-t border-gray-200 bg-white">

          <div className="mx-auto flex max-w-[1800px] flex-col gap-4 px-6 py-4 md:flex-row md:items-center">

            <div>
              <div className="text-[10px] font-semibold uppercase text-gray-400">
                AR NO
              </div>

              <div className="text-sm font-semibold text-gray-700">
                {customer.ar_no || "—"}
              </div>
            </div>

            <div className="hidden h-8 w-px bg-gray-200 md:block" />

            <div>
              <div className="text-[10px] font-semibold text-gray-400">
                เจ้าหน้าที่
              </div>

              <div className="text-sm font-semibold text-gray-700">
                {user?.full_name ||
                  "—"}
              </div>
            </div>

            <div className="hidden h-8 w-px bg-gray-200 md:block" />

            <div>
              <div className="text-[10px] font-semibold text-gray-400">
                โทรศัพท์
              </div>

              <a
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                href={
                  user?.phone
                    ? `tel:${user.phone}`
                    : undefined
                }
              >
                ☎{" "}
                {user?.phone || "—"}
              </a>
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
}
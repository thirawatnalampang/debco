import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000/api"
).replace(/\/+$/, "");

function getAuthHeaders() {
  const headers = {
    "Content-Type": "application/json",
  };

  // รองรับ Token ที่เก็บใน localStorage
  const tokenKeys = ["token", "accessToken", "authToken", "jwt"];

  for (const key of tokenKeys) {
    const token = localStorage.getItem(key);

    if (token) {
      headers.Authorization = `Bearer ${token}`;
      break;
    }
  }

  // รองรับกรณีเก็บข้อมูลผู้ใช้พร้อม Token ไว้ใน user
  if (!headers.Authorization) {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const token = user?.token || user?.accessToken;

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ข้อมูล user ไม่ใช่ JSON ก็ข้ามไป
    }
  }

  return headers;
}

async function readResponse(response) {
  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || "เซิร์ฟเวอร์ตอบกลับในรูปแบบที่ไม่ถูกต้อง" };
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        data.message ||
          "ยืนยันตัวตนไม่สำเร็จ กรุณาเข้าสู่ระบบใหม่ หรือให้ผู้ดูแลตรวจสอบสิทธิ์"
      );
    }

    throw new Error(
      data.message || `เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ (${response.status})`
    );
  }

  return data;
}

function NewCollection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    accountNo: searchParams.get("accountNo") || "",
    customerName: "",
    taskType: "Phone",
    targetAmount: "",
    dueDate: "",
    priority: "Medium",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [customerFound, setCustomerFound] = useState(false);

  const lookupCustomer = useCallback(async (accountNo) => {
    const normalizedAccountNo = String(accountNo || "").trim();

    if (!normalizedAccountNo) {
      setError("กรุณากรอกเลขที่บัญชี");
      return false;
    }

    setSearching(true);
    setError("");
    setCustomerFound(false);
    setForm((prev) => ({ ...prev, customerName: "" }));

    try {
      const response = await fetch(
        `${API_URL}/tasks/lookup?accountNo=${encodeURIComponent(
          normalizedAccountNo
        )}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

      const data = await readResponse(response);
      const customer = data.customer;

      if (!customer) {
        throw new Error("เซิร์ฟเวอร์ไม่ส่งข้อมูลลูกค้ากลับมา");
      }

      setForm((prev) => ({
        ...prev,
        accountNo: String(customer.cust_no ?? normalizedAccountNo),
        customerName: customer.name || "",
      }));

      setCustomerFound(true);
      return true;
    } catch (err) {
      setError(err.message || "ค้นหาบัญชีไม่สำเร็จ");
      return false;
    } finally {
      setSearching(false);
    }
  }, []);

  // ค้นหาลูกค้าอัตโนมัติเมื่อเข้าจากหน้า Account Detail
  useEffect(() => {
    const accountNo = (searchParams.get("accountNo") || "").trim();

    if (!accountNo) return;

    setForm((prev) => ({
      ...prev,
      accountNo,
      customerName: "",
    }));

    lookupCustomer(accountNo);
  }, [searchParams, lookupCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "accountNo" && {
        customerName: "",
      }),
    }));

    if (name === "accountNo") {
      setCustomerFound(false);
      setError("");
    }
  };

  const handleLookup = async () => {
    await lookupCustomer(form.accountNo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const accountNo = form.accountNo.trim();

    if (!accountNo) {
      setError("กรุณาระบุเลขที่บัญชี");
      return;
    }

    if (!customerFound) {
      setError("กรุณาค้นหาและยืนยันบัญชีลูกค้าก่อนสร้างงาน");
      return;
    }

    if (!form.dueDate) {
      setError("กรุณาเลือกวันนัดติดตาม");
      return;
    }

    const amount = Number(form.targetAmount || 0);

    if (!Number.isFinite(amount) || amount < 0) {
      setError("กรุณากรอกยอดเงินให้ถูกต้อง");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          accountNo,
          taskType: form.taskType,
          targetAmount: amount,
          dueDate: form.dueDate,
          priority: form.priority,
          description: form.description.trim(),
        }),
      });

      const data = await readResponse(response);

      alert(data.message || "สร้างงานติดตามหนี้สำเร็จ");
      navigate("/collections");
    } catch (err) {
      console.error("Create Collection Task Error:", err);
      setError(err.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

  const labelClass = "mb-2 block text-sm font-medium text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate("/collections")}
          className="mb-5 text-sm text-slate-500 hover:text-emerald-700"
        >
          ← Back to Collections
        </button>

        <h1 className="text-2xl font-bold text-slate-800">
          New Collection Task
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          สร้างงานติดตามหนี้ กำหนดยอดเงิน และวันดำเนินการ
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-7 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <h2 className="border-b border-slate-100 pb-4 text-lg font-semibold text-slate-800">
            Task Information
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Account Number</label>

              <div className="flex gap-2">
                <input
                  name="accountNo"
                  value={form.accountNo}
                  onChange={handleChange}
                  required
                  placeholder="กรอกเลขที่บัญชี"
                  className={inputClass}
                />

                <button
                  type="button"
                  onClick={handleLookup}
                  disabled={searching || !form.accountNo.trim()}
                  className="shrink-0 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                >
                  {searching ? "กำลังค้นหา..." : "ค้นหา"}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>Customer Name</label>

              <input
                name="customerName"
                value={form.customerName}
                readOnly
                placeholder={
                  searching ? "กำลังค้นหาลูกค้า..." : "ค้นหาจากเลขที่บัญชี"
                }
                className={`${inputClass} bg-slate-50`}
              />

              <p className="mt-1 text-xs text-slate-400">
                ชื่อจะปรากฏเมื่อค้นพบบัญชีในระบบ
              </p>
            </div>

            <div>
              <label className={labelClass}>Task Type</label>
              <select
                name="taskType"
                value={form.taskType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Phone">Phone</option>
                <option value="Mobile">Mobile</option>
                <option value="Home">Home Visit</option>
                <option value="Office">Office Visit</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Target Amount (บาท)</label>
              <input
                type="number"
                name="targetAmount"
                min="0"
                step="0.01"
                value={form.targetAmount}
                onChange={handleChange}
                placeholder="เช่น 5000.00"
                className={inputClass}
              />
              <p className="mt-1 text-xs text-slate-400">
                ยอดเป้าหมายที่ต้องการติดตาม
              </p>
            </div>

            <div>
              <label className={labelClass}>Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Task Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="รายละเอียดการติดตามหนี้..."
                className={inputClass}
              />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => navigate("/collections")}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || searching || !customerFound}
              className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewCollection;

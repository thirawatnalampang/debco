import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  // ข้อมูลบัญชีลูกหนี้
  cust_no: "",
  acct_mark: "",
  name: "",
  id_card: "",
  birth_date: "",
  occupation: "",
  position: "",
  address: "",

  // ข้อมูลยอดหนี้
  original_principal: "",
  prin_bal: "",
  interest: "",
  os_bal: "",
  ovd_amt: "",
  dpd: "",
  last_payment_date: "",
  last_payment_amount: "",

  // ข้อมูลติดตามหนี้
  npl_pct: "",
  stage: "",
  ar_no: "",
  officer_name: "",
  officer_phone: "",
  status: "ACTIVE",
};

const sections = [
  {
    title: "ข้อมูลบัญชีลูกหนี้",
    fields: [
      { name: "cust_no", label: "เลขที่ลูกหนี้ (Cusno)", required: true },
      { name: "acct_mark", label: "เลขบัญชี (ACCTMark)", required: true },
      { name: "name", label: "ชื่อลูกค้า", required: true },
      { name: "id_card", label: "เลขบัตรประชาชน" },
      { name: "birth_date", label: "วันเกิด", type: "date" },
      { name: "occupation", label: "อาชีพ" },
      { name: "position", label: "ตำแหน่ง" },
      { name: "address", label: "ที่อยู่ / จังหวัด" },
    ],
  },
  {
    title: "ข้อมูลยอดหนี้ (บาท)",
    fields: [
      {
        name: "original_principal",
        label: "เงินต้นตั้งต้น",
        type: "number",
      },
      {
        name: "prin_bal",
        label: "เงินต้นคงเหลือ (PrinBal)",
        type: "number",
      },
      {
        name: "interest",
        label: "ดอกเบี้ยคงค้าง",
        type: "number",
      },
      {
        name: "os_bal",
        label: "ยอดหนี้คงเหลือรวม (OSBal)",
        type: "number",
      },
      {
        name: "ovd_amt",
        label: "ยอดค้างชำระ (OVDamt)",
        type: "number",
      },
      {
        name: "dpd",
        label: "จำนวนวันค้างชำระ (DPD)",
        type: "number",
      },
      {
        name: "last_payment_date",
        label: "วันที่ชำระล่าสุด",
        type: "date",
      },
      {
        name: "last_payment_amount",
        label: "ยอดชำระล่าสุด",
        type: "number",
      },
    ],
  },
  {
    title: "ข้อมูลติดตามหนี้และเจ้าหน้าที่",
    fields: [
      {
        name: "npl_pct",
        label: "เปอร์เซ็นต์ NPL",
        type: "number",
      },
      {
        name: "stage",
        label: "Stage",
        type: "number",
      },
      { name: "ar_no", label: "รหัสเจ้าหน้าที่ (AR)" },
      { name: "officer_name", label: "ชื่อเจ้าหน้าที่" },
      { name: "officer_phone", label: "เบอร์โทรเจ้าหน้าที่" },
    ],
  },
];

const numberFields = [
  "original_principal",
  "prin_bal",
  "interest",
  "os_bal",
  "ovd_amt",
  "dpd",
  "last_payment_amount",
  "npl_pct",
  "stage",
];

export default function AddAccount() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const baseUrl = (
        import.meta.env.VITE_API_URL || "/api"
      ).replace(/\/+$/, "");

      const payload = { ...form };

      // แปลงช่องตัวเลขที่กรอกเป็นตัวเลข
      // ช่องว่างส่งเป็น null เพื่อไม่ส่ง "" ไปเป็น numeric
      numberFields.forEach((key) => {
        payload[key] =
          form[key] === "" ? null : Number(form[key]);
      });

      const response = await fetch(`${baseUrl}/accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "เพิ่มบัญชีไม่สำเร็จ");
      }

      alert("เพิ่มบัญชีลูกหนี้สำเร็จ");
      navigate("/accounts");
    } catch (err) {
      setError(
        err.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100";

  const renderField = (field) => (
    <div key={field.name}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        className={inputClass}
        name={field.name}
        type={field.type || "text"}
        value={form[field.name]}
        onChange={handleChange}
        required={field.required || false}
        step={
          field.type === "number" ? "any" : undefined
        }
        min={
          ["stage", "dpd", "original_principal",
           "prin_bal", "interest", "os_bal",
           "ovd_amt", "last_payment_amount"].includes(field.name)
            ? 0
            : undefined
        }
        placeholder={`กรอก${field.label}`}
      />
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="mb-6">
        <p className="text-sm font-medium text-green-700">
          btCollect ProQueue
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-800">
          เพิ่มบัญชีลูกหนี้
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          กรอกข้อมูลลูกค้า ยอดหนี้ และข้อมูลสำหรับติดตามบัญชี
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {sections.map((section, index) => (
          <section
            key={section.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6"
          >
            <div className="mb-5 flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 font-bold text-green-700">
                {index + 1}
              </div>

              <h2 className="font-semibold text-gray-800">
                {section.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {section.fields.map(renderField)}

              {index === 2 && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    สถานะบัญชี
                  </label>

                  <select
                    className={inputClass}
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="WRITTEN_OFF">
                      WRITTEN_OFF
                    </option>
                  </select>
                </div>
              )}
            </div>
          </section>
        ))}

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            ยกเลิก
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "กำลังบันทึก..."
              : "บันทึกบัญชีลูกหนี้"}
          </button>
        </div>
      </form>
    </div>
  );
}
import { useState } from "react";

function Settings() {
  const [profile, setProfile] = useState({
    name: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).name || ""
      : "",
    email: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).email || ""
      : "",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
    setSaved(false);
  };

  const handleSave = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const updatedUser = {
      ...user,
      name: profile.name,
      email: profile.email,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Settings
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            จัดการข้อมูลบัญชีและการตั้งค่าระบบ
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">
              ข้อมูลบัญชี
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              จัดการข้อมูลส่วนตัวของคุณ
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  ชื่อผู้ใช้งาน
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="กรอกชื่อผู้ใช้งาน"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  อีเมล
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
              {saved && (
                <p className="text-sm text-emerald-700">
                  บันทึกข้อมูลแล้ว
                </p>
              )}

              <button
                type="button"
                onClick={handleSave}
                className="ml-auto rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </section>

          {/* Application information */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">
              เกี่ยวกับระบบ
            </h2>

            <div className="mt-5 divide-y divide-slate-100">
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-slate-600">
                  ชื่อระบบ
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  K-Bank Debt Management CRM
                </span>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-slate-600">
                  เวอร์ชัน
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  1.0.0
                </span>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-slate-600">
                  สถานะ
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  พร้อมใช้งาน
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Settings;
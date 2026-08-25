import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/login",
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data =
        await response.json();

      // Login ไม่สำเร็จ
      if (!response.ok) {
        throw new Error(
          data.message ||
            "เข้าสู่ระบบไม่สำเร็จ"
        );
      }

      // =================================================
      // LOGIN SUCCESS
      // =================================================

      // เก็บ user เข้า AuthContext
      login(data.user);

      // ไป Dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      setError(
        err.message ||
          "เข้าสู่ระบบไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f6f5] flex items-center justify-center p-3 sm:p-6 box-border font-sans">

      {/* LOGIN CARD */}

      <div className="w-full max-w-[900px] min-h-[520px] flex flex-col md:flex-row bg-white border border-[#d8ddd9] rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.10)]">

        {/* LEFT */}

        <div className="relative w-full md:w-1/2 min-h-[250px] sm:min-h-[280px] md:min-h-0 p-6 sm:p-8 md:p-10 flex flex-col box-border bg-white bg-cover bg-center bg-[linear-gradient(rgba(255,255,255,0.72),rgba(255,255,255,0.82)),url('/building.jpg')]">

          <div className="flex items-center gap-2.5 text-[#222] font-serif text-lg font-bold">
            <div className="text-[#00833e] text-2xl">
              🏦
            </div>

            <span>K-Bank</span>
          </div>

          <h1 className="mt-8 md:mt-[35px] mb-2 text-[#006b35] font-serif text-[25px] sm:text-[30px] leading-tight font-bold">
            DebtCollect Pro
          </h1>

          <p className="m-0 max-w-[340px] text-[#333] text-[13px] sm:text-sm leading-[1.7]">
            ระบบบริหารจัดการหนี้และลูกหนี้สัมพันธ์
            <br />
            สำหรับพนักงาน K-Bank
          </p>

          <div className="mt-7 md:mt-auto flex flex-col sm:flex-row gap-3">

            <div className="flex-1 min-h-[60px] md:min-h-[70px] px-3.5 py-2.5 flex items-center gap-3 bg-white/90 border border-[#d2d7d3]/90 rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <div className="shrink-0 text-[#00833e] text-[22px]">
                🔒
              </div>

              <span className="text-[#222] text-[11px] sm:text-xs leading-[1.4] font-semibold">
                ระบบความปลอดภัยระดับสากล
              </span>
            </div>

            <div className="flex-1 min-h-[60px] md:min-h-[70px] px-3.5 py-2.5 flex items-center gap-3 bg-white/90 border border-[#d2d7d3]/90 rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <div className="shrink-0 text-[#00833e] text-[22px]">
                ◔
              </div>

              <span className="text-[#222] text-[11px] sm:text-xs leading-[1.4] font-semibold">
                ประมวลผลข้อมูลรวดเร็ว
              </span>
            </div>

          </div>
        </div>

        {/* RIGHT */}

        <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-9 sm:px-8 sm:py-10 box-border bg-white">

          <div className="w-full max-w-[330px]">

            <h2 className="m-0 mb-2 text-[#222] text-[23px] sm:text-[26px] leading-[1.3] font-bold">
              เข้าสู่ระบบ
            </h2>

            <p className="m-0 mb-7 text-[#666] text-[13px] leading-[1.5]">
              กรุณาเข้าสู่ระบบด้วยรหัสพนักงานของคุณ
            </p>

            <form
              onSubmit={handleLogin}
              className="w-full"
            >

              {/* USERNAME */}

              <label className="block mb-2 text-[#333] text-[13px] font-semibold">
                รหัสพนักงาน / อีเมล
              </label>

              <div className="relative w-full mb-[18px]">

                <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#6b756f] text-lg pointer-events-none">
                  ♙
                </span>

                <input
                  type="text"
                  placeholder="เช่น EMP12345"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value
                    )
                  }
                  required
                  className="w-full h-11 box-border pl-[42px] pr-[42px] border border-[#d4ddd7] rounded-md outline-none text-[#333] bg-white text-sm transition placeholder:text-[#9aa19d] focus:border-[#00833e] focus:shadow-[0_0_0_3px_rgba(0,131,62,0.10)]"
                />

              </div>

              {/* PASSWORD */}

              <div className="flex justify-between items-center">

                <label className="block mb-2 text-[#333] text-[13px] font-semibold">
                  รหัสผ่าน
                </label>

                <button
                  type="button"
                  className="p-0 border-none bg-transparent text-[#00833e] text-xs font-semibold cursor-pointer hover:underline"
                  onClick={() =>
                    alert(
                      "กรุณาติดต่อผู้ดูแลระบบ"
                    )
                  }
                >
                  ลืมรหัสผ่าน?
                </button>

              </div>

              <div className="relative w-full mb-[18px]">

                <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#6b756f] text-lg pointer-events-none">
                  🔒
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                  className="w-full h-11 box-border pl-[42px] pr-[42px] border border-[#d4ddd7] rounded-md outline-none text-[#333] bg-white text-sm transition focus:border-[#00833e] focus:shadow-[0_0_0_3px_rgba(0,131,62,0.10)]"
                />

                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0 border-none bg-transparent text-[#68736d] text-[17px] cursor-pointer"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

              {/* REMEMBER */}

              <label className="flex items-center gap-2 mb-5 text-[#666] text-xs cursor-pointer">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                  className="w-[15px] h-[15px] m-0 accent-[#00833e]"
                />

                <span>
                  จดจำการเข้าสู่ระบบ
                </span>

              </label>

              {/* ERROR */}

              {error && (
                <div className="mb-3.5 px-3 py-2.5 bg-[#fff1f1] border border-[#f0caca] rounded-md text-[#c62828] text-xs leading-[1.4]">
                  {error}
                </div>
              )}

              {/* LOGIN */}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[46px] border-none rounded-md bg-[#00833e] text-white text-sm font-semibold cursor-pointer transition hover:bg-[#006f35] hover:-translate-y-px hover:shadow-[0_4px_10px_rgba(0,131,62,0.20)] disabled:bg-[#8db9a0] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {loading
                  ? "กำลังเข้าสู่ระบบ..."
                  : "เข้าสู่ระบบ →"}
              </button>

            </form>

            {/* FOOTER */}

            <div className="mt-7 text-center">

              <div className="w-full h-px mb-4 bg-[#dce1de]" />

              <p className="m-0 mb-1.5 text-[#555] text-[11px]">
                🔒 ระบบนี้สำหรับพนักงาน K-Bank เท่านั้น
              </p>

              <small className="text-[#777] text-[10px]">
                © 2024 K-Bank Debt Management System.
                All rights reserved.
              </small>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
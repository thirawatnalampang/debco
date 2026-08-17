import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "เข้าสู่ระบบไม่สำเร็จ");
      }

      // เก็บข้อมูลผู้ใช้
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(data.user));

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* LEFT */}
        <div className="login-left">
          <div className="brand">
            <div className="bank-icon">🏦</div>
            <span>K-Bank</span>
          </div>

          <h1>DebtCollect Pro</h1>

          <p>
            ระบบบริหารจัดการหนี้และลูกหนี้สัมพันธ์
            <br />
            สำหรับพนักงาน K-Bank
          </p>

          <div className="feature-boxes">
            <div className="feature-box">
              <div>🔒</div>
              <span>ระบบความปลอดภัยระดับสากล</span>
            </div>

            <div className="feature-box">
              <div>◔</div>
              <span>ประมวลผลข้อมูลรวดเร็ว</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="login-right">

          <div className="login-content">

            <h2>เข้าสู่ระบบ</h2>

            <p className="subtitle">
              กรุณาเข้าสู่ระบบด้วยรหัสพนักงานของคุณ
            </p>

            <form onSubmit={handleLogin}>

              <label>
                รหัสพนักงาน / อีเมล
              </label>

              <div className="input-wrapper">
                <span>♙</span>

                <input
                  type="text"
                  placeholder="เช่น EMP12345"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="password-label">
                <label>รหัสผ่าน</label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => alert("กรุณาติดต่อผู้ดูแลระบบ")}
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>

              <div className="input-wrapper">
                <span>🔒</span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                <span>จดจำการเข้าสู่ระบบ</span>
              </label>

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ →"}
              </button>

            </form>

            <div className="login-footer">

              <div className="divider"></div>

              <p>
                🔒 ระบบนี้สำหรับพนักงาน K-Bank เท่านั้น
              </p>

              <small>
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
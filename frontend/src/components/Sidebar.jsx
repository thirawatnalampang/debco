import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path) => {
    navigate(path);
    onClose?.();
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    const confirmed = window.confirm(
      "ต้องการออกจากระบบใช่หรือไม่?"
    );

    if (!confirmed) return;

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    onClose?.();

    navigate("/login");
  };

  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>

        {/* BRAND */}
        <div className="brand">
          <div className="brand-mark">
            K
          </div>

          <div>
            <div className="brand-name">
              K-Bank
            </div>

            <div className="brand-sub">
              Debt Management CRM
            </div>
          </div>
        </div>


        {/* =================================================
            SCROLL AREA
        ================================================= */}

        <div className="sidebar-scroll">

          {/* NAVIGATION */}
          <nav className="side-nav">

            <div
              className={`nav-item ${
                location.pathname === "/dashboard"
                  ? "active"
                  : ""
              }`}
              onClick={() => goTo("/dashboard")}
            >
              Dashboard
            </div>

            <div
              className={`nav-item ${
                location.pathname.startsWith("/accounts")
                  ? "active"
                  : ""
              }`}
              onClick={() => goTo("/accounts")}
            >
              Accounts
            </div>

            <div
              className="nav-item"
              onClick={() => goTo("/collections")}
            >
              Collections
            </div>

            <div
              className="nav-item"
              onClick={() => goTo("/reports")}
            >
              Reports
            </div>

          </nav>


          {/* SETTINGS */}
          <div className="side-settings">

            <div
              className={`nav-item ${
                location.pathname === "/settings"
                  ? "active"
                  : ""
              }`}
              onClick={() => goTo("/settings")}
            >
              Settings
            </div>

          </div>


          {/* NEW TASK */}
          <button
            className="new-task-btn"
            onClick={() =>
              goTo("/collections/new")
            }
          >
            + New Collection Task
          </button>

        </div>


        {/* =================================================
            LOGOUT — FIXED AT BOTTOM
        ================================================= */}

        <div className="sidebar-bottom">

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            <span className="logout-icon">
              ↪
            </span>

            <span>
              ออกจากระบบ
            </span>
          </button>

        </div>

      </aside>


      {/* MOBILE BACKDROP */}
      {open && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
        />
      )}
    </>
  );
}

export default Sidebar;
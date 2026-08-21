import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ open = true, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path) => {
    navigate(path);
    onClose?.();
  };

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

  const isActive = (path, startsWith = false) => {
    return startsWith
      ? location.pathname.startsWith(path)
      : location.pathname === path;
  };

  return (
    <>
      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          border-r border-slate-200
          bg-white
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* BRAND */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-700 text-lg font-bold text-white">
            K
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-red-800">
              K-Bank
            </div>

            <div className="truncate text-[10px] text-slate-500">
              Debt Management CRM
            </div>
          </div>
        </div>

        {/* SCROLL AREA */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-4">
          {/* NAVIGATION */}
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => goTo("/dashboard")}
              className={`
                flex w-full items-center rounded-lg px-3 py-2.5
                text-left text-sm font-medium transition
                ${
                  isActive("/dashboard")
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              `}
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => goTo("/accounts")}
              className={`
                flex w-full items-center rounded-lg px-3 py-2.5
                text-left text-sm font-medium transition
                ${
                  isActive("/accounts", true)
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              `}
            >
              Accounts
            </button>

            <button
              type="button"
              onClick={() => goTo("/collections")}
              className={`
                flex w-full items-center rounded-lg px-3 py-2.5
                text-left text-sm font-medium transition
                ${
                  isActive("/collections", true)
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              `}
            >
              Collections
            </button>

            <button
              type="button"
              onClick={() => goTo("/reports")}
              className={`
                flex w-full items-center rounded-lg px-3 py-2.5
                text-left text-sm font-medium transition
                ${
                  isActive("/reports", true)
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              `}
            >
              Reports
            </button>
          </nav>

          {/* SETTINGS */}
          <div className="mt-5 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={() => goTo("/settings")}
              className={`
                flex w-full items-center rounded-lg px-3 py-2.5
                text-left text-sm font-medium transition
                ${
                  isActive("/settings")
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              `}
            >
              Settings
            </button>
          </div>

          {/* NEW TASK */}
          <button
            type="button"
            onClick={() => goTo("/collections/new")}
            className="
              mt-5 w-full rounded-lg
              bg-emerald-700 px-4 py-2.5
              text-sm font-semibold text-white
              shadow-sm
              transition
              hover:bg-emerald-800
              active:scale-[0.98]
            "
          >
            + New Collection Task
          </button>
        </div>

        {/* LOGOUT */}
        <div className="shrink-0 border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex w-full items-center justify-center gap-2
              rounded-lg border border-red-200
              bg-white px-4 py-2.5
              text-sm font-semibold text-red-600
              transition
              hover:bg-red-50
            "
          >
            <span className="text-base">↪</span>
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* MOBILE BACKDROP */}
      {open && (
        <div
          className="
            fixed inset-0 z-40
            bg-slate-900/40
            lg:hidden
          "
          onClick={onClose}
        />
      )}
    </>
  );
}

export default Sidebar;
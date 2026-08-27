import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Collections() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [taskFilter, setTaskFilter] = useState("ทั้งหมด");

  // =====================================================
  // LOAD ACCOUNTS
  // =====================================================

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:4000/api/accounts",
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          `โหลดข้อมูล Accounts ไม่สำเร็จ (${response.status})`
        );
      }

      const data = await response.json();

      const rawAccounts = Array.isArray(data)
        ? data
        : Array.isArray(data.accounts)
        ? data.accounts
        : Array.isArray(data.data)
        ? data.data
        : [];

      const formattedAccounts = rawAccounts.map((item) => {
        const customer =
          item.customer ||
          item.customer_info ||
          {};

        const balances =
          item.balances ||
          item.balance ||
          {};

        const details =
          item.details ||
          {};

        const payment =
          item.payment ||
          {};

        const custNo =
          item.cust_no ||
          item.customer_no ||
          customer.cust_no ||
          "";

        const name =
          item.name ||
          item.full_name ||
          customer.name ||
          "";

        const accountNo =
          item.account ||
          item.account_no ||
          item.acct_no ||
          item.account_number ||
          details.account ||
          item.acct_mark ||
          "";

        const balance =
          item.os_bal ??
          item.os_bal_cust ??
          item.balance ??
          item.outstanding ??
          item.outstanding_balance ??
          balances.os_bal ??
          balances.os_bal_cust ??
          balances.outstanding ??
          balances.total_outstanding ??
          balances.total_balance ??
          0;

        const due =
          item.due_date ||
          item.due ||
          payment.due_date ||
          "";

        const status =
          item.status ||
          item.account_status ||
          item.status_flag ||
          payment.status ||
          "ACTIVE";

        return {
          id: item.id,
          cust_no: String(custNo),
          name: String(name),
          account: String(accountNo),
          balance: Number(balance) || 0,
          due,
          status: String(status).toUpperCase(),
          dpd: Number(
            item.dpd ||
            details.dpd ||
            0
          ),
        };
      });

      setAccounts(formattedAccounts);
    } catch (err) {
      console.error(
        "Load Collections Error:",
        err
      );

      setError(
        err.message ||
          "ไม่สามารถโหลดข้อมูล Collection ได้"
      );

      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // =====================================================
  // COLLECTION RULES
  // =====================================================

  // ให้ตรงกับ Dashboard:
  // Overdue = Outstanding >= 100,000
  const isOverdue = (account) => {
    return Number(account.balance || 0) >= 100000;
  };

  // Due Today ใช้เฉพาะกรณีที่มี due date จริง
  const isToday = (date) => {
    if (!date) return false;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return false;
    }

    const today = new Date();

    return (
      parsedDate.getFullYear() ===
        today.getFullYear() &&
      parsedDate.getMonth() ===
        today.getMonth() &&
      parsedDate.getDate() ===
        today.getDate()
    );
  };

  // High Risk = Outstanding >= 100,000
  const isHighRisk = (account) => {
    return Number(account.balance || 0) >= 100000;
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const todayTasks = useMemo(() => {
    return accounts.filter((account) =>
      isToday(account.due)
    );
  }, [accounts]);

  const overdueTasks = useMemo(() => {
    return accounts.filter((account) =>
      isOverdue(account)
    );
  }, [accounts]);

  const highRiskAccounts = useMemo(() => {
    return accounts.filter((account) =>
      isHighRisk(account)
    );
  }, [accounts]);

  const totalOutstanding = useMemo(() => {
    return accounts.reduce(
      (total, account) =>
        total +
        Number(account.balance || 0),
      0
    );
  }, [accounts]);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const keyword =
        search.trim().toLowerCase();

      const searchMatch =
        !keyword ||
        String(account.name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(account.cust_no || "")
          .toLowerCase()
          .includes(keyword) ||
        String(account.account || "")
          .toLowerCase()
          .includes(keyword);

      const statusMatch =
        statusFilter === "ทั้งหมด" ||
        account.status === statusFilter;

      let taskMatch = true;

      if (taskFilter === "วันนี้") {
        taskMatch = isToday(account.due);
      }

      if (taskFilter === "ค้างชำระ") {
        taskMatch = isOverdue(account);
      }

      if (taskFilter === "หนี้สูง") {
        taskMatch = isHighRisk(account);
      }

      return (
        searchMatch &&
        statusMatch &&
        taskMatch
      );
    });
  }, [
    accounts,
    search,
    statusFilter,
    taskFilter,
  ]);

  // =====================================================
  // FORMAT
  // =====================================================

  const formatMoney = (amount) => {
    return `฿${Number(amount || 0).toLocaleString(
      "th-TH",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return String(date);
    }

    return parsed.toLocaleDateString(
      "th-TH"
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "INACTIVE":
        return "bg-gray-100 text-gray-600 border-gray-200";

      case "SUSPENDED":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "CLOSED":
        return "bg-red-50 text-red-700 border-red-200";

      case "WRITTEN_OFF":
        return "bg-purple-50 text-purple-700 border-purple-200";

      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getTaskBadge = (account) => {
    if (isOverdue(account)) {
      return (
        <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
          Overdue
        </span>
      );
    }

    if (isToday(account.due)) {
      return (
        <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
          Due Today
        </span>
      );
    }

    return (
      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
        Follow-up
      </span>
    );
  };

  // =====================================================
  // CLEAR FILTER
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ทั้งหมด");
    setTaskFilter("ทั้งหมด");
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">

          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-slate-900">
              DebtCollect Pro
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Collections
            </span>
          </div>

          <button
            type="button"
            onClick={loadAccounts}
            disabled={loading}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Loading..."
              : "↻ Refresh"}
          </button>
        </header>

        {/* =================================================
            MAIN
        ================================================= */}

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-7xl space-y-6">

            {/* PAGE HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Collections
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage customer collection tasks and follow-ups
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/accounts")
                }
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                View All Accounts
              </button>

            </div>

            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {/* TODAY */}

              <button
                type="button"
                onClick={() => {
                  setTaskFilter("วันนี้");
                  setStatusFilter("ทั้งหมด");
                }}
                className={`rounded-xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  taskFilter === "วันนี้"
                    ? "border-blue-500 ring-1 ring-blue-500"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">

                  <span className="text-sm font-medium text-slate-500">
                    Today's Tasks
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                    📅
                  </span>

                </div>

                <div className="mt-3 text-3xl font-bold text-slate-900">
                  {loading
                    ? "..."
                    : todayTasks.length.toLocaleString(
                        "th-TH"
                      )}
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Accounts due today
                </p>
              </button>

              {/* OVERDUE */}

              <button
                type="button"
                onClick={() => {
                  setTaskFilter("ค้างชำระ");
                  setStatusFilter("ทั้งหมด");
                }}
                className={`rounded-xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  taskFilter === "ค้างชำระ"
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">

                  <span className="text-sm font-medium text-slate-500">
                    Overdue
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                    ⚠️
                  </span>

                </div>

                <div className="mt-3 text-3xl font-bold text-red-600">
                  {loading
                    ? "..."
                    : overdueTasks.length.toLocaleString(
                        "th-TH"
                      )}
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Outstanding ≥ ฿100,000
                </p>
              </button>

              {/* HIGH RISK */}

              <button
                type="button"
                onClick={() => {
                  setTaskFilter("หนี้สูง");
                  setStatusFilter("ทั้งหมด");
                }}
                className={`rounded-xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  taskFilter === "หนี้สูง"
                    ? "border-amber-500 ring-1 ring-amber-500"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">

                  <span className="text-sm font-medium text-slate-500">
                    High Risk
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                    🔥
                  </span>

                </div>

                <div className="mt-3 text-3xl font-bold text-amber-600">
                  {loading
                    ? "..."
                    : highRiskAccounts.length.toLocaleString(
                        "th-TH"
                      )}
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Outstanding ≥ ฿100,000
                </p>
              </button>

              {/* TOTAL OUTSTANDING */}

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-medium text-slate-500">
                    Total Outstanding
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                    💰
                  </span>

                </div>

                <div className="mt-3 text-2xl font-bold text-slate-900">
                  {loading
                    ? "..."
                    : formatMoney(
                        totalOutstanding
                      )}
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Total outstanding balance
                </p>

              </div>

            </div>

            {/* =================================================
                SEARCH / FILTER
            ================================================= */}

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Collection Tasks
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Search and manage accounts that require collection follow-up
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

                {/* SEARCH */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Search
                  </label>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Customer / Customer No. / Account"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                {/* TASK */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Task
                  </label>

                  <select
                    value={taskFilter}
                    onChange={(e) =>
                      setTaskFilter(
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  >
                    <option value="ทั้งหมด">
                      All Tasks
                    </option>

                    <option value="วันนี้">
                      Due Today
                    </option>

                    <option value="ค้างชำระ">
                      Overdue
                    </option>

                    <option value="หนี้สูง">
                      High Risk
                    </option>
                  </select>
                </div>

                {/* STATUS */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Status
                  </label>

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  >
                    <option value="ทั้งหมด">
                      All Status
                    </option>

                    <option value="ACTIVE">
                      ACTIVE
                    </option>

                    <option value="INACTIVE">
                      INACTIVE
                    </option>

                    <option value="SUSPENDED">
                      SUSPENDED
                    </option>

                    <option value="CLOSED">
                      CLOSED
                    </option>

                    <option value="WRITTEN_OFF">
                      WRITTEN_OFF
                    </option>
                  </select>
                </div>

              </div>

              <div className="mt-4 flex justify-end">

                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Clear Filters
                </button>

              </div>

            </section>

            {/* =================================================
                COLLECTION QUEUE
            ================================================= */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 px-5 py-4">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Collection Queue
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {loading
                        ? "กำลังโหลด..."
                        : `${filteredAccounts.length.toLocaleString(
                            "th-TH"
                          )} accounts found`}
                    </p>
                  </div>

                  {(search ||
                    statusFilter !==
                      "ทั้งหมด" ||
                    taskFilter !==
                      "ทั้งหมด") && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      Filtered
                    </span>
                  )}

                </div>

              </div>

              {error ? (
                <div className="px-5 py-12 text-center">

                  <div className="text-3xl">
                    ⚠️
                  </div>

                  <p className="mt-3 text-sm font-medium text-red-600">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={loadAccounts}
                    className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Try Again
                  </button>

                </div>
              ) : (
                <div className="overflow-x-auto">

                  <table className="min-w-full text-sm">

                    <thead className="bg-slate-50">

                      <tr className="border-b border-slate-200">

                        <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          #
                        </th>

                        <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Customer
                        </th>

                        <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Customer No.
                        </th>

                        <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Account
                        </th>

                        <th className="whitespace-nowrap px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Outstanding
                        </th>

                        <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Due Date
                        </th>

                        <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Task
                        </th>

                        <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Status
                        </th>

                        <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {loading ? (
                        <tr>
                          <td
                            colSpan="9"
                            className="px-5 py-12 text-center text-slate-500"
                          >
                            <div className="text-2xl">
                              ⏳
                            </div>

                            <div className="mt-2 text-sm">
                              กำลังโหลด Collection Tasks...
                            </div>
                          </td>
                        </tr>
                      ) : filteredAccounts.length === 0 ? (
                        <tr>
                          <td
                            colSpan="9"
                            className="px-5 py-12 text-center"
                          >
                            <div className="text-3xl">
                              📭
                            </div>

                            <div className="mt-2 text-sm font-medium text-slate-700">
                              No collection tasks found
                            </div>

                            <div className="mt-1 text-xs text-slate-400">
                              ลองเปลี่ยน Filter หรือค้นหาใหม่
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredAccounts.map(
                          (account, index) => (
                            <tr
                              key={
                                account.id ||
                                account.cust_no ||
                                index
                              }
                              className="transition hover:bg-slate-50"
                            >

                              <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                                {index + 1}
                              </td>

                              <td className="whitespace-nowrap px-5 py-4">
                                <div>

                                  <strong className="font-semibold text-slate-900">
                                    {account.name ||
                                      "-"}
                                  </strong>

                                  {account.dpd >
                                    0 && (
                                    <div className="mt-1 text-xs text-slate-400">
                                      DPD:{" "}
                                      {account.dpd}
                                    </div>
                                  )}

                                </div>
                              </td>

                              <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                                {account.cust_no ||
                                  "-"}
                              </td>

                              <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                                {account.account ||
                                  "-"}
                              </td>

                              <td
                                className={`whitespace-nowrap px-5 py-4 text-right font-semibold ${
                                  Number(
                                    account.balance
                                  ) >= 100000
                                    ? "text-red-600"
                                    : "text-slate-700"
                                }`}
                              >
                                {formatMoney(
                                  account.balance
                                )}
                              </td>

                              <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                                {formatDate(
                                  account.due
                                )}
                              </td>

                              <td className="whitespace-nowrap px-5 py-4">
                                {getTaskBadge(
                                  account
                                )}
                              </td>

                              <td className="whitespace-nowrap px-5 py-4">

                                <span
                                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                                    account.status
                                  )}`}
                                >
                                  {account.status ||
                                    "-"}
                                </span>

                              </td>

                              <td className="whitespace-nowrap px-5 py-4">

                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(
                                      `/accounts/${account.cust_no}`
                                    )
                                  }
                                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-900 hover:text-white"
                                >
                                  View Account
                                </button>

                              </td>

                            </tr>
                          )
                        )
                      )}

                    </tbody>

                  </table>

                </div>
              )}

            </section>

          </div>

        </main>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">
          DebtCollect Pro
          <span className="mx-2">|</span>
          K-Bank Debt Management CRM
        </footer>

      </div>
    </div>
  );
}

export default Collections;
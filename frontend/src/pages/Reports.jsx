import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";

function Reports() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:4000/api/accounts", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`โหลดข้อมูลไม่สำเร็จ (${response.status})`);
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
        const customer = item.customer || item.customer_info || {};
        const balances = item.balances || item.balance || {};
        const details = item.details || {};
        const payment = item.payment || {};

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
        };
      });

      setAccounts(formattedAccounts);
    } catch (err) {
      console.error("Load reports error:", err);
      setError(err.message || "ไม่สามารถโหลดข้อมูล Report ได้");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // =========================
  // STATISTICS
  // =========================

  const totalAccounts = accounts.length;

  const totalOutstanding = accounts.reduce(
    (total, account) => total + Number(account.balance || 0),
    0
  );

  const overdueAccounts = accounts.filter(
    (account) => Number(account.balance || 0) >= 100000
  );

  const todayAccounts = accounts.filter((account) => {
    if (!account.due) return false;

    const date = new Date(account.due);

    if (Number.isNaN(date.getTime())) return false;

    const today = new Date();

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  });

  // =========================
  // STATUS SUMMARY
  // =========================

  const statusSummary = useMemo(() => {
    const summary = {};

    accounts.forEach((account) => {
      const status = account.status || "UNKNOWN";

      if (!summary[status]) {
        summary[status] = {
          count: 0,
          balance: 0,
        };
      }

      summary[status].count += 1;
      summary[status].balance += Number(account.balance || 0);
    });

    return Object.entries(summary).sort(
      (a, b) => b[1].count - a[1].count
    );
  }, [accounts]);

  // =========================
  // FILTER
  // =========================

  const filteredAccounts = useMemo(() => {
    if (statusFilter === "ทั้งหมด") {
      return accounts;
    }

    return accounts.filter(
      (account) => account.status === statusFilter
    );
  }, [accounts, statusFilter]);

  // =========================
  // FORMAT
  // =========================

  const formatMoney = (amount) => {
    return `฿${Number(amount || 0).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
const formatDate = (date) => {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const year = parsed.getFullYear();

  return `${day}/${month}/${year}`;
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

  // =========================
  // EXPORT CSV
  // =========================

  const exportCSV = () => {
    if (filteredAccounts.length === 0) {
      alert("ไม่มีข้อมูลสำหรับ Export");
      return;
    }

    const headers = [
      "Customer Name",
      "Customer No.",
      "Account",
      "Outstanding",
      "Status",
      "Due Date",
    ];

const rows = filteredAccounts.map((account) => [
  account.name,
  account.cust_no,
  account.account,
  account.balance,
  account.status,
  account.due ? `="${formatDate(account.due)}"` : "-",
]);
    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      ["\uFEFF" + csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `debtcollect-report-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    link.click();

    URL.revokeObjectURL(url);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-slate-900">
              DebtCollect Pro
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Reports
            </span>
          </div>

          <button
            type="button"
            onClick={loadAccounts}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ↻ Refresh
          </button>
        </header>

        {/* CONTENT */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">

            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Collection Reports
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Debt collection performance and account overview
                </p>
              </div>

              <button
                type="button"
                onClick={exportCSV}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                ↓ Export CSV
              </button>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {/* TOTAL */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Total Accounts
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                    📋
                  </span>
                </div>

                <div className="mt-3 text-3xl font-bold text-slate-900">
                  {loading ? "..." : totalAccounts.toLocaleString("th-TH")}
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Accounts in system
                </p>
              </div>

              {/* TODAY */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Today's Tasks
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                    📅
                  </span>
                </div>

                <div className="mt-3 text-3xl font-bold text-slate-900">
                  {loading ? "..." : todayAccounts.length}
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Due today
                </p>
              </div>

              {/* OVERDUE */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Overdue Accounts
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                    ⚠️
                  </span>
                </div>

                <div className="mt-3 text-3xl font-bold text-red-600">
                  {loading ? "..." : overdueAccounts.length}
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Outstanding ≥ ฿100,000
                </p>
              </div>

              {/* OUTSTANDING */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Total Outstanding
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                    💰
                  </span>
                </div>

                <div className="mt-3 text-3xl font-bold text-slate-900">
                  {loading ? "..." : formatMoney(totalOutstanding)}
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Outstanding balance
                </p>
              </div>
            </div>

            {/* STATUS REPORT */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Account Status Summary
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Account distribution by current status
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {statusSummary.map(([status, data]) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setStatusFilter(
                        statusFilter === status ? "ทั้งหมด" : status
                      )
                    }
                    className={`rounded-lg border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${
                      statusFilter === status
                        ? "border-slate-900 ring-1 ring-slate-900"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                          status
                        )}`}
                      >
                        {status}
                      </span>

                      <span className="text-lg font-bold text-slate-900">
                        {data.count}
                      </span>
                    </div>

                    <div className="mt-3 text-sm font-semibold text-slate-800">
                      {formatMoney(data.balance)}
                    </div>

                    <div className="mt-1 text-xs text-slate-400">
                      Outstanding
                    </div>
                  </button>
                ))}

                {statusSummary.length === 0 && !loading && (
                  <div className="col-span-full py-6 text-center text-sm text-slate-500">
                    No status data available
                  </div>
                )}
              </div>
            </section>

            {/* REPORT TABLE */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Account Report
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {loading
                      ? "กำลังโหลดข้อมูล..."
                      : `${filteredAccounts.length.toLocaleString(
                          "th-TH"
                        )} accounts`}
                  </p>
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="ทั้งหมด">ทุก Status</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="WRITTEN_OFF">
                    WRITTEN_OFF
                  </option>
                </select>
              </div>

              {error ? (
                <div className="px-5 py-10 text-center text-sm text-red-600">
                  {error}
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
                          Status
                        </th>

                        <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Due Date
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-5 py-10 text-center text-slate-500"
                          >
                            กำลังโหลดข้อมูล Report...
                          </td>
                        </tr>
                      ) : filteredAccounts.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-5 py-10 text-center text-slate-500"
                          >
                            No accounts found
                          </td>
                        </tr>
                      ) : (
                        filteredAccounts.map((account, index) => (
                          <tr
                            key={account.id || account.cust_no || index}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                              {index + 1}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4">
                              <strong className="font-semibold text-slate-900">
                                {account.name || "-"}
                              </strong>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                              {account.cust_no || "-"}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                              {account.account || "-"}
                            </td>

                            <td
                              className={`whitespace-nowrap px-5 py-4 text-right font-semibold ${
                                Number(account.balance) >= 100000
                                  ? "text-red-600"
                                  : "text-slate-700"
                              }`}
                            >
                              {formatMoney(account.balance)}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4">
                              <span
                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                                  account.status
                                )}`}
                              >
                                {account.status || "-"}
                              </span>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                              {formatDate(account.due)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">
          DebtCollect Pro
          <span className="mx-2">|</span>
          K-Bank Debt Management CRM
        </footer>
      </div>
    </div>
  );
}

export default Reports;
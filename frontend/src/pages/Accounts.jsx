import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Accounts() {
  const navigate = useNavigate();

  // =====================================================
  // ACCOUNTS
  // =====================================================

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FILTERS
  // =====================================================

  const [search, setSearch] = useState("");
  const [acctMarkFilter, setAcctMarkFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [debtorTypeFilter, setDebtorTypeFilter] = useState("ALL");

  // =====================================================
  // SIDEBAR
  // =====================================================

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =====================================================
  // LOAD ACCOUNTS
  // =====================================================

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:4000/api/accounts"
        );

        if (!response.ok) {
          throw new Error(
            `โหลดข้อมูล Accounts ไม่สำเร็จ (${response.status})`
          );
        }

        const data = await response.json();

        console.log("Accounts API:", data);

        // รองรับทั้ง
        // [...]
        // { accounts: [...] }
        // { data: [...] }

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
            item.payment_info ||
            {};

          return {
            cust_no:
              item.cust_no ||
              item.customer_no ||
              customer.cust_no ||
              "",

            name:
              item.name ||
              item.full_name ||
              customer.name ||
              "",

            acct_mark:
              item.acct_mark ||
              customer.acct_mark ||
              "",

            os_bal: Number(
              item.os_bal ??
                item.outstanding ??
                item.outstanding_balance ??
                balances.os_bal ??
                0
            ),

            // =================================================
            // ACCOUNT STATUS
            // =================================================

            status:
              item.status ||
              "ACTIVE",

            // =================================================
            // DEBTOR TYPE
            // NPL / YPL / YPN / NORMAL
            // =================================================

            debtor_type:
              item.debtor_type ||
              item.debtorType ||
              payment.debtor_type ||
              "",
          };
        });

        console.log(
          "Formatted Accounts:",
          formattedAccounts
        );

        setAccounts(formattedAccounts);
      } catch (err) {
        console.error(
          "Load accounts error:",
          err
        );

        setError(
          err.message ||
            "ไม่สามารถโหลดข้อมูล Accounts ได้"
        );

        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  // =====================================================
  // FILTER ACCOUNTS
  // =====================================================

  const filteredAccounts = accounts.filter((account) => {
    const keyword =
      search.trim().toLowerCase();

    // SEARCH

    const matchSearch =
      !keyword ||
      String(account.cust_no || "")
        .toLowerCase()
        .includes(keyword) ||
      String(account.name || "")
        .toLowerCase()
        .includes(keyword);

    // ACCTMARK

    const matchAcctMark =
      acctMarkFilter === "ALL" ||
      String(account.acct_mark || "")
        .toUpperCase() ===
        String(acctMarkFilter)
          .toUpperCase();

    // ACCOUNT STATUS

    const matchStatus =
      statusFilter === "ALL" ||
      String(account.status || "")
        .toUpperCase() ===
        String(statusFilter)
          .toUpperCase();

    // DEBTOR TYPE

    const matchDebtorType =
      debtorTypeFilter === "ALL" ||
      String(account.debtor_type || "")
        .toUpperCase() ===
        String(debtorTypeFilter)
          .toUpperCase();

    return (
      matchSearch &&
      matchAcctMark &&
      matchStatus &&
      matchDebtorType
    );
  });

  // =====================================================
  // ACCTMARK OPTIONS
  // =====================================================

  const acctMarkOptions = [
    ...new Set(
      accounts
        .map(
          (account) =>
            account.acct_mark
        )
        .filter(Boolean)
    ),
  ];

  // =====================================================
  // CLEAR FILTER
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setAcctMarkFilter("ALL");
    setStatusFilter("ALL");
    setDebtorTypeFilter("ALL");
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(
      status || ""
    ).toUpperCase();

    if (value === "ACTIVE") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }

    if (value === "INACTIVE") {
      return "bg-gray-100 text-gray-600 border border-gray-200";
    }

    if (value === "SUSPENDED") {
      return "bg-amber-50 text-amber-700 border border-amber-200";
    }

    if (value === "CLOSED") {
      return "bg-red-50 text-red-700 border border-red-200";
    }

    if (value === "WRITTEN_OFF") {
      return "bg-purple-50 text-purple-700 border border-purple-200";
    }

    return "bg-gray-50 text-gray-600 border border-gray-200";
  };

  // =====================================================
  // DEBTOR TYPE STYLE
  // =====================================================

  const getDebtorTypeStyle = (type) => {
    const value = String(
      type || ""
    ).toUpperCase();

    if (value === "NPL") {
      return "bg-red-50 text-red-700 border border-red-200";
    }

    if (value === "YPL") {
      return "bg-orange-50 text-orange-700 border border-orange-200";
    }

    if (value === "YPN") {
      return "bg-blue-50 text-blue-700 border border-blue-200";
    }

    if (value === "NORMAL") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }

    return "bg-gray-50 text-gray-600 border border-gray-200";
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

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
          MAIN
      ================================================= */}

      <div className="min-h-screen lg:ml-[240px]">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">

          <div className="flex items-center gap-3">

            {/* MOBILE MENU */}

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
            >
              ☰
            </button>

            <span className="text-lg font-bold text-slate-900">
              DebtCollect Pro
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Accounts
            </span>

          </div>

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Accounts
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Customer accounts
              </p>

            </div>

            <div className="flex items-center">

              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                {loading
                  ? "Loading..."
                  : `${filteredAccounts.length} / ${accounts.length} Accounts`}
              </span>

            </div>

          </div>

          {/* =================================================
              FILTER CARD
          ================================================= */}

          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-4">

              <h2 className="text-base font-semibold text-slate-900">
                Account Filters
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Search and filter customer accounts
              </p>

            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

              {/* SEARCH */}

              <div className="xl:col-span-2">

                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Search
                </label>

                <input
                  type="text"
                  placeholder="Search Cusno or Customer..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

              </div>

              {/* ACCTMARK */}

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  ACCTMark
                </label>

                <select
                  value={
                    acctMarkFilter
                  }
                  onChange={(e) =>
                    setAcctMarkFilter(
                      e.target.value
                    )
                  }
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >

                  <option value="ALL">
                    All ACCTMark
                  </option>

                  {acctMarkOptions.map(
                    (mark) => (
                      <option
                        key={mark}
                        value={mark}
                      >
                        {mark}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* STATUS */}

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Status
                </label>

                <select
                  value={
                    statusFilter
                  }
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >

                  <option value="ALL">
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

              {/* DEBTOR TYPE */}

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Debtor Type
                </label>

                <select
                  value={
                    debtorTypeFilter
                  }
                  onChange={(e) =>
                    setDebtorTypeFilter(
                      e.target.value
                    )
                  }
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >

                  <option value="ALL">
                    All Debtor Type
                  </option>

                  <option value="NORMAL">
                    NORMAL
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

                </select>

              </div>

            </div>

            {/* FILTER ACTIONS */}

            <div className="mt-5 flex justify-end">

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="h-10 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Clear
              </button>

            </div>

          </div>

          {/* =================================================
              TABLE CARD
          ================================================= */}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            {/* TABLE HEADER */}

            <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-base font-semibold text-slate-900">
                  Customer Accounts
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Showing filtered customer accounts
                </p>

              </div>

              <span className="text-sm text-slate-500">
                {loading
                  ? "Loading..."
                  : `${filteredAccounts.length} records`}
              </span>

            </div>

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-x-auto">

              <table className="min-w-[950px] w-full text-left text-sm">

                <thead className="bg-slate-50">

                  <tr className="border-b border-slate-200">

                    <th className="whitespace-nowrap px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Cusno
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      ACCTMark
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      Outstanding
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Debtor Type
                    </th>

                    <th className="whitespace-nowrap px-5 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {/* =================================================
                      LOADING
                  ================================================= */}

                  {loading && (

                    <tr>

                      <td
                        colSpan="7"
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        <div className="flex flex-col items-center justify-center gap-3">

                          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

                          <span>
                            กำลังโหลดข้อมูล Accounts...
                          </span>

                        </div>
                      </td>

                    </tr>

                  )}

                  {/* =================================================
                      ERROR
                  ================================================= */}

                  {!loading && error && (

                    <tr>

                      <td
                        colSpan="7"
                        className="px-5 py-12 text-center"
                      >

                        <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                          {error}
                        </div>

                      </td>

                    </tr>

                  )}

                  {/* =================================================
                      NO DATA
                  ================================================= */}

                  {!loading &&
                    !error &&
                    filteredAccounts.length === 0 && (

                    <tr>

                      <td
                        colSpan="7"
                        className="px-5 py-12 text-center"
                      >

                        <div className="flex flex-col items-center">

                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                            📋
                          </div>

                          <div className="font-semibold text-slate-700">
                            {accounts.length === 0
                              ? "No accounts found"
                              : "No accounts match the filters"}
                          </div>

                          <div className="mt-1 text-xs text-slate-400">
                            Try changing your search or filters
                          </div>

                        </div>

                      </td>

                    </tr>

                  )}

                  {/* =================================================
                      REAL DATA
                  ================================================= */}

                  {!loading &&
                    !error &&
                    filteredAccounts.map(
                      (account, index) => (

                      <tr
                        key={
                          account.cust_no ||
                          index
                        }
                        className="transition hover:bg-slate-50"
                      >

                        {/* CUSNO */}

                        <td className="whitespace-nowrap px-5 py-4">

                          <span className="font-mono text-sm font-semibold text-slate-700">
                            {account.cust_no ||
                              "-"}
                          </span>

                        </td>

                        {/* CUSTOMER */}

                        <td className="px-5 py-4">

                          <div className="font-semibold text-slate-900">
                            {account.name ||
                              "-"}
                          </div>

                        </td>

                        {/* ACCTMARK */}

                        <td className="px-5 py-4">

                          <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {account.acct_mark ||
                              "-"}
                          </span>

                        </td>

                        {/* OUTSTANDING */}

                        <td className="whitespace-nowrap px-5 py-4 text-right">

                          <span
                            className={`font-semibold ${
                              Number(
                                account.os_bal ||
                                  0
                              ) >= 100000
                                ? "text-red-600"
                                : "text-slate-800"
                            }`}
                          >
                            ฿
                            {Number(
                              account.os_bal ||
                                0
                            ).toLocaleString(
                              "th-TH",
                              {
                                minimumFractionDigits:
                                  2,
                                maximumFractionDigits:
                                  2,
                              }
                            )}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                              account.status
                            )}`}
                          >
                            {account.status ||
                              "-"}
                          </span>

                        </td>

                        {/* DEBTOR TYPE */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getDebtorTypeStyle(
                              account.debtor_type
                            )}`}
                          >
                            {account.debtor_type ||
                              "-"}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4 text-center">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/accounts/${account.cust_no}`
                              )
                            }
                            className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-slate-700 active:scale-95"
                          >
                            View
                          </button>

                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>

          </div>

        </main>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-400">

          DebtCollect Pro
          <span className="mx-2">
            |
          </span>
          K-Bank Debt Management CRM

        </footer>

      </div>

    </div>
  );
}

export default Accounts;
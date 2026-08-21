import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [accountsError, setAccountsError] = useState("");

  const [selectedCard, setSelectedCard] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [search, setSearch] = useState({
    name: "",
    custNo: "",
    account: "",
    status: "ทั้งหมด",
  });

  // =====================================================
  // LOAD ACCOUNTS
  // =====================================================

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setLoadingAccounts(true);
        setAccountsError("");

        const response = await fetch(
          "http://localhost:4000/api/accounts"
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

          const dueAmount =
            item.due_amount ??
            payment.due_amount ??
            0;

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
  dueAmount: Number(dueAmount) || 0,
  due,
  status: String(status).toUpperCase(),
  dpd: Number(
    item.dpd ||
    details.dpd ||
    0
  ),
  max_bucket:
    item.max_bucket ||
    details.max_bucket ||
    "",
  bucket:
    item.bucket ||
    details.bucket ||
    "",
  raw: item,
};
        });

        setAccounts(formattedAccounts);
      } catch (error) {
        console.error("Load accounts error:", error);

        setAccountsError(
          error.message ||
            "ไม่สามารถโหลดข้อมูล Accounts ได้"
        );

        setAccounts([]);
      } finally {
        setLoadingAccounts(false);
      }
    };

    loadAccounts();
  }, []);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalAccounts = accounts.length;
const overdueAccounts = accounts.filter(
  (account) =>
    Number(account.balance || 0) >= 100000
);

  const totalOutstanding = accounts.reduce(
    (total, account) =>
      total + Number(account.balance || 0),
    0
  );

  // =====================================================
  // TODAY
  // =====================================================

  const isToday = (date) => {
    if (!date) return false;

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return false;
    }

    const today = new Date();

    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  const todayAccounts = accounts.filter((account) =>
    isToday(account.due)
  );

  // =====================================================
  // CARD CLICK
  // =====================================================

  const handleCardClick = (card) => {
    setSelectedCard(card);

    setTimeout(() => {
      document
        .getElementById("search-results")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredAccounts = accounts.filter((account) => {
    const nameMatch =
      String(account.name || "")
        .toLowerCase()
        .includes(search.name.toLowerCase());

    const custNoMatch =
      String(account.cust_no || "")
        .toLowerCase()
        .includes(search.custNo.toLowerCase());

    const accountMatch =
      String(account.account || "")
        .toLowerCase()
        .includes(search.account.toLowerCase());

    const statusMatch =
  search.status === "ทั้งหมด" ||
  String(account.status || "").toUpperCase() ===
    String(search.status || "").toUpperCase();
    let cardMatch = true;

    if (selectedCard === "today") {
      cardMatch = isToday(account.due);
      } else if (selectedCard === "overdue") {
        cardMatch =
          account.status === "ค้างชำระสูง" ||
          Number(account.balance) >= 100000;
    } else if (selectedCard === "outstanding") {
      cardMatch = Number(account.balance) > 0;
    }

    return (
      nameMatch &&
      custNoMatch &&
      accountMatch &&
      statusMatch &&
      cardMatch
    );
  });

  // =====================================================
  // CLEAR
  // =====================================================

  const clearSearch = () => {
    setSearch({
      name: "",
      custNo: "",
      account: "",
      status: "ทั้งหมด",
    });

    setSelectedCard(null);
    setHasSearched(false);
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = () => {
    setHasSearched(true);

    setTimeout(() => {
      document
        .getElementById("search-results")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  // =====================================================
  // FORMAT
  // =====================================================

  const formatMoney = (amount) => {
    const value = Number(amount || 0);

    if (value >= 1000000) {
      return `฿${(value / 1000000).toFixed(1)}M`;
    }

    if (value >= 1000) {
      return `฿${(value / 1000).toFixed(1)}K`;
    }

    return `฿${value.toLocaleString("th-TH")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return String(date);
    }

    return parsed.toLocaleDateString("th-TH");
  };

  const getResultTitle = () => {
    switch (selectedCard) {
      case "today":
        return "Today's Tasks";
      case "overdue":
        return "Overdue Accounts";
      case "outstanding":
        return "Total Outstanding";
      default:
        return "All Accounts";
    }
  };
// =====================================================
// STATUS STYLE
// =====================================================

const getStatusStyle = (status) => {
  const value = String(status || "").toUpperCase();

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
  // RENDER
  // =====================================================

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-6">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-slate-900">
              DebtCollect Pro
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Dashboard
            </span>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Dashboard
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Debt Management Overview
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/accounts")}
                className="
                  inline-flex items-center justify-center
                  rounded-lg bg-slate-900
                  px-4 py-2.5
                  text-sm font-semibold text-white
                  shadow-sm
                  transition
                  hover:bg-slate-800
                "
              >
                View Accounts
              </button>
            </div>

            {/* STATISTICS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {/* TOTAL */}
              <button
                type="button"
                onClick={() => handleCardClick("all")}
                className={`
                  group rounded-xl border bg-white p-5
                  text-left shadow-sm
                  transition
                  hover:-translate-y-0.5 hover:shadow-md
                  ${
                    selectedCard === "all"
                      ? "border-slate-900 ring-1 ring-slate-900"
                      : "border-slate-200"
                  }
                `}
              >
                <div className="text-sm font-medium text-slate-500">
                  Total Accounts
                </div>

                <div className="mt-2 text-3xl font-bold text-slate-900">
                  {loadingAccounts
                    ? "..."
                    : totalAccounts.toLocaleString("th-TH")}
                </div>

                <div className="mt-2 text-xs text-slate-400">
                  Accounts in system
                </div>
              </button>

              {/* TODAY */}
              <button
                type="button"
                onClick={() => handleCardClick("today")}
                className={`
                  group rounded-xl border bg-white p-5
                  text-left shadow-sm
                  transition
                  hover:-translate-y-0.5 hover:shadow-md
                  ${
                    selectedCard === "today"
                      ? "border-slate-900 ring-1 ring-slate-900"
                      : "border-slate-200"
                  }
                `}
              >
                <div className="text-sm font-medium text-slate-500">
                  Today's Tasks
                </div>

                <div className="mt-2 text-3xl font-bold text-slate-900">
                  {loadingAccounts
                    ? "..."
                    : todayAccounts.length.toLocaleString("th-TH")}
                </div>

                <div className="mt-2 text-xs text-slate-400">
                  Collection tasks
                </div>
              </button>

              {/* OVERDUE */}
              <button
                type="button"
                onClick={() => handleCardClick("overdue")}
                className={`
                  group rounded-xl border bg-white p-5
                  text-left shadow-sm
                  transition
                  hover:-translate-y-0.5 hover:shadow-md
                  ${
                    selectedCard === "overdue"
                      ? "border-red-600 ring-1 ring-red-600"
                      : "border-slate-200"
                  }
                `}
              >
                <div className="text-sm font-medium text-slate-500">
                  Overdue Accounts
                </div>

                <div className="mt-2 text-3xl font-bold text-red-600">
                  {loadingAccounts
                    ? "..."
                    : overdueAccounts.length.toLocaleString("th-TH")}
                </div>

                <div className="mt-2 text-xs text-slate-400">
                  Need attention
                </div>
              </button>

              {/* OUTSTANDING */}
              <button
                type="button"
                onClick={() => handleCardClick("outstanding")}
                className={`
                  group rounded-xl border bg-white p-5
                  text-left shadow-sm
                  transition
                  hover:-translate-y-0.5 hover:shadow-md
                  ${
                    selectedCard === "outstanding"
                      ? "border-slate-900 ring-1 ring-slate-900"
                      : "border-slate-200"
                  }
                `}
              >
                <div className="text-sm font-medium text-slate-500">
                  Total Outstanding
                </div>

                <div className="mt-2 text-3xl font-bold text-slate-900">
                  {loadingAccounts
                    ? "..."
                    : formatMoney(totalOutstanding)}
                </div>

                <div className="mt-2 text-xs text-slate-400">
                  Outstanding balance
                </div>
              </button>
            </div>

            {/* MAIN PANELS */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* QUICK ACTIONS */}
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">
                  Quick Actions
                </h2>

                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => navigate("/accounts")}
                    className="
                      flex w-full items-center gap-3
                      rounded-lg border border-slate-200
                      p-3 text-left
                      transition
                      hover:bg-slate-50
                    "
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">
                      📋
                    </span>

                    <span>
                      <strong className="block text-sm font-semibold text-slate-900">
                        Accounts
                      </strong>

                      <small className="mt-0.5 block text-xs text-slate-500">
                        View customer accounts
                      </small>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/collections")}
                    className="
                      flex w-full items-center gap-3
                      rounded-lg border border-slate-200
                      p-3 text-left
                      transition
                      hover:bg-slate-50
                    "
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">
                      📞
                    </span>

                    <span>
                      <strong className="block text-sm font-semibold text-slate-900">
                        Collections
                      </strong>

                      <small className="mt-0.5 block text-xs text-slate-500">
                        Manage collection tasks
                      </small>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/reports")}
                    className="
                      flex w-full items-center gap-3
                      rounded-lg border border-slate-200
                      p-3 text-left
                      transition
                      hover:bg-slate-50
                    "
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">
                      📊
                    </span>

                    <span>
                      <strong className="block text-sm font-semibold text-slate-900">
                        Reports
                      </strong>

                      <small className="mt-0.5 block text-xs text-slate-500">
                        View collection reports
                      </small>
                    </span>
                  </button>
                </div>
              </section>

              {/* RECENT TASKS */}
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">
                  Recent Collection Tasks
                </h2>

                <div className="mt-4 divide-y divide-slate-100">
                  {accounts.slice(0, 3).map((account, index) => (
                    <div
                      key={account.cust_no || index}
                      className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <strong className="block truncate text-sm font-semibold text-slate-900">
                          Customer {account.cust_no}
                        </strong>

                        <span className="mt-1 block text-xs text-slate-500">
                          Follow-up call
                        </span>
                      </div>

                      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        Pending
                      </span>
                    </div>
                  ))}

                  {!loadingAccounts && accounts.length === 0 && (
                    <div className="py-8 text-center text-sm text-slate-500">
                      No recent tasks
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* SEARCH */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">
                Search Accounts
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* NAME */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    placeholder="Search customer..."
                    value={search.name}
                    onChange={(e) =>
                      setSearch({
                        ...search,
                        name: e.target.value,
                      })
                    }
                    className="
                      w-full rounded-lg
                      border border-slate-300
                      bg-white px-3 py-2.5
                      text-sm text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      focus:border-slate-900
                      focus:ring-2 focus:ring-slate-900/10
                    "
                  />
                </div>

                {/* CUSTOMER NO */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Customer No.
                  </label>

                  <input
                    type="text"
                    placeholder="0000553349"
                    value={search.custNo}
                    onChange={(e) =>
                      setSearch({
                        ...search,
                        custNo: e.target.value,
                      })
                    }
                    className="
                      w-full rounded-lg
                      border border-slate-300
                      bg-white px-3 py-2.5
                      text-sm text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      focus:border-slate-900
                      focus:ring-2 focus:ring-slate-900/10
                    "
                  />
                </div>

                {/* ACCOUNT */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Account
                  </label>

                  <input
                    type="text"
                    placeholder="ACC: 098-765-4321"
                    value={search.account}
                    onChange={(e) =>
                      setSearch({
                        ...search,
                        account: e.target.value,
                      })
                    }
                    className="
                      w-full rounded-lg
                      border border-slate-300
                      bg-white px-3 py-2.5
                      text-sm text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      focus:border-slate-900
                      focus:ring-2 focus:ring-slate-900/10
                    "
                  />
                </div>

                {/* STATUS */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Status
                  </label>

                 <select
  value={search.status}
  onChange={(e) =>
    setSearch({
      ...search,
      status: e.target.value,
    })
  }
  className="
    w-full rounded-lg
    border border-slate-300
    bg-white px-3 py-2.5
    text-sm text-slate-900
    outline-none
    focus:border-slate-900
    focus:ring-2 focus:ring-slate-900/10
  "
>
  <option value="ทั้งหมด">ทั้งหมด</option>
  <option value="ACTIVE">ACTIVE</option>
  <option value="INACTIVE">INACTIVE</option>
  <option value="SUSPENDED">SUSPENDED</option>
  <option value="CLOSED">CLOSED</option>
  <option value="WRITTEN_OFF">WRITTEN_OFF</option>
</select>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={clearSearch}
                  className="
                    rounded-lg border border-slate-300
                    bg-white px-4 py-2.5
                    text-sm font-medium text-slate-700
                    transition
                    hover:bg-slate-50
                  "
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="
                    rounded-lg bg-slate-900
                    px-4 py-2.5
                    text-sm font-semibold text-white
                    transition
                    hover:bg-slate-800
                  "
                >
                  Search
                </button>
              </div>
            </section>

            {/* RESULTS */}
            <section
              id="search-results"
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-900">
                  Search Results
                </h2>

                <div className="mt-1 text-sm text-slate-500">
                  {loadingAccounts
                    ? "กำลังโหลด..."
                    : !hasSearched && selectedCard === null
                    ? "ค้นหา Account หรือเลือก Dashboard Card"
                    : `${filteredAccounts.length} accounts found`}

                  {selectedCard !== null &&
                    !loadingAccounts && (
                      <span className="ml-2 text-slate-400">
                        ({getResultTitle()})
                      </span>
                    )}
                </div>
              </div>

              {(hasSearched || selectedCard !== null) && (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200">
                        {[
                          "#",
                          "Customer",
                          "Customer No.",
                          "Account",
                          "Outstanding",
                          "Status",
                          "Due Date",
                          "Action",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {loadingAccounts ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="px-5 py-10 text-center text-slate-500"
                          >
                            กำลังโหลดข้อมูล Accounts...
                          </td>
                        </tr>
                      ) : accountsError ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="px-5 py-10 text-center text-red-600"
                          >
                            {accountsError}
                          </td>
                        </tr>
                      ) : filteredAccounts.length === 0 ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="px-5 py-10 text-center text-slate-500"
                          >
                            No accounts found
                          </td>
                        </tr>
                      ) : (
                        filteredAccounts.map((account, index) => (
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
                              className={`
                                whitespace-nowrap px-5 py-4 font-medium
                                ${
                                  Number(account.balance) >= 100000
                                    ? "text-red-600"
                                    : "text-slate-700"
                                }
                              `}
                            >
                              ฿
                              {Number(
                                account.balance || 0
                              ).toLocaleString("th-TH", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4">
                              <span
                                className={`
                                  inline-flex rounded-full
                                  px-2.5 py-1
                                  text-xs font-medium
                                  ${getStatusStyle(account.status)}
                                `}
                              >
                                {account.status || "-"}
                              </span>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                              {formatDate(account.due)}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/accounts/${account.cust_no}`
                                  )
                                }
                                className="
                                  rounded-lg
                                  border border-slate-300
                                  bg-white px-3 py-1.5
                                  text-xs font-semibold
                                  text-slate-700
                                  transition
                                  hover:bg-slate-900
                                  hover:text-white
                                "
                              >
                                View
                              </button>
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

export default Dashboard;
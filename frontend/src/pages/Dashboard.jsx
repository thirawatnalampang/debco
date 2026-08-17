import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
function Dashboard() {
  const navigate = useNavigate();




  // =====================================================
  // ACCOUNTS
  // =====================================================

  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [accountsError, setAccountsError] = useState("");

  // =====================================================
  // SELECTED DASHBOARD CARD
  // =====================================================

const [selectedCard, setSelectedCard] = useState(null);
const [hasSearched, setHasSearched] = useState(false);
  // =====================================================
  // SEARCH
  // =====================================================

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

        // =================================================
        // FORMAT API DATA
        // =================================================

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

          // -------------------------------------------------
          // CUSTOMER NO
          // -------------------------------------------------

          const custNo =
            item.cust_no ||
            item.customer_no ||
            customer.cust_no ||
            "";

          // -------------------------------------------------
          // CUSTOMER NAME
          // -------------------------------------------------

          const name =
            item.name ||
            item.full_name ||
            customer.name ||
            "";

          // -------------------------------------------------
          // ACCOUNT
          // -------------------------------------------------

          const accountNo =
            item.account ||
            item.account_no ||
            item.acct_no ||
            item.account_number ||
            details.account ||
            item.acct_mark ||
            "";

          // -------------------------------------------------
          // OUTSTANDING
          //
          // API ของคุณมี:
          // os_bal
          // os_bal_cust
          // -------------------------------------------------

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

          // -------------------------------------------------
          // DUE DATE
          // -------------------------------------------------

          const due =
            item.due_date ||
            item.due ||
            payment.due_date ||
            "";

          // -------------------------------------------------
          // DUE AMOUNT
          // -------------------------------------------------

          const dueAmount =
            item.due_amount ??
            payment.due_amount ??
            0;

          // -------------------------------------------------
          // STATUS
          // -------------------------------------------------

          let status =
            item.status ||
            item.account_status ||
            item.status_flag ||
            payment.status ||
            "";

          if (!status) {
            const numericBalance =
              Number(balance || 0);

            if (numericBalance >= 100000) {
              status = "ค้างชำระสูง";
            } else if (numericBalance > 0) {
              status = "ติดตามชำระ";
            } else {
              status = "กำลังติดตาม";
            }
          }

          return {
            id: item.id,

            cust_no: String(custNo),

            name: String(name),

            account: String(accountNo),

            balance:
              Number(balance) || 0,

            dueAmount:
              Number(dueAmount) || 0,

            due: due,

            status: String(status),

            // เก็บข้อมูลไว้ใช้ต่อ
            dpd:
              Number(
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

        console.log(
          "Formatted Accounts:",
          formattedAccounts
        );

        setAccounts(
          formattedAccounts
        );

      } catch (error) {
        console.error(
          "Load accounts error:",
          error
        );

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
  // DASHBOARD STATISTICS
  // =====================================================

  const totalAccounts =
    accounts.length;

  const overdueAccounts =
    accounts.filter(
      (account) =>
        account.status ===
          "ค้างชำระสูง" ||
        Number(account.balance) >=
          100000
    );

  const totalOutstanding =
    accounts.reduce(
      (total, account) =>
        total +
        Number(
          account.balance || 0
        ),
      0
    );

  // =====================================================
  // TODAY'S TASKS
  //
  // ตอนนี้ใช้ Due Date = วันนี้
  // =====================================================

  const isToday = (date) => {
    if (!date) return false;

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return false;
    }

    const today = new Date();

    return (
      d.getFullYear() ===
        today.getFullYear() &&
      d.getMonth() ===
        today.getMonth() &&
      d.getDate() ===
        today.getDate()
    );
  };

  const todayAccounts =
    accounts.filter((account) =>
      isToday(account.due)
    );

  // =====================================================
  // CARD CLICK
  // =====================================================

  const handleCardClick = (
    card
  ) => {
    setSelectedCard(card);

    // เลื่อนลงไปที่ Search Results
    setTimeout(() => {
      document
        .getElementById(
          "search-results"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  // =====================================================
  // SEARCH FILTER
  // =====================================================
const filteredAccounts = accounts.filter((account) => {

  // =====================================================
  // SEARCH TEXT
  // =====================================================

  const nameMatch =
    String(account.name || "")
      .toLowerCase()
      .includes(
        search.name.toLowerCase()
      );

  const custNoMatch =
    String(account.cust_no || "")
      .toLowerCase()
      .includes(
        search.custNo.toLowerCase()
      );

  const accountMatch =
    String(account.account || "")
      .toLowerCase()
      .includes(
        search.account.toLowerCase()
      );

  const statusMatch =
    search.status === "ทั้งหมด" ||
    account.status === search.status;


  // =====================================================
  // CARD FILTER
  // =====================================================

  let cardMatch = true;

  if (selectedCard === "all") {

    cardMatch = true;

  } else if (selectedCard === "today") {

    cardMatch = isToday(account.due);

  } else if (selectedCard === "overdue") {

    cardMatch =
      account.status === "ค้างชำระสูง" ||
      Number(account.balance) >= 100000;

  } else if (selectedCard === "outstanding") {

    cardMatch =
      Number(account.balance) > 0;

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
  // CLEAR SEARCH
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
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (
    amount
  ) => {
    const value =
      Number(amount || 0);

    if (value >= 1000000) {
      return `฿${(
        value / 1000000
      ).toFixed(1)}M`;
    }

    if (value >= 1000) {
      return `฿${(
        value / 1000
      ).toFixed(1)}K`;
    }

    return `฿${value.toLocaleString(
      "th-TH"
    )}`;
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "-";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return String(date);
    }

    return parsed.toLocaleDateString(
      "th-TH"
    );
  };

  // =====================================================
  // CARD TITLE
  // =====================================================

  const getResultTitle = () => {
    switch (
      selectedCard
    ) {
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
  // RENDER
  // =====================================================

  return (
    <div className="app">

     
    <Sidebar />

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="main">

        {/* TOPBAR */}

        <div className="topbar">

          <div className="topbar-left">

           

            <span className="app-name">
              DebtCollect Pro
            </span>

            <span className="pill">
              Dashboard
            </span>

          </div>

        </div>


        {/* CONTENT */}

        <div className="content dashboard-content">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="case-header">

            <div>

              <div className="case-title">
                Dashboard
              </div>

              <div className="case-meta">
                Debt Management Overview
              </div>

            </div>

            <div className="case-badges">

              <button
                className="dashboard-primary-btn"
                onClick={() =>
                  navigate(
                    "/accounts"
                  )
                }
              >
                View Accounts
              </button>

            </div>

          </div>


          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="dashboard-grid">

            {/* =================================================
                TOTAL ACCOUNTS
            ================================================= */}

            <div
              className={`dashboard-card ${
                selectedCard ===
                "all"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleCardClick(
                  "all"
                )
              }
              style={{
                cursor:
                  "pointer",
              }}
            >

              <div className="dashboard-card-label">
                Total Accounts
              </div>

              <div className="dashboard-card-value">

                {loadingAccounts
                  ? "..."
                  : totalAccounts.toLocaleString(
                      "th-TH"
                    )}

              </div>

              <div className="dashboard-card-footer">
                Accounts in system
              </div>

            </div>


            {/* =================================================
                TODAY'S TASKS
            ================================================= */}

            <div
              className={`dashboard-card ${
                selectedCard ===
                "today"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleCardClick(
                  "today"
                )
              }
              style={{
                cursor:
                  "pointer",
              }}
            >

              <div className="dashboard-card-label">
                Today's Tasks
              </div>

              <div className="dashboard-card-value">

                {loadingAccounts
                  ? "..."
                  : todayAccounts.length.toLocaleString(
                      "th-TH"
                    )}

              </div>

              <div className="dashboard-card-footer">
                Collection tasks
              </div>

            </div>


            {/* =================================================
                OVERDUE
            ================================================= */}

            <div
              className={`dashboard-card ${
                selectedCard ===
                "overdue"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleCardClick(
                  "overdue"
                )
              }
              style={{
                cursor:
                  "pointer",
              }}
            >

              <div className="dashboard-card-label">
                Overdue Accounts
              </div>

              <div className="dashboard-card-value dashboard-danger">

                {loadingAccounts
                  ? "..."
                  : overdueAccounts.length.toLocaleString(
                      "th-TH"
                    )}

              </div>

              <div className="dashboard-card-footer">
                Need attention
              </div>

            </div>


            {/* =================================================
                TOTAL OUTSTANDING
            ================================================= */}

            <div
              className={`dashboard-card ${
                selectedCard ===
                "outstanding"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                handleCardClick(
                  "outstanding"
                )
              }
              style={{
                cursor:
                  "pointer",
              }}
            >

              <div className="dashboard-card-label">
                Total Outstanding
              </div>

              <div className="dashboard-card-value dashboard-money">

                {loadingAccounts
                  ? "..."
                  : formatMoney(
                      totalOutstanding
                    )}

              </div>

              <div className="dashboard-card-footer">
                Outstanding balance
              </div>

            </div>

          </div>


          {/* =================================================
              MAIN PANELS
          ================================================= */}

          <div className="dashboard-main-grid">

            {/* QUICK ACTIONS */}

            <div className="panel">

              <h4>
                Quick Actions
              </h4>

              <div className="quick-actions">

                <button
                  className="quick-action-btn"
                  onClick={() =>
                    navigate(
                      "/accounts"
                    )
                  }
                >

                  <span className="quick-action-icon">
                    📋
                  </span>

                  <span>

                    <strong>
                      Accounts
                    </strong>

                    <small>
                      View customer accounts
                    </small>

                  </span>

                </button>


                <button className="quick-action-btn">

                  <span className="quick-action-icon">
                    📞
                  </span>

                  <span>

                    <strong>
                      Collections
                    </strong>

                    <small>
                      Manage collection tasks
                    </small>

                  </span>

                </button>


                <button className="quick-action-btn">

                  <span className="quick-action-icon">
                    📊
                  </span>

                  <span>

                    <strong>
                      Reports
                    </strong>

                    <small>
                      View collection reports
                    </small>

                  </span>

                </button>

              </div>

            </div>


            {/* RECENT TASKS */}

            <div className="panel">

              <h4>
                Recent Collection Tasks
              </h4>

              <div className="dashboard-task-list">

                {accounts
                  .slice(0, 3)
                  .map(
                    (
                      account,
                      index
                    ) => (

                      <div
                        className="dashboard-task"
                        key={
                          account.cust_no ||
                          index
                        }
                      >

                        <div>

                          <strong>
                            Customer{" "}
                            {
                              account.cust_no
                            }
                          </strong>

                          <span>
                            Follow-up call
                          </span>

                        </div>

                        <span className="badge-acctmark-solid">
                          Pending
                        </span>

                      </div>

                    )
                  )}

                {!loadingAccounts &&
                  accounts.length ===
                    0 && (

                    <div
                      style={{
                        padding:
                          "20px",
                        textAlign:
                          "center",
                        color:
                          "#6b7280",
                      }}
                    >
                      No recent tasks
                    </div>

                  )}

              </div>

            </div>

          </div>


          {/* =================================================
              SEARCH ACCOUNTS
          ================================================= */}

          <div className="panel dashboard-search-panel">

            <h4>
              Search Accounts
            </h4>

            <div className="dashboard-search-grid">

              {/* NAME */}

              <div className="dashboard-search-field">

                <label>
                  Customer Name
                </label>

                <input
                  type="text"
                  placeholder="Search customer..."
                  value={
                    search.name
                  }
                  onChange={(e) =>
                    setSearch({
                      ...search,
                      name:
                        e.target.value,
                    })
                  }
                />

              </div>


              {/* CUSTOMER NO */}

              <div className="dashboard-search-field">

                <label>
                  Customer No.
                </label>

                <input
                  type="text"
                  placeholder="0000553349"
                  value={
                    search.custNo
                  }
                  onChange={(e) =>
                    setSearch({
                      ...search,
                      custNo:
                        e.target.value,
                    })
                  }
                />

              </div>


              {/* ACCOUNT */}

              <div className="dashboard-search-field">

                <label>
                  Account
                </label>

                <input
                  type="text"
                  placeholder="ACC: 098-765-4321"
                  value={
                    search.account
                  }
                  onChange={(e) =>
                    setSearch({
                      ...search,
                      account:
                        e.target.value,
                    })
                  }
                />

              </div>


              {/* STATUS */}

              <div className="dashboard-search-field">

                <label>
                  Status
                </label>

                <select
                  value={
                    search.status
                  }
                  onChange={(e) =>
                    setSearch({
                      ...search,
                      status:
                        e.target.value,
                    })
                  }
                >

                  <option value="ทั้งหมด">
                    ทั้งหมด
                  </option>

                  <option value="ติดตามชำระ">
                    ติดตามชำระ
                  </option>

                  <option value="กำลังติดตาม">
                    กำลังติดตาม
                  </option>

                  <option value="ค้างชำระสูง">
                    ค้างชำระสูง
                  </option>

                </select>

              </div>

            </div>


            <div className="dashboard-search-actions">

              <button
                className="dashboard-clear-btn"
                onClick={
                  clearSearch
                }
              >
                Clear
              </button>

              <button
                className="dashboard-search-btn"
                onClick={
                  handleSearch
                }
              >
                Search
              </button>

            </div>

          </div>


          {/* =================================================
              SEARCH RESULTS
          ================================================= */}

{/* =================================================
    SEARCH RESULTS
================================================= */}

<div
  id="search-results"
  className="panel dashboard-results-panel"
>

  <h4>
    Search Results
  </h4>


  {/* =================================================
      RESULT TITLE
  ================================================= */}

  <div className="dashboard-results-count">

   {loadingAccounts
  ? "กำลังโหลด..."
  : !hasSearched && selectedCard === null
  ? "ค้นหา Account หรือเลือก Dashboard Card"
  : `${filteredAccounts.length} accounts found`
}

    {selectedCard !== null &&
      !loadingAccounts && (
        <span
          style={{
            marginLeft: "10px",
            color: "#6b7280",
          }}
        >
          ({getResultTitle()})
        </span>
      )}

  </div>


  {/* =================================================
      TABLE
      แสดงเฉพาะเมื่อเลือก Dashboard Card
  ================================================= */}
{(hasSearched || selectedCard !== null) && (
  <div className="table-wrap">

    <table className="note-table">

      <thead>
        <tr>
          <th>#</th>
          <th>Customer</th>
          <th>Customer No.</th>
          <th>Account</th>
          <th>Outstanding</th>
          <th>Status</th>
          <th>Due Date</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>

        {loadingAccounts ? (

          <tr>
            <td
              colSpan="8"
              style={{
                textAlign: "center",
                padding: "30px",
                color: "#6b7280",
              }}
            >
              กำลังโหลดข้อมูล Accounts...
            </td>
          </tr>

        ) : accountsError ? (

          <tr>
            <td
              colSpan="8"
              style={{
                textAlign: "center",
                padding: "30px",
                color: "#dc2626",
              }}
            >
              {accountsError}
            </td>
          </tr>

        ) : filteredAccounts.length === 0 ? (

          <tr>
            <td
              colSpan="8"
              style={{
                textAlign: "center",
                padding: "30px",
                color: "#6b7280",
              }}
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
            >

              <td>
                {index + 1}
              </td>

              <td>
                <strong>
                  {account.name || "-"}
                </strong>
              </td>

              <td>
                {account.cust_no || "-"}
              </td>

              <td>
                {account.account || "-"}
              </td>

              <td
                className={
                  Number(account.balance) >= 100000
                    ? "accent"
                    : ""
                }
              >
                ฿
                {Number(account.balance || 0).toLocaleString(
                  "th-TH",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </td>

              <td>
                <span
                  className={
                    account.status === "ค้างชำระสูง"
                      ? "badge-warn"
                      : "badge-acctmark-solid"
                  }
                >
                  {account.status || "-"}
                </span>
              </td>

              <td>
                {formatDate(account.due)}
              </td>

              <td>
                <button
                  className="dashboard-view-btn"
                  onClick={() =>
                    navigate(
                      `/accounts/${account.cust_no}`
                    )
                  }
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


</div>

</div>


{/* =================================================
    FOOTER
================================================= */}

<div className="footer-bar">

  DebtCollect Pro
  &nbsp; | &nbsp;
  K-Bank Debt Management CRM

</div>

</div>

</div>
  );
}

export default Dashboard;
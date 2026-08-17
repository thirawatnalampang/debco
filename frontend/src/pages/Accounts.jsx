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
  // LOAD REAL ACCOUNTS
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

            os_bal:
              Number(
                item.os_bal ??
                item.outstanding ??
                item.outstanding_balance ??
                balances.os_bal ??
                0
              ),

            status:
              item.status ||
              item.status_flag ||
              details.status_flag ||
              "",
          };
        });

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
  // SIDEBAR
  // =====================================================

  return (
    <div className="app">
<Sidebar />

      {/* ================= MAIN ================= */}

      <div className="main">


        {/* ================= TOPBAR ================= */}

        <div className="topbar">

          <div className="topbar-left">

            <button
              className="hamburger"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              ☰
            </button>


            <span className="app-name">
              DebtCollect Pro
            </span>


            <span className="pill">
              Accounts
            </span>

          </div>

        </div>


        {/* ================= CONTENT ================= */}

        <div className="content accounts-content">


          {/* Header */}

          <div className="case-header">

            <div>

              <div className="case-title">
                Accounts
              </div>

              <div className="case-meta">
                Customer accounts
              </div>

            </div>


            <div className="case-badges">

              <span className="badge-acctmark-solid">

                {loading
                  ? "Loading..."
                  : `${accounts.length} Accounts`}

              </span>

            </div>

          </div>


          {/* ================= TABLE ================= */}

          <div className="panel accounts-panel">

            <h4>
              Customer Accounts
            </h4>


            <div className="table-wrap">

              <table className="accounts-table">

                <thead>

                  <tr>

                    <th>
                      Cusno
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      ACCTMark
                    </th>

                    <th>
                      Outstanding
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>


                  {/* Loading */}

                  {loading && (

                    <tr>

                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          padding: "30px",
                          color: "#6b7280",
                        }}
                      >
                        กำลังโหลดข้อมูล Accounts...
                      </td>

                    </tr>

                  )}


                  {/* Error */}

                  {!loading && error && (

                    <tr>

                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          padding: "30px",
                          color: "#dc2626",
                        }}
                      >
                        {error}
                      </td>

                    </tr>

                  )}


                  {/* No data */}

                  {!loading &&
                    !error &&
                    accounts.length === 0 && (

                    <tr>

                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          padding: "30px",
                          color: "#6b7280",
                        }}
                      >
                        No accounts found
                      </td>

                    </tr>

                  )}


                  {/* Real data */}

                  {!loading &&
                    !error &&
                    accounts.map((account) => (

                    <tr
                      key={account.cust_no}
                    >

                      {/* Customer No */}

                      <td className="account-custno">

                        {account.cust_no || "-"}

                      </td>


                      {/* Customer */}

                      <td>

                        <div className="account-customer">

                          {account.name || "-"}

                        </div>

                      </td>


                      {/* ACCTMark */}

                      <td>

                        <span className="account-mark">

                          {account.acct_mark || "-"}

                        </span>

                      </td>


                      {/* Outstanding */}

                      <td className="account-balance">

                        ฿
                        {Number(
                          account.os_bal || 0
                        ).toLocaleString(
                          "th-TH"
                        )}

                      </td>


                      {/* Status */}

                      <td>

                        {account.status === "NPL" ? (

                          <span className="account-status npl">
                            NPL
                          </span>

                        ) : (

                          <span className="account-status normal">

                            {account.status || "Normal"}

                          </span>

                        )}

                      </td>


                      {/* Action */}

                      <td>

                        <button
                          className="account-view-btn"
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

                  ))}


                </tbody>

              </table>

            </div>

          </div>

        </div>


        {/* Footer */}

        <div className="footer-bar">

          DebtCollect Pro
          &nbsp; | &nbsp;
          K-Bank Debt Management CRM

        </div>

      </div>

    </div>
  );
}

export default Accounts;
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import AccountDetail from "./pages/AccountDetail";
import Reports from "./pages/Reports";
import Collections from "./pages/Collections";
import Settings from "./pages/Settings";
import NewCollection from "./pages/NewCollection";
import AddAccount from "./pages/AddAccount";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
  <Route path="/reports" element={<Reports />} />
        {/* Accounts */}
        <Route
          path="/accounts"
          element={<Accounts />}
        />
<Route path="/collections" element={<Collections />} />
        {/* Account Detail */}
        <Route
          path="/accounts/:custNo"
          element={<AccountDetail />}
        />

        {/* เปิดเว็บ → Login */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* URL ที่ไม่มี → Login */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="/collections/new" element={<NewCollection />} />
<Route path="/accounts/add" element={<AddAccount />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
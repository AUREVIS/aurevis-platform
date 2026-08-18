import { Navigate, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import AcademyPage from "./pages/AcademyPage";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import CartPage from "./pages/CartPage";
import { useAuth } from "./context/AuthContext";

function AdminRoute({ children }) {
  const { configured, loading, user, isAdmin } = useAuth();

  if (loading) return <div className="route-loader">Բեռնվում է…</div>;
  if (!configured || !user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/account" replace state={{ adminDenied: true }} />;
  return children;
}

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

import { useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { MessageCircle, Phone } from "lucide-react";
import Header from "./components/Header";
import IntroScreen from "./components/IntroScreen";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import AcademyPage from "./pages/AcademyPage";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import CartPage from "./pages/CartPage";
import BenefitsPage from "./pages/BenefitsPage";
import { useAuth } from "./context/AuthContext";
import { useLanguage } from "./context/LanguageContext";

function AdminRoute({ children }) {
  const { configured, loading, user, isAdmin } = useAuth();

  if (loading) return <div className="route-loader">Բեռնվում է…</div>;
  if (!configured || !user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/account" replace state={{ adminDenied: true }} />;
  return children;
}

export default function App() {
  const { t } = useLanguage();
  const [showIntro, setShowIntro] = useState(() => {
    return sessionStorage.getItem("aurevis_intro_seen") !== "true";
  });

  function finishIntro() {
    sessionStorage.setItem("aurevis_intro_seen", "true");
    setShowIntro(false);
  }

  return (
    <div className="app">
      {showIntro && (
        <IntroScreen onFinish={finishIntro} />
      )}

      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/horeca-benefits" element={<BenefitsPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <div className="floating-contact" aria-label={t("quickContact")}>
        <a
          className="floating-contact-link whatsapp"
          href={`https://wa.me/37491024232?text=${encodeURIComponent(t("whatsappMessage"))}`}
          target="_blank"
          rel="noreferrer"
          aria-label={t("writeWhatsApp")}
        >
          <MessageCircle size={21} />
          <span>{t("writeWhatsApp")}</span>
        </a>

        <a
          className="floating-contact-link phone"
          href="tel:+37491024232"
          aria-label={t("callNow")}
        >
          <Phone size={20} />
          <span>{t("callNow")}</span>
        </a>
      </div>
    </div>
  );
}

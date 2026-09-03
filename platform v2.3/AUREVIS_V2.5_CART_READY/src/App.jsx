import { useEffect, useState } from "react";
import { Navigate, Routes, Route, useLocation, useNavigate } from "react-router-dom";
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
import HoReCaDailyGiftPage from "./pages/HoReCaDailyGiftPage";
import { useAuth } from "./context/AuthContext";
import { useLanguage } from "./context/LanguageContext";
import { supabase } from "./lib/supabase";

function AdminRoute({ children }) {
  const { configured, loading, user, isAdmin } = useAuth();

  if (loading) return <div className="route-loader">Բեռնվում է…</div>;
  if (!configured || !user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/account" replace state={{ adminDenied: true }} />;
  return children;
}

function DailyGiftGate() {
  const { loading, user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user || !supabase) return;
    if (profile?.account_type !== "horeca") return;
    if (location.pathname === "/horeca-daily-gift" || location.pathname.startsWith("/admin")) return;

    let active = true;
    supabase.rpc("get_horeca_daily_gift_status").then(({ data, error }) => {
      if (!active || error) return;
      if (data?.eligible && !data?.played) {
        navigate("/horeca-daily-gift", { replace: true });
      }
    });

    return () => { active = false; };
  }, [loading, user, profile?.account_type, location.pathname, navigate]);

  return null;
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
      <DailyGiftGate />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/horeca-benefits" element={<BenefitsPage />} />
          <Route path="/horeca-daily-gift" element={<HoReCaDailyGiftPage />} />
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

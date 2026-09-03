import { useEffect, useState } from "react";
import { BadgeCheck, Building2, Clock3, Gift, History, LogOut, Snowflake, Sparkles, Trophy, WalletCards } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const money = (value) => `${new Intl.NumberFormat("hy-AM").format(Number(value || 0))} ֏`;

const roleLabels = {
  customer: "Անհատ հաճախորդ",
  horeca: "HoReCa գործընկեր",
};

const horecaStatusLabels = {
  pending: "Սպասում է հաստատման",
  approved: "Հաստատված գործընկեր",
  rejected: "Դիմումը մերժված է",
};

const orderStatusLabels = {
  new: "Նոր պատվեր",
  pending: "Սպասում է հաստատման",
  confirmed: "Հաստատված",
  preparing: "Պատրաստվում է",
  delivery: "Առաքվում է",
  delivering: "Առաքվում է",
  completed: "Ավարտված",
  cancelled: "Չեղարկված",
};

function AuthForm() {
  const { configured, signIn, signUp } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "", password: "", fullName: "", phone: "",
    accountType: "customer", companyName: "",
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const update = (event) => setForm((current) => ({
    ...current,
    [event.target.name]: event.target.value,
  }));

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    const result = mode === "login"
      ? await signIn(form.email.trim(), form.password)
      : await signUp(form.email.trim(), form.password, {
        full_name: form.fullName.trim(),
        phone: form.phone.trim(),
        account_type: form.accountType,
        company_name: form.companyName.trim(),
      });

    if (result.error) {
      setError(result.error.message === "Invalid login credentials"
        ? "Email-ը կամ գաղտնաբառը սխալ է։"
        : result.error.message);
    } else if (mode === "register" && !result.data.session) {
      setMessage("Գրանցումը հաջողվեց։ Բացիր email-ը և հաստատիր հաշիվը։");
    }
    setBusy(false);
  }

  if (!configured) {
    return (
      <div className="auth-card setup-card">
        <h2>Միացրու Supabase-ը</h2>
        <p>Մուտքը ակտիվացնելու համար լրացրու <code>.env</code>-ը և Supabase-ում աշխատեցրու V2.3 SQL ֆայլը։</p>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-card auth-intro">
        <p className="eyebrow">AUREVIS ACCOUNT</p>
        <h2>Մեկ հաշիվ՝ պատվերների, Bonus Wallet-ի և HoReCa ծրագրի համար։</h2>
        <ul>
          <li><BadgeCheck size={18} /> Միասնական cashback wallet</li>
          <li><BadgeCheck size={18} /> Պատվերների պատմություն</li>
          <li><BadgeCheck size={18} /> HoReCa գործընկերային կարգավիճակ</li>
        </ul>
      </div>

      <form className="auth-card auth-form" onSubmit={submit}>
        <div className="auth-tabs">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Մուտք</button>
          <button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Գրանցվել</button>
        </div>

        {mode === "register" && (
          <>
            <label>Անուն, ազգանուն<input required name="fullName" value={form.fullName} onChange={update} /></label>
            <label>Հեռախոս<input required name="phone" type="tel" value={form.phone} onChange={update} placeholder="+374…" /></label>
            <label>Հաշվի տեսակ
              <select name="accountType" value={form.accountType} onChange={update}>
                <option value="customer">Անհատ հաճախորդ</option>
                <option value="horeca">HoReCa / Բիզնես</option>
              </select>
            </label>
            {form.accountType === "horeca" && (
              <label>Ընկերության / սրճարանի անուն
                <input required name="companyName" value={form.companyName} onChange={update} />
              </label>
            )}
          </>
        )}

        <label>Email<input required name="email" type="email" value={form.email} onChange={update} /></label>
        <label>Գաղտնաբառ<input required minLength="6" name="password" type="password" value={form.password} onChange={update} /></label>
        {error && <p className="form-message error">{error}</p>}
        {message && <p className="form-message success">{message}</p>}
        <button className="submit-button" disabled={busy}>
          {busy ? "Սպասիր…" : mode === "login" ? "Մուտք գործել" : "Ստեղծել հաշիվ"}
        </button>
      </form>
    </div>
  );
}

export default function AccountPage() {
  const location = useLocation();
  const { loading, user, profile, profileError, signOut } = useAuth();
  const { t } = useLanguage();
  const [wallet, setWallet] = useState(null);
  const [orders, setOrders] = useState([]);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    if (!user || !supabase) return;
    let active = true;

    Promise.all([
      supabase.from("wallets").select("balance").eq("user_id", user.id).maybeSingle(),
      supabase.from("orders").select("id, order_number, status, total_amount, cashback_earned, created_at, updated_at")
        .eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
    ]).then(([walletResult, ordersResult]) => {
      if (!active) return;
      if (walletResult.error || ordersResult.error) {
        setDataError(walletResult.error?.message || ordersResult.error?.message || "");
      } else {
        setWallet(walletResult.data);
        setOrders(ordersResult.data || []);
      }
    });

    const intervalId = window.setInterval(async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, status, total_amount, cashback_earned, created_at, updated_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (active && !error) setOrders(data || []);
    }, 30000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [user]);

  if (loading) return <div className="route-loader">Հաշիվը բեռնվում է…</div>;

  const activeOrders = orders.filter((order) => !["completed", "cancelled"].includes(order.status));
  const orderHistory = orders.filter((order) => ["completed", "cancelled"].includes(order.status));
  const loyaltyTier = String(profile?.loyalty_tier || "bronze").toLowerCase();
  const tierRates = { bronze: 5, silver: 7, gold: 9 };

  const renderOrders = (list) => (
    <div className="order-list">
      {list.map((order) => (
        <article key={order.id}>
          <div>
            <b>#{order.order_number}</b>
            <span>{new Date(order.created_at).toLocaleDateString("hy-AM")}</span>
            {order.status === "completed" && Number(order.cashback_earned) > 0 && (
              <small className="cashback-note">+{money(order.cashback_earned)} cashback</small>
            )}
          </div>
          <strong>{money(order.total_amount)}</strong>
          <em className={`order-status ${order.status}`}>
            {orderStatusLabels[order.status] || order.status}
          </em>
        </article>
      ))}
    </div>
  );

  return (
    <section className="page account-page">
      <div className="page-heading">
        <p className="eyebrow dark">CUSTOMER PORTAL</p>
        <h1>Իմ հաշիվը</h1>
      </div>

      {!user ? <AuthForm /> : (
        <>
          {location.state?.adminDenied && (
            <p className="notice-banner">Այս բաժինը հասանելի է միայն AUREVIS Admin հաշվին։</p>
          )}
          <div className="account-topbar">
            <div>
              <span>Բարի գալուստ</span>
              <h2>{profile?.full_name || user.email}</h2>
              <p>{user.email}</p>
            </div>
            <button onClick={signOut}><LogOut size={18} /> Դուրս գալ</button>
          </div>

          <div className="account-summary">
            <article className="wallet-card">
              <WalletCards />
              <span>Միասնական Bonus Wallet</span>
              <b>{money(wallet?.balance)}</b>
              <small>Օգտագործիր ապրանքների կամ սարքավորման համար</small>
            </article>
            <article>
              <Building2 />
              <span>Հաշվի տեսակ</span>
              <b>{roleLabels[profile?.account_type] || "Հաճախորդ"}</b>
              <small>{profile?.company_name || "AUREVIS անդամ"}</small>
            </article>
            <article>
              <BadgeCheck />
              <span>Կարգավիճակ</span>
              <b>{profile?.account_type === "horeca"
                ? horecaStatusLabels[profile?.horeca_status] || "Սպասում է"
                : "Ակտիվ"}</b>
              <small>{profile?.loyalty_tier ? `${profile.loyalty_tier} մակարդակ` : "Standard"}</small>
            </article>
          </div>

          {profile?.account_type !== "horeca" && profile?.daily_gift_access && (
            <section className="horeca-bonus-panel approved">
              <Link className="daily-gift-account-link" to="/horeca-daily-gift">
                <Sparkles />
                <span><b>Օրվա անակնկալ</b><small>Շահիր շիշ կամ մինչև 12% cashback</small></span>
              </Link>
            </section>
          )}

          {profile?.account_type === "horeca" && (
            <section className={`horeca-bonus-panel ${profile?.horeca_status === "approved" ? "approved" : "pending"}`}>
              <div className="horeca-bonus-heading">
                <div>
                  <p className="eyebrow dark">AUREVIS HORECA</p>
                  <h2>{t("myBonuses")}</h2>
                </div>
                {profile?.horeca_status === "approved" && (
                  <div className="current-tier-badge">
                    <Trophy size={20} />
                    <span>{t(loyaltyTier)}</span>
                    <b>{tierRates[loyaltyTier] || 5}%</b>
                  </div>
                )}
              </div>

              <Link className="daily-gift-account-link" to="/horeca-daily-gift">
                <Sparkles />
                <span><b>Օրվա անակնկալ</b><small>Շահիր շիշ կամ մինչև 12% cashback</small></span>
              </Link>

              {profile?.horeca_status === "approved" ? (
                <>
                  <div className="account-benefit-grid">
                    <article><Snowflake /><b>{t("iceTitle")}</b><span>{t("iceText")}</span></article>
                    <article><WalletCards /><b>{tierRates[loyaltyTier] || 5}% {t("cashback")}</b><span>{t("cashbackText")}</span></article>
                    <article><Gift /><b>{t("giftsTitle")}</b><span>{t("equipmentText")}</span></article>
                  </div>
                </>
              ) : (
                <p>{t("eligibility")}</p>
              )}

              <Link to="/horeca-benefits">{t("learnBenefits")}</Link>
            </section>
          )}

          <div className="account-section">
            <div className="section-title">
              <div><p className="eyebrow dark">ACTIVE ORDERS</p><h2><Clock3 size={25} /> Ակտիվ պատվերներ</h2></div>
              <span>{activeOrders.length} պատվեր</span>
            </div>
            <p className="account-status-note">Կարգավիճակը թարմացվում է ավտոմատ՝ առանց էջը վերաբեռնելու։</p>
            {activeOrders.length ? renderOrders(activeOrders) : (
              <div className="empty-state compact">
                <h3>Ակտիվ պատվեր չկա</h3>
                <p>Նոր պատվերը և դրա ընթացքը այստեղ կերևան։</p>
              </div>
            )}
          </div>

          <div className="account-section order-history-section">
            <div className="section-title">
              <div><p className="eyebrow dark">ORDER HISTORY</p><h2><History size={25} /> Պատվերների պատմություն</h2></div>
              <span>{orderHistory.length} պատվեր</span>
            </div>
            {orderHistory.length ? renderOrders(orderHistory) : (
              <div className="empty-state compact">
                <h3>Պատմությունը դեռ դատարկ է</h3>
                <p>Ավարտված և չեղարկված պատվերներն այստեղ կպահպանվեն։</p>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

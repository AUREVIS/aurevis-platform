import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, RefreshCw, ShieldCheck, Users, WalletCards, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

const money = (value) => `${new Intl.NumberFormat("hy-AM").format(Number(value || 0))} ֏`;

export default function AdminPage() {
  const { profile, signOut } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [walletInputs, setWalletInputs] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const [profilesResult, ordersResult] = await Promise.all([
      supabase.from("profiles").select("id, email, full_name, phone, account_type, company_name, role, horeca_status, loyalty_tier, created_at")
        .eq("is_archived", false)
        .order("created_at", { ascending: false }),
      supabase.from("orders").select("id, order_number, status, total_amount, created_at, profiles(full_name, email)")
        .order("created_at", { ascending: false }).limit(50),
    ]);

    if (profilesResult.error || ordersResult.error) {
      setError(profilesResult.error?.message || ordersResult.error?.message || "Տվյալները չբեռնվեցին");
    } else {
      setProfiles(profilesResult.data || []);
      setOrders(ordersResult.data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => ({
    customers: profiles.length,
    pending: profiles.filter((item) => item.account_type === "horeca" && item.horeca_status === "pending").length,
    approved: profiles.filter((item) => item.account_type === "horeca" && item.horeca_status === "approved").length,
    orders: orders.length,
  }), [profiles, orders]);

  async function setHoReCa(userId, status) {
    const { error: rpcError } = await supabase.rpc("admin_set_horeca_status", {
      target_user_id: userId,
      next_status: status,
    });
    if (rpcError) setError(rpcError.message);
    else load();
  }

  async function adjustWallet(userId) {
    const amount = Number(walletInputs[userId]);
    if (!Number.isFinite(amount) || amount === 0) return;
    const { error: rpcError } = await supabase.rpc("admin_adjust_wallet", {
      target_user_id: userId,
      amount_delta: amount,
      entry_note: "Admin adjustment",
    });
    if (rpcError) setError(rpcError.message);
    else {
      setWalletInputs((current) => ({ ...current, [userId]: "" }));
      setError("");
    }
  }

  async function updateOrderStatus(orderId, nextStatus) {
    setError("");
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId);
    if (updateError) setError(updateError.message);
    else setOrders((current) => current.map((order) =>
      order.id === orderId ? { ...order, status: nextStatus } : order));
  }

  return (
    <section className="page admin-page">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">AUREVIS CONTROL CENTER</p>
          <h1>Admin Dashboard</h1>
          <p>{profile?.full_name || profile?.email}</p>
        </div>
        <div className="admin-actions">
          <button onClick={load}><RefreshCw size={18} className={loading ? "spin" : ""} /> Թարմացնել</button>
          <button onClick={signOut}>Դուրս գալ</button>
        </div>
      </div>

      <div className="status-grid admin-status-grid">
        <article><Users /><span>Հաշիվներ</span><b>{stats.customers}</b></article>
        <article><ShieldCheck /><span>Սպասող HoReCa</span><b>{stats.pending}</b></article>
        <article><Check /><span>Հաստատված HoReCa</span><b>{stats.approved}</b></article>
        <article><WalletCards /><span>Վերջին պատվերներ</span><b>{stats.orders}</b></article>
      </div>

      {error && <p className="admin-error">V2.3 database setup-ը ստուգիր․ {error}</p>}

      <div className="admin-panel">
        <div className="section-title admin-section-title">
          <div><p className="eyebrow">PARTNERS</p><h2>Հաճախորդներ և HoReCa դիմումներ</h2></div>
          <span>{profiles.length}</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Հաճախորդ</th><th>Տեսակ</th><th>Կարգավիճակ</th><th>Wallet փոփոխություն</th><th>Գործողություն</th></tr></thead>
            <tbody>
              {profiles.map((item) => (
                <tr key={item.id}>
                  <td><b>{item.full_name || item.email}</b><span>{item.company_name || item.phone || item.email}</span></td>
                  <td>{item.role === "admin" ? "Admin" : item.account_type}</td>
                  <td><span className={`status-pill ${item.horeca_status}`}>{item.horeca_status || "active"}</span></td>
                  <td>
                    <div className="wallet-adjust">
                      <input type="number" placeholder="+1000 / -500" value={walletInputs[item.id] || ""}
                        onChange={(event) => setWalletInputs((current) => ({ ...current, [item.id]: event.target.value }))} />
                      <button onClick={() => adjustWallet(item.id)}>Պահել</button>
                    </div>
                  </td>
                  <td>
                    {item.account_type === "horeca" && item.role !== "admin" ? (
                      <div className="row-actions">
                        <button title="Հաստատել" onClick={() => setHoReCa(item.id, "approved")}><Check size={16} /></button>
                        <button title="Մերժել" onClick={() => setHoReCa(item.id, "rejected")}><X size={16} /></button>
                      </div>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-panel">
        <div className="section-title admin-section-title">
          <div><p className="eyebrow">ORDERS</p><h2>Վերջին պատվերները</h2></div>
        </div>
        {orders.length ? (
          <div className="order-list admin-orders">
            {orders.map((order) => (
              <article key={order.id}>
                <div><b>#{order.order_number}</b><span>{order.profiles?.full_name || order.profiles?.email}</span></div>
                <strong>{money(order.total_amount)}</strong>
                <select
                  className={`order-status-select ${order.status}`}
                  value={order.status}
                  onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                  aria-label={`Փոխել ${order.order_number} պատվերի կարգավիճակը`}
                >
                  <option value="new">Նոր</option>
                  <option value="confirmed">Հաստատված</option>
                  <option value="preparing">Պատրաստվում է</option>
                  <option value="delivery">Առաքվում է</option>
                  <option value="completed">Ավարտված</option>
                  <option value="cancelled">Չեղարկված</option>
                </select>
              </article>
            ))}
          </div>
        ) : <p className="admin-empty">Դեռ պատվեր չկա։</p>}
      </div>
    </section>
  );
}

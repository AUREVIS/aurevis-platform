import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays, Check, CircleDollarSign, Gift, History, PackageCheck,
  CreditCard, Eye, MapPin, MessageCircle, Phone, RefreshCw, ShieldCheck,
  ShoppingBag, TrendingUp, Users, X,
} from "lucide-react";
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sales, setSales] = useState({
    today_total: 0,
    month_total: 0,
    all_time_total: 0,
    completed_orders: 0,
    sold_items: 0,
    cashback_total: 0,
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const [profilesResult, ordersResult, salesResult] = await Promise.all([
      supabase.from("profiles").select("id, email, full_name, phone, account_type, company_name, role, horeca_status, loyalty_tier, daily_gift_access, created_at")
        .eq("is_archived", false)
        .order("created_at", { ascending: false }),
      supabase.from("orders").select(`
        id, order_number, status, subtotal, total_amount, discount_amount,
        daily_discount_rate, cashback_rate, cashback_earned, phone,
        whatsapp_number, whatsapp_opt_in,
        delivery_address, notes, payment_method, ice_gift_kg,
        created_at, updated_at, completed_at,
        profiles(full_name, email, company_name),
        order_items(id, quantity, product_name, volume, unit_price)
      `).order("created_at", { ascending: false }).limit(200),
      supabase.rpc("admin_sales_summary"),
    ]);

    if (profilesResult.error || ordersResult.error || salesResult.error) {
      setError(profilesResult.error?.message || ordersResult.error?.message || salesResult.error?.message || "Տվյալները չբեռնվեցին");
    } else {
      setProfiles(profilesResult.data || []);
      setOrders(ordersResult.data || []);
      setSales((current) => ({ ...current, ...(salesResult.data || {}) }));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => ({
    customers: profiles.length,
    pending: profiles.filter((item) => item.account_type === "horeca" && item.horeca_status === "pending").length,
    approved: profiles.filter((item) => item.account_type === "horeca" && item.horeca_status === "approved").length,
    activeOrders: orders.filter((item) => !["completed", "cancelled"].includes(item.status)).length,
  }), [profiles, orders]);

  const activeOrders = useMemo(
    () => orders.filter((order) => !["completed", "cancelled"].includes(order.status)),
    [orders],
  );
  const salesHistory = useMemo(
    () => orders.filter((order) => ["completed", "cancelled"].includes(order.status)),
    [orders],
  );

  async function setHoReCa(userId, status) {
    const { error: rpcError } = await supabase.rpc("admin_set_horeca_status", {
      target_user_id: userId,
      next_status: status,
    });
    if (rpcError) setError(rpcError.message);
    else load();
  }

  async function setTier(userId, tier) {
    setError("");
    const { error: rpcError } = await supabase.rpc("admin_set_loyalty_tier", {
      target_user_id: userId,
      next_tier: tier,
    });
    if (rpcError) setError(rpcError.message);
    else load();
  }

  async function setDailyGiftAccess(userId, enabled) {
    setError("");
    const { error: rpcError } = await supabase.rpc("admin_set_daily_gift_access", {
      target_user_id: userId,
      enabled,
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
    const { error: updateError } = await supabase.rpc("admin_update_order_status", {
      target_order_id: orderId,
      next_status: nextStatus,
    });
    if (updateError) setError(updateError.message);
    else load();
  }

  const orderItemsCount = (order) => (order.order_items || [])
    .reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const customerName = (order) => order.profiles?.company_name
    || order.profiles?.full_name
    || order.profiles?.email
    || "Հաճախորդ";

  const whatsappLink = (order) => {
    let number = String(order.whatsapp_number || order.phone || "").replace(/\D/g, "");
    if (number.startsWith("0")) number = `374${number.slice(1)}`;
    if (number.length === 8) number = `374${number}`;

    const statusLabel = {
      new: "ընդունվել է",
      confirmed: "հաստատվել է",
      preparing: "պատրաստվում է",
      delivery: "առաքվում է",
      delivering: "առաքվում է",
      completed: "ավարտված է",
      cancelled: "չեղարկվել է",
    }[order.status] || order.status;

    const message = `Բարև ձեզ։ Ձեր AUREVIS #${order.order_number} պատվերի կարգավիճակը՝ ${statusLabel}։ Շնորհակալություն։`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  const phoneLink = (order) => `tel:${String(order.phone || "").replace(/[^+\d]/g, "")}`;

  const paymentLabel = {
    cash: "Կանխիկ՝ առաքման պահին",
    card: "Քարտով",
    transfer: "Փոխանցումով",
  };

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

      <div className="status-grid admin-status-grid sales-status-grid">
        <article><CalendarDays /><span>Այսօրվա վաճառք</span><b>{money(sales.today_total)}</b></article>
        <article><TrendingUp /><span>Այս ամսվա վաճառք</span><b>{money(sales.month_total)}</b></article>
        <article><CircleDollarSign /><span>Ընդհանուր վաճառք</span><b>{money(sales.all_time_total)}</b></article>
        <article><ShoppingBag /><span>Ակտիվ պատվերներ</span><b>{stats.activeOrders}</b></article>
        <article><PackageCheck /><span>Վաճառված ապրանքներ</span><b>{sales.sold_items}</b></article>
        <article><Check /><span>Ավարտված պատվերներ</span><b>{sales.completed_orders}</b></article>
        <article><Users /><span>Հաճախորդներ</span><b>{stats.customers}</b></article>
        <article><ShieldCheck /><span>Տրված cashback</span><b>{money(sales.cashback_total)}</b></article>
      </div>

      {error && <p className="admin-error">V2.4 database setup-ը ստուգիր․ {error}</p>}

      <div className="admin-panel">
        <div className="section-title admin-section-title">
          <div><p className="eyebrow">PARTNERS</p><h2>Հաճախորդներ և HoReCa դիմումներ</h2></div>
          <span>{profiles.length}</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Հաճախորդ</th><th>Տեսակ</th><th>Կարգավիճակ</th><th>Մակարդակ</th><th>Հատուկ խաղ</th><th>Wallet փոփոխություն</th><th>Գործողություն</th></tr></thead>
            <tbody>
              {profiles.map((item) => (
                <tr key={item.id}>
                  <td><b>{item.full_name || item.email}</b><span>{item.company_name || item.phone || item.email}</span></td>
                  <td>{item.role === "admin" ? "Admin" : item.account_type}</td>
                  <td><span className={`status-pill ${item.horeca_status}`}>{item.horeca_status || "active"}</span></td>
                  <td>
                    {item.account_type === "horeca" && item.horeca_status === "approved" ? (
                      <select
                        className="loyalty-tier-select"
                        value={item.loyalty_tier || "bronze"}
                        onChange={(event) => setTier(item.id, event.target.value)}
                      >
                        <option value="bronze">Bronze · 5%</option>
                        <option value="silver">Silver · 7%</option>
                        <option value="gold">Gold · 9%</option>
                      </select>
                    ) : "—"}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`daily-access-toggle ${item.daily_gift_access || item.account_type === "horeca" ? "enabled" : ""}`}
                      disabled={item.account_type === "horeca" || item.role === "admin"}
                      onClick={() => setDailyGiftAccess(item.id, !item.daily_gift_access)}
                      title={item.account_type === "horeca" ? "HoReCa հաշվի համար միշտ միացված է" : "Տալ HoReCa Daily Gift-ի հատուկ կանոնները"}
                    >
                      <Gift size={16} />
                      {item.account_type === "horeca" || item.daily_gift_access ? "Միացված" : "Միացնել"}
                    </button>
                  </td>
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
          <div><p className="eyebrow">ACTIVE ORDERS</p><h2>Ակտիվ պատվերներ</h2></div>
          <span>{activeOrders.length}</span>
        </div>
        {activeOrders.length ? (
          <div className="order-list admin-orders">
            {activeOrders.map((order) => (
              <article key={order.id}>
                <div>
                  <b>#{order.order_number}</b>
                  <span>{customerName(order)} · {orderItemsCount(order)} ապրանք</span>
                  <small>{new Date(order.created_at).toLocaleString("hy-AM")}</small>
                </div>
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
                {order.whatsapp_opt_in && (order.whatsapp_number || order.phone) && (
                  <a
                    className="admin-whatsapp-link"
                    href={whatsappLink(order)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={17} /> WhatsApp
                  </a>
                )}
                <button
                  type="button"
                  className="admin-order-details-button"
                  onClick={() => setSelectedOrder(order)}
                >
                  <Eye size={17} /> Մանրամասներ
                </button>
              </article>
            ))}
          </div>
        ) : <p className="admin-empty">Դեռ պատվեր չկա։</p>}
      </div>

      <div className="admin-panel">
        <div className="section-title admin-section-title">
          <div><p className="eyebrow">SALES HISTORY</p><h2><History size={25} /> Վաճառքների պատմություն</h2></div>
          <span>{salesHistory.length}</span>
        </div>
        {salesHistory.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table sales-history-table">
              <thead>
                <tr><th>Պատվեր</th><th>Հաճախորդ</th><th>Ապրանքներ</th><th>Գումար</th><th>Cashback</th><th>Ամսաթիվ</th><th>Կարգավիճակ</th></tr>
              </thead>
              <tbody>
                {salesHistory.map((order) => (
                  <tr key={order.id}>
                    <td><b>#{order.order_number}</b></td>
                    <td>{customerName(order)}</td>
                    <td>{orderItemsCount(order)}</td>
                    <td><b>{money(order.total_amount)}</b></td>
                    <td>{order.status === "completed" ? money(order.cashback_earned) : "—"}</td>
                    <td>{new Date(order.completed_at || order.updated_at).toLocaleString("hy-AM")}</td>
                    <td>
                      <div className="sales-order-actions">
                        <span className={`order-status ${order.status}`}>{order.status === "completed" ? "Ավարտված" : "Չեղարկված"}</span>
                        <button type="button" onClick={() => setSelectedOrder(order)}><Eye size={16} /> Դիտել</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="admin-empty">Ավարտված վաճառք դեռ չկա։</p>}
      </div>

      {selectedOrder && (
        <div
          className="admin-order-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedOrder(null);
          }}
        >
          <article className="admin-order-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-order-title">
            <button className="admin-order-modal-close" type="button" aria-label="Փակել" onClick={() => setSelectedOrder(null)}>
              <X size={22} />
            </button>

            <div className="admin-order-dialog-heading">
              <div>
                <p className="eyebrow">ORDER DETAILS</p>
                <h2 id="admin-order-title">#{selectedOrder.order_number}</h2>
                <span>{new Date(selectedOrder.created_at).toLocaleString("hy-AM")}</span>
              </div>
              <span className={`order-status ${selectedOrder.status}`}>{selectedOrder.status}</span>
            </div>

            <div className="admin-order-customer-grid">
              <div><Users size={18} /><span>Հաճախորդ</span><b>{customerName(selectedOrder)}</b></div>
              <div><Phone size={18} /><span>Հեռախոս</span><b>{selectedOrder.phone || "—"}</b></div>
              <div><MapPin size={18} /><span>Առաքման հասցե</span><b>{selectedOrder.delivery_address || "—"}</b></div>
              <div><CreditCard size={18} /><span>Վճարման ձև</span><b>{paymentLabel[selectedOrder.payment_method] || selectedOrder.payment_method || "—"}</b></div>
            </div>

            <div className="admin-order-products">
              <h3>Ապրանքներ</h3>
              {(selectedOrder.order_items || []).map((item) => (
                <div key={item.id || `${item.product_name}-${item.quantity}`}>
                  <span><b>{item.product_name}</b><small>{item.volume || ""}</small></span>
                  <span>{item.quantity} × {money(item.unit_price)}</span>
                  <strong>{money(Number(item.unit_price || 0) * Number(item.quantity || 0))}</strong>
                </div>
              ))}
            </div>

            <div className="admin-order-summary">
              <div><span>Ենթագումար</span><b>{money(selectedOrder.subtotal)}</b></div>
              {Number(selectedOrder.discount_amount || 0) > 0 && (
                <div className="discount"><span>Զեղչ՝ {Number(selectedOrder.daily_discount_rate || 0)}%</span><b>−{money(selectedOrder.discount_amount)}</b></div>
              )}
              {Number(selectedOrder.ice_gift_kg || 0) > 0 && <div><span>Սառույցի նվեր</span><b>{selectedOrder.ice_gift_kg} կգ</b></div>}
              <div className="total"><span>Վերջնական գումար</span><b>{money(selectedOrder.total_amount)}</b></div>
              {Number(selectedOrder.cashback_rate || 0) > 0 && <div><span>Cashback</span><b>{selectedOrder.cashback_rate}%</b></div>}
            </div>

            {selectedOrder.notes && <div className="admin-order-note"><b>Նշում</b><p>{selectedOrder.notes}</p></div>}

            <div className="admin-order-contact-actions">
              {selectedOrder.phone && <a href={phoneLink(selectedOrder)}><Phone size={18} /> Զանգել</a>}
              {(selectedOrder.whatsapp_number || selectedOrder.phone) && (
                <a className="whatsapp" href={whatsappLink(selectedOrder)} target="_blank" rel="noreferrer">
                  <MessageCircle size={18} /> Գրել WhatsApp
                </a>
              )}
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

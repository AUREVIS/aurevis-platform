import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../context/LanguageContext";

const money = (value, language = "hy") => `${new Intl.NumberFormat({ hy: "hy-AM", ru: "ru-RU", en: "en-US", ka: "ka-GE" }[language] || "hy-AM").format(Number(value || 0))} ֏`;

export default function CartPage() {
  const { language, t } = useLanguage();
  const { items, total, setQuantity, removeItem, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ phone: profile?.phone || "", address: "", notes: "" });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isApprovedHoReCa = profile?.account_type === "horeca" && profile?.horeca_status === "approved";
  const tierRates = { bronze: 5, silver: 7, gold: 9 };
  const cashbackRate = tierRates[String(profile?.loyalty_tier || "bronze").toLowerCase()] || 5;
  const eligibleBottleCount = items
    .filter((item) => ["syrup", "syrups", "puree", "purees"].includes(String(item.category || "").toLowerCase()))
    .reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function submitOrder(event) {
    event.preventDefault();
    if (!user) return setError(t("signInToOrder"));
    if (!items.length) return;
    setBusy(true); setError(""); setSuccess("");
    const { data, error: orderError } = await supabase.rpc("create_aurevis_order", {
      order_phone: form.phone.trim(),
      order_address: form.address.trim(),
      order_notes: form.notes.trim(),
      cart_items: items.map((item) => ({
        id: item.id,
        sku: item.sku || null,
        name: item.name,
        quantity: item.quantity,
        payment_method: paymentMethod,
      })),
    });
    if (orderError) setError(`Պատվերը չպահպանվեց․ ${orderError.message}`);
    else {
      const orderNumber = data?.[0]?.order_number || "AUREVIS";

      try {
        await fetch("/.netlify/functions/telegram-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderNumber,
            customer: profile?.company_name || profile?.full_name || user.email || "Հաճախորդ",
            phone: form.phone.trim(),
            address: form.address.trim(),
            notes: form.notes.trim(),
            total,
            paymentMethod,
            isHoReCa: isApprovedHoReCa,
            cashbackRate: isApprovedHoReCa ? cashbackRate : 0,
            iceGiftKg: isApprovedHoReCa ? eligibleBottleCount * 5 : 0,
            items: items.map((item) => ({
              name: item.name,
              volume: item.volume || "",
              price: Number(item.price || 0),
              quantity: Number(item.quantity || 1),
            })),
          }),
        });
      } catch (telegramError) {
        console.warn("Telegram notification failed", telegramError);
      }

      clearCart();
      setSuccess(`Պատվերն ընդունված է։ Համար՝ ${orderNumber}`);
    }
    setBusy(false);
  }

  return (
    <section className="page cart-page">
      <div className="page-heading"><p className="eyebrow dark">AUREVIS CART</p><h1>{t("cartTitle")}</h1></div>
      {!items.length && !success ? (
        <div className="empty-state"><ShoppingBag size={36} /><h2>{t("cartEmpty")}</h2><Link to="/catalog">{t("openCatalog")}</Link></div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-thumb">{item.image ? <img src={item.image} alt={item.name} /> : <ShoppingBag />}</div>
                <div><h2>{item.name}</h2><p>{item.volume}</p><b>{money(item.price, language)}</b></div>
                <div className="quantity-control">
                  <button onClick={() => setQuantity(item.id, item.quantity - 1)}><Minus size={16} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => setQuantity(item.id, item.quantity + 1)}><Plus size={16} /></button>
                </div>
                <strong>{money(item.price * item.quantity, language)}</strong>
                <button className="remove-item" onClick={() => removeItem(item.id)}><Trash2 size={18} /></button>
              </article>
            ))}
          </div>
          <form className="checkout-card" onSubmit={submitOrder}>
            <h2>{t("orderSummary")}</h2>
            <div className="checkout-total"><span>{t("total")}</span><b>{money(total, language)}</b></div>
            {isApprovedHoReCa && (
              <div className="checkout-horeca-benefits">
                <b>{t("horecaOrderBenefits")}</b>
                <span>+{eligibleBottleCount * 5} kg {t("iceGift")}</span>
                <span>+{money(total * cashbackRate / 100, language)} {t("estimatedCashback")}</span>
              </div>
            )}
            {!user && <p className="form-message error"><Link to="/account">{t("signInToOrder")}</Link></p>}
            <label>{t("phone")}<input required name="phone" value={form.phone} onChange={update} placeholder="+374…" /></label>
            <label>{t("address")}<input required name="address" value={form.address} onChange={update} /></label>
            <label>
              {t("paymentMethod")}
              <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                <option value="cash">{t("payCash")}</option>
                <option value="card">{t("payCard")}</option>
                {isApprovedHoReCa && <option value="transfer">{t("payTransfer")}</option>}
              </select>
            </label>
            {isApprovedHoReCa && paymentMethod === "transfer" && (
              <p className="payment-hint">{t("transferHint")}</p>
            )}
            <label>{t("note")}<textarea name="notes" value={form.notes} onChange={update} rows="3" /></label>
            {error && <p className="form-message error">{error}</p>}
            {success && <p className="form-message success">{success}</p>}
            <button className="submit-button" disabled={busy || !items.length}>{busy ? t("sending") : t("confirmOrder")}</button>
          </form>
        </div>
      )}
      {success && <div className="order-success"><h2>{success}</h2><Link to="/account">{t("viewOrders")}</Link></div>}
    </section>
  );
}

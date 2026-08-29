import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const money = (value) => `${new Intl.NumberFormat("hy-AM").format(Number(value || 0))} ֏`;

export default function CartPage() {
  const { items, total, setQuantity, removeItem, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ phone: profile?.phone || "", address: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function submitOrder(event) {
    event.preventDefault();
    if (!user) return setError("Պատվիրելու համար մուտք գործիր կամ գրանցվիր։");
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
      })),
    });
    if (orderError) setError(`Պատվերը չպահպանվեց․ ${orderError.message}`);
    else {
      const orderNumber = data?.[0]?.order_number || "AUREVIS";
      clearCart();
      setSuccess(`Պատվերն ընդունված է։ Համար՝ ${orderNumber}`);
    }
    setBusy(false);
  }

  return (
    <section className="page cart-page">
      <div className="page-heading"><p className="eyebrow dark">AUREVIS CART</p><h1>Զամբյուղ</h1></div>
      {!items.length && !success ? (
        <div className="empty-state"><ShoppingBag size={36} /><h2>Զամբյուղը դատարկ է</h2><Link to="/catalog">Բացել կատալոգը</Link></div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-thumb">{item.image ? <img src={item.image} alt={item.name} /> : <ShoppingBag />}</div>
                <div><h2>{item.name}</h2><p>{item.volume}</p><b>{money(item.price)}</b></div>
                <div className="quantity-control">
                  <button onClick={() => setQuantity(item.id, item.quantity - 1)}><Minus size={16} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => setQuantity(item.id, item.quantity + 1)}><Plus size={16} /></button>
                </div>
                <strong>{money(item.price * item.quantity)}</strong>
                <button className="remove-item" onClick={() => removeItem(item.id)}><Trash2 size={18} /></button>
              </article>
            ))}
          </div>
          <form className="checkout-card" onSubmit={submitOrder}>
            <h2>Պատվերի ամփոփում</h2>
            <div className="checkout-total"><span>Ընդհանուր</span><b>{money(total)}</b></div>
            {!user && <p className="form-message error">Պատվիրելու համար <Link to="/account">մուտք գործիր</Link>։</p>}
            <label>Հեռախոս<input required name="phone" value={form.phone} onChange={update} placeholder="+374…" /></label>
            <label>Առաքման հասցե<input required name="address" value={form.address} onChange={update} /></label>
            <label>Նշում<textarea name="notes" value={form.notes} onChange={update} rows="3" /></label>
            {error && <p className="form-message error">{error}</p>}
            {success && <p className="form-message success">{success}</p>}
            <button className="submit-button" disabled={busy || !items.length}>{busy ? "Ուղարկվում է…" : "Հաստատել պատվերը"}</button>
          </form>
        </div>
      )}
      {success && <div className="order-success"><h2>{success}</h2><Link to="/account">Դիտել իմ պատվերները</Link></div>}
    </section>
  );
}

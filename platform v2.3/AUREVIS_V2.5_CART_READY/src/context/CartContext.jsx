import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("aurevis_cart")) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("aurevis_cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0),
    addItem(product) {
      setItems((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (existing) return current.map((item) => item.id === product.id
          ? { ...item, quantity: item.quantity + 1 } : item);
        return [...current, { ...product, quantity: 1 }];
      });
    },
    setQuantity(id, quantity) {
      if (quantity < 1) return;
      setItems((current) => current.map((item) => item.id === id ? { ...item, quantity } : item));
    },
    removeItem(id) { setItems((current) => current.filter((item) => item.id !== id)); },
    clearCart() { setItems([]); },
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}

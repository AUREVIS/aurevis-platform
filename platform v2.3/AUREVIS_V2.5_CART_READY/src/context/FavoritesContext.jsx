import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabase";

const FavoritesContext = createContext(null);
const storageKey = "aurevis_favorites";

const readLocal = () => {
  try { return JSON.parse(localStorage.getItem(storageKey)) || []; }
  catch { return []; }
};

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [ids, setIds] = useState(readLocal);

  useEffect(() => {
    let active = true;
    if (!user || !supabase) {
      setIds(readLocal());
      return () => { active = false; };
    }

    async function loadFavorites() {
      const localIds = readLocal().filter((id) => /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(String(id)));
      if (localIds.length) {
        await supabase.from("favorites").upsert(
          localIds.map((productId) => ({ user_id: user.id, product_id: productId })),
          { onConflict: "user_id,product_id", ignoreDuplicates: true }
        );
        localStorage.removeItem(storageKey);
      }
      const { data, error } = await supabase.from("favorites").select("product_id").eq("user_id", user.id);
      if (active && !error) setIds((data || []).map((item) => item.product_id));
    }

    loadFavorites();
    return () => { active = false; };
  }, [user]);

  const value = useMemo(() => ({
    ids,
    count: ids.length,
    isFavorite(productId) { return ids.includes(productId); },
    async toggleFavorite(productId) {
      const exists = ids.includes(productId);
      const next = exists ? ids.filter((id) => id !== productId) : [...ids, productId];
      setIds(next);
      if (!user || !supabase) {
        localStorage.setItem(storageKey, JSON.stringify(next));
        return;
      }
      if (exists) await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId);
      else await supabase.from("favorites").insert({ user_id: user.id, product_id: productId });
    },
  }), [ids, user]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error("useFavorites must be used inside FavoritesProvider");
  return value;
}

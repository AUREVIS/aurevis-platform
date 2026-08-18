import { supabase } from "./supabase";
import { products as fallbackProducts } from "../data/products";

export async function getCatalogProducts() {
  if (!supabase) return { products: fallbackProducts, source: "fallback" };

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, sku, name_hy, name_en, description_hy, volume,
      retail_price, horeca_price, bonus_reward, ice_gift_kg,
      stock_quantity, image_url, is_active, sort_order,
      categories ( slug, name_hy, name_en )
    `)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Catalog load failed:", error);
    return { products: fallbackProducts, source: "fallback", error };
  }

  return {
    source: "supabase",
    products: (data || []).map((item, index) => ({
      id: item.id,
      sku: item.sku,
      category: item.categories?.slug || "other",
      categoryName: item.categories?.name_hy || "",
      name: item.name_en || item.name_hy,
      nameHy: item.name_hy,
      description: item.description_hy || "",
      volume: item.volume || "",
      price: item.retail_price || 0,
      horecaPrice: item.horeca_price,
      bonus: item.bonus_reward || 0,
      iceGiftKg: Number(item.ice_gift_kg || 0),
      stock: item.stock_quantity || 0,
      image: item.image_url || null,
      accent: fallbackProducts[index % fallbackProducts.length]?.accent || "#9a762e",
    }))
  };
}

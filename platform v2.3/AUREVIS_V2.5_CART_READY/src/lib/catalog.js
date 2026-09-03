import { supabase } from "./supabase";
import { products as fallbackProducts } from "../data/products";

const twentyPercentSyrups = new Set([
  "strawberry",
  "passion fruit",
  "passionfruit",
  "mango",
  "mojito",
  "blueberry",
]);

const normalizePromotionText = (value = "") =>
  String(value).toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

export function applyCatalogPromotion(product) {
  const category = normalizePromotionText(product?.category);
  const name = normalizePromotionText(product?.name);
  const isTarget = ["syrup", "syrups"].includes(category) && twentyPercentSyrups.has(name);
  const discountPercent = Number(product?.discountPercent ?? (isTarget ? 20 : 0));

  if (!isTarget || discountPercent <= 0) {
    return { ...product, discountPercent: 0, originalPrice: null };
  }

  const originalPrice = Number(product?.originalPrice || product?.price || 0);
  return {
    ...product,
    originalPrice,
    discountPercent,
    price: Math.round(originalPrice * (100 - discountPercent) / 100),
  };
}

const tiramisuReplacements = {
  "strawberry cheesecake": {
    name: "Tiramisu Classic",
    nameHy: "Տիրամիսու Կլասիկ",
    description: "Դասական տիրամիսու՝ նուրբ կրեմով և սուրճային շերտերով։",
  },
  "brownie cream": {
    name: "Tiramisu Berry Mix",
    nameHy: "Տիրամիսու Բերի Միքս",
    description: "Նուրբ տիրամիսու՝ հատապտղային համեղ շերտով։",
  },
  "blueberry cheesecake": {
    name: "Tiramisu Mango Split",
    nameHy: "Տիրամիսու Մանգո Սփլիթ",
    description: "Նուրբ տիրամիսու՝ արևահամ մանգոյի շերտով։",
  },
};

export async function getCatalogProducts() {
  if (!supabase) return { products: fallbackProducts.map(applyCatalogPromotion), source: "fallback" };

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, sku, name_hy, name_en, description_hy, volume,
      retail_price, horeca_price, bonus_reward, ice_gift_kg, discount_percent,
      stock_quantity, image_url, is_active, sort_order,
      categories ( slug, name_hy, name_en )
    `)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Catalog load failed:", error);
    return { products: fallbackProducts.map(applyCatalogPromotion), source: "fallback", error };
  }

  return {
    source: "supabase",
    products: (data || []).map((item, index) => {
      const originalName = String(item.name_en || item.name_hy || "")
        .toLowerCase()
        .trim();
      const tiramisu = tiramisuReplacements[originalName];

      return applyCatalogPromotion({
        id: item.id,
        sku: item.sku,
        category: item.categories?.slug || "other",
        categoryName: item.categories?.name_hy || "",
        name: tiramisu?.name || item.name_en || item.name_hy,
        nameHy: tiramisu?.nameHy || item.name_hy,
        description: tiramisu?.description || item.description_hy || "",
        volume: item.volume || "",
        price: item.retail_price || 0,
        discountPercent: Number(item.discount_percent || 0),
        horecaPrice: item.horeca_price,
        bonus: item.bonus_reward || 0,
        iceGiftKg: Number(item.ice_gift_kg || 0),
        stock: item.stock_quantity || 0,
        image: tiramisu ? "/assets/aurevis-tiramisu.webp" : item.image_url || null,
        accent: fallbackProducts[index % fallbackProducts.length]?.accent || "#9a762e",
      });
    })
  };
}

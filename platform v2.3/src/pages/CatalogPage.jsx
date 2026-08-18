import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { getCatalogProducts } from "../lib/catalog";

const money = (value) => new Intl.NumberFormat("hy-AM").format(value) + " ֏";

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [source, setSource] = useState("loading");
  const [loading, setLoading] = useState(true);

  async function loadCatalog() {
    setLoading(true);
    const result = await getCatalogProducts();
    setProducts(result.products);
    setSource(result.source);
    setLoading(false);
  }

  useEffect(() => { loadCatalog(); }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["all", ...unique];
  }, [products]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery = !q ||
        product.name?.toLowerCase().includes(q) ||
        product.nameHy?.toLowerCase().includes(q);
      const matchesCategory = category === "all" || product.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  return (
    <section className="page catalog-page">
      <div className="page-heading catalog-heading-row">
        <div>
          <p className="eyebrow dark">AUREVIS CATALOG</p>
          <h1>Պրոֆեսիոնալ կատալոգ</h1>
          <p>Ապրանքները ավտոմատ թարմացվում են Supabase-ից։</p>
        </div>
        <div className={`catalog-source ${source}`}>
          <span>{source === "supabase" ? "● Supabase Live" : source === "fallback" ? "● Demo fallback" : "Բեռնվում է"}</span>
          <button onClick={loadCatalog} disabled={loading} aria-label="Refresh catalog">
            <RefreshCw size={18} className={loading ? "spin" : ""} />
          </button>
        </div>
      </div>

      <div className="catalog-tools">
        <label className="catalog-search">
          <Search size={20} />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Փնտրել՝ Mojito, Vanilla, Raspberry..." />
        </label>

        <div className="catalog-categories">
          {categories.map((item) => (
            <button key={item} className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}>
              {item === "all" ? "Բոլորը" : item}
            </button>
          ))}
        </div>
      </div>

      <div className="catalog-count">{loading ? "Բեռնվում է..." : `${visible.length} ապրանք`}</div>

      <div className="product-grid">
        {visible.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-art" style={{"--accent": product.accent}}>
              {product.image ? (
                <img className="real-product-image" src={product.image} alt={product.name} />
              ) : (
                <div className="mini-bottle">
                  <span className="mini-cap" />
                  <div className="mini-label">
                    <small>AUREVIS</small>
                    <b>{product.name}</b>
                    <span>{product.category === "purees" ? "PREMIUM PURÉE" : "PREMIUM SYRUP"}</span>
                  </div>
                </div>
              )}
            </div>
            <div>
              <span>{product.categoryName || product.category || "AUREVIS"}</span>
              <h2>{product.name}</h2>
              {product.nameHy && product.nameHy !== product.name && <p className="product-hy">{product.nameHy}</p>}
              <p>{product.volume}</p>
              <div className="product-meta">
                {product.bonus > 0 && <small>+{product.bonus} Bonus</small>}
                {product.iceGiftKg > 0 && <small>+{product.iceGiftKg} կգ սառույց</small>}
              </div>
              <div className="price-row">
                <b>{money(product.price)}</b>
                <button>+ Ավելացնել</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!loading && !visible.length && (
        <div className="empty-state">
          <h2>Ապրանք չի գտնվել</h2>
          <p>Փոխիր որոնման բառը կամ ընտրիր այլ բաժին։</p>
        </div>
      )}
    </section>
  );
}

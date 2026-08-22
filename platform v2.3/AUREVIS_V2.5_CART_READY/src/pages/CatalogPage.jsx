import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getCatalogProducts } from "../lib/catalog";
import { useCart } from "../context/CartContext";

const money = (value) => new Intl.NumberFormat("hy-AM").format(value) + " ֏";

const categoryLabels = {
  syrups: "Օշարակներ",
  purees: "Պյուրեներ",
  bakery: "Խմորեղեն",
  desserts: "Դեսերտներ",
  bread: "Հաց",
  equipment: "Սարքավորումներ",
  "bar-tools": "Բար գործիքներ",
  other: "Այլ ապրանքներ",
};

const labelFiles = {
  "passion fruit": "passion-fruit", passionfruit: "passion-fruit",
  "berry mix": "berry-mix", berrymix: "berry-mix", caramel: "caramel",
  blueberry: "blueberry", lime: "lime", lemon: "lemon", raspberry: "raspberry",
  strawberry: "strawberry", "sea buckthorn": "sea-buckthorn", seabuckthorn: "sea-buckthorn",
  peach: "peach", kiwi: "kiwi", coconut: "coconut", pomegranate: "pomegranate",
  mango: "mango", pineapple: "pineapple", cherry: "cherry",
  "black currant": "black-currant", blackcurrant: "black-currant",
  apricot: "apricot", yuzu: "yuzu", pear: "pear", mandarine: "mandarine", mandarin: "mandarine",
};

const slugName = (value = "") => value.toLowerCase().trim().replace(/[_-]+/g, " ").replace(/\s+/g, " ");

function ProductVisual({ product }) {
  if (product.image) {
    return <img className="real-product-image" src={product.image} alt={product.name} />;
  }

  const category = slugName(product.category);
  const isPuree = category === "puree" || category === "purees";
  const isBottle = isPuree || category === "syrup" || category === "syrups";

  if (!isBottle) {
    return (
      <div className="catalog-category-art" aria-label={product.name}>
        <span>AUREVIS</span><b>{product.name}</b>
      </div>
    );
  }

  const label = labelFiles[slugName(product.name)];
  return (
    <div className={`catalog-real-bottle ${isPuree ? "puree" : "syrup"}`}>
      <img className="catalog-bottle-master" src={`/assets/catalog/${isPuree ? "puree" : "syrup"}-master.png`} alt={product.name} />
      {label ? (
        <img className="catalog-bottle-label" src={`/assets/catalog/labels/${label}.png`} alt="" />
      ) : (
        <div className="catalog-generic-label"><small>AUREVIS</small><b>{product.name}</b><span>{isPuree ? "PREMIUM PURÉE" : "PREMIUM SYRUP"}</span></div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState(null);
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
          <p>Պրեմիում օշարակներ, մրգային պյուրեներ և HoReCa լուծումներ՝ մեկ վայրում։</p>
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
              {item === "all" ? "Բոլորը" : categoryLabels[item] || item}
            </button>
          ))}
        </div>
      </div>

      <div className="catalog-count">{loading ? "Բեռնվում է..." : `${visible.length} ապրանք`}</div>

      <div className="product-grid">
        {visible.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-art" style={{"--accent": product.accent}}>
              <ProductVisual product={product} />
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
                <button onClick={() => {
                  addItem(product);
                  setAddedId(product.id);
                  window.setTimeout(() => setAddedId(null), 900);
                }}>{addedId === product.id ? "Ավելացված է ✓" : "+ Ավելացնել"}</button>
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

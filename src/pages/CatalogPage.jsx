import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { products } from "../data/products";

const money = (value) => new Intl.NumberFormat("hy-AM").format(value) + " ֏";

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => !q || p.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <section className="page catalog-page">
      <div className="page-heading">
        <p className="eyebrow dark">AUREVIS CATALOG</p>
        <h1>37 պրոֆեսիոնալ համ</h1>
        <p>Գտեք անհրաժեշտ համը և կառուցեք ձեր signature menu-ն։</p>
      </div>

      <label className="catalog-search">
        <Search size={20} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Փնտրել՝ Mojito, Vanilla, Mango..." />
      </label>

      <div className="catalog-count">{visible.length} ապրանք</div>

      <div className="product-grid">
        {visible.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-image-wrap"><img src={product.image} alt={product.name} /></div>
            <div>
              <span>Professional Syrup</span>
              <h2>{product.name}</h2>
              <p>{product.volume}</p>
              <div className="price-row"><b>{money(product.price)}</b><button>+ Ավելացնել</button></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

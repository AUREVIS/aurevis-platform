import { useMemo, useState } from "react";
import { products } from "../data/products";

const money = (value) => new Intl.NumberFormat("hy-AM").format(value) + " ֏";

export default function CatalogPage() {
  const [category, setCategory] = useState("all");
  const visible = useMemo(
    () => products.filter((p) => category === "all" || p.category === category),
    [category]
  );

  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow dark">AUREVIS CATALOG</p>
        <h1>Պրոֆեսիոնալ ապրանքներ</h1>
      </div>
      <div className="filters">
        {["all", "syrup", "puree"].map((item) => (
          <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>
            {item === "all" ? "Բոլորը" : item === "syrup" ? "Սիրոպներ" : "Պյուրեներ"}
          </button>
        ))}
      </div>
      <div className="product-grid">
        {visible.map((product) => (
          <article className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <div>
              <span>{product.category === "puree" ? "Fruit Purée" : "Professional Syrup"}</span>
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

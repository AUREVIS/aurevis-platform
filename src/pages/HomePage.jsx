import { ArrowRight, BadgeCheck, Calculator, ChefHat, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { flavors } from "../data/products";

const stats = [
  ["37+", "Սիրոպի համ"],
  ["10+", "Պյուրեի համ"],
  ["100+", "Recipe գաղափար"],
  ["HoReCa", "Գործընկերային լուծումներ"],
];

export default function HomePage() {
  return (
    <>
      <section className="hero premium-hero">
        <img src="/assets/hero.jpg" alt="AUREVIS collection" className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-gold-glow" />

        <div className="hero-copy">
          <p className="eyebrow">AUREVIS · PREMIUM HORECA</p>
          <h1>From flavor<br />to signature drinks.</h1>
          <p>
            Պրեմիում սիրոպներ, մրգային պյուրեներ և ամբողջական HoReCa լուծումներ՝
            սրճարանների, ռեստորանների, հյուրանոցների և bakery նախագծերի համար։
          </p>

          <div className="hero-buttons">
            <Link className="button gold" to="/catalog">
              Դիտել 37 համերը <ArrowRight size={18} />
            </Link>
            <Link className="button glass" to="/academy">Բացել Academy-ն</Link>
          </div>

          <div className="hero-stats">
            {stats.map(([value, label]) => (
              <article key={label}><b>{value}</b><span>{label}</span></article>
            ))}
          </div>
        </div>

        <div className="hero-product-stage">
          <div className="bottle-showcase">
            <div className="bottle bottle-puree">
              <span className="pump" />
              <div className="bottle-label">
                <small>AUREVIS</small>
                <b>STRAWBERRY</b>
                <span>PREMIUM PURÉE</span>
              </div>
            </div>
            <div className="bottle bottle-syrup">
              <span className="cap" />
              <div className="bottle-label">
                <small>AUREVIS</small>
                <b>PASSION FRUIT</b>
                <span>PREMIUM SYRUP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-strip premium-strip">
        <article><BadgeCheck /><b>Պրեմիում որակ</b><span>Կայուն համ և արդյունք</span></article>
        <article><ChefHat /><b>Recipe Academy</b><span>Բաղադրատոմսեր և խորհուրդներ</span></article>
        <article><Calculator /><b>Profit Tools</b><span>Ինքնարժեք և շահույթ</span></article>
        <article><Truck /><b>Առաքում</b><span>Ամբողջ Հայաստանում</span></article>
      </section>

      <section className="flavor-showcase">
        <div className="section-heading">
          <p className="eyebrow dark">EXPLORE THE COLLECTION</p>
          <h2>37 համ՝ մեկ պրոֆեսիոնալ համակարգում</h2>
          <p>Ամբողջական սիրոպների շարք՝ սուրճի, թեյի, լիմոնադի, mocktail-ի, cocktail-ի և dessert pairing-ի համար։</p>
        </div>

        <div className="flavor-chip-grid">
          {flavors.map((flavor) => <span key={flavor}>{flavor}</span>)}
        </div>

        <Link to="/catalog" className="collection-link">
          Բացել ամբողջ կատալոգը <ArrowRight size={18} />
        </Link>
      </section>
<section className="featured-products">
  <div className="section-heading">
    <p className="eyebrow dark">FEATURED PRODUCTS</p>
    <h2>Մեր ամենապահանջված համերը</h2>
    <p>Ընտրված համեր՝ սուրճի, լիմոնադի, cocktail-ի և dessert-ի համար։</p>
  </div>

  <div className="featured-grid">
    {[
      { name: "Strawberry", type: "Premium Purée", accent: "#b72f55" },
      { name: "Passion Fruit", type: "Premium Syrup", accent: "#d88632" },
      { name: "Mango", type: "Premium Purée", accent: "#d9a42e" },
      { name: "Blue Curacao", type: "Premium Syrup", accent: "#2d84b7" },
    ].map((item) => (
      <article className="featured-card" key={item.name}>
        <div className="product-art" style={{ "--accent": item.accent }}>
          <div className="mini-bottle">
            <span className="mini-cap" />
            <div className="mini-label">
              <small>AUREVIS</small>
              <b>{item.name}</b>
              <span>{item.type}</span>
            </div>
          </div>
        </div>

        <div className="featured-card-copy">
          <h3>{item.name}</h3>
          <p>{item.type}</p>
          <Link to="/catalog">Տեսնել կատալոգում <ArrowRight size={16} /></Link>
        </div>
      </article>
    ))}
  </div>
</section>
      <section className="story premium-story">
        <div>
          <p className="eyebrow dark">AUREVIS PLATFORM</p>
          <h2>Ոչ միայն ապրանք։ Ամբողջական HoReCa գործընկերություն։</h2>
          <p>Պատվերներ, Wallet, Bonus, Academy, սարքավորումներ և Admin Control Center՝ մեկ միասնական հարթակում։</p>
          <div className="story-points">
            <span><Sparkles size={17} /> Menu & recipe support</span>
            <span><Sparkles size={17} /> Equipment program</span>
            <span><Sparkles size={17} /> Business calculators</span>
          </div>
        </div>
        <img src="/assets/desserts.jpg" alt="AUREVIS products" />
      </section>
    </>  );
}

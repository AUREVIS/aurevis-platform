import { ArrowRight, BadgeCheck, Calculator, ChefHat, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";

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
          <p>Պրեմիում սիրոպներ, մրգային պյուրեներ և ամբողջական HoReCa լուծումներ՝ սրճարանների, ռեստորանների, հյուրանոցների և bakery նախագծերի համար։</p>
          <div className="hero-buttons">
            <Link className="button gold" to="/catalog">Դիտել 37 համերը <ArrowRight size={18} /></Link>
            <Link className="button glass" to="/academy">Բացել Academy-ն</Link>
          </div>

          <div className="hero-stats">
            {stats.map(([value, label]) => (
              <article key={label}><b>{value}</b><span>{label}</span></article>
            ))}
          </div>
        </div>

        <div className="hero-product-stage">
          <div className="stage-card">
            <img src="/assets/bottle_reference.jpeg" alt="AUREVIS bottle style" />
            <div><span>PREMIUM PRODUCT EXPERIENCE</span><b>Շշի ձևին համապատասխան պիտակ</b></div>
          </div>
          <div className="floating-orb orb-one" />
          <div className="floating-orb orb-two" />
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
          <p>Սիրոպներ սուրճի, թեյի, լիմոնադի, mocktail-ի, cocktail-ի և dessert pairing-ի համար։</p>
        </div>

        <div className="flavor-board-grid">
          <article><img src="/assets/flavors_board_1.png" alt="AUREVIS flavors list" /></article>
          <article><img src="/assets/flavors_board_2.png" alt="AUREVIS flavors list" /></article>
        </div>

        <Link to="/catalog" className="collection-link">Բացել ամբողջ կատալոգը <ArrowRight size={18} /></Link>
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
    </>
  );
}

import { ArrowRight, BadgeCheck, Calculator, ChefHat, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <img src="/assets/hero.jpg" alt="AUREVIS collection" className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-copy">
          <p className="eyebrow">AUREVIS · PREMIUM HORECA</p>
          <h1>Crafted for cafés.<br />Designed for growth.</h1>
          <p>Պրեմիում սիրոպներ, մրգային պյուրեներ և HoReCa լուծումներ՝ ստեղծված մասնագետների համար։</p>
          <div className="hero-buttons">
            <Link className="button gold" to="/catalog">Դիտել կատալոգը <ArrowRight size={18} /></Link>
            <Link className="button glass" to="/academy">Բացել Academy-ն</Link>
          </div>
        </div>
      </section>

      <section className="feature-strip">
        <article><BadgeCheck /><b>Պրեմիում որակ</b><span>Կայուն համ և արդյունք</span></article>
        <article><ChefHat /><b>Recipe Academy</b><span>Բաղադրատոմսեր և խորհուրդներ</span></article>
        <article><Calculator /><b>Profit Tools</b><span>Ինքնարժեք և շահույթ</span></article>
        <article><Truck /><b>Առաքում</b><span>Ամբողջ Հայաստանում</span></article>
      </section>

      <section className="story">
        <div>
          <p className="eyebrow dark">AUREVIS PLATFORM</p>
          <h2>Ոչ միայն ապրանք։ Ամբողջական HoReCa գործընկերություն։</h2>
          <p>Պատվերներ, Wallet, Bonus, Academy, սարքավորումներ և Admin Control Center՝ մեկ հարթակում։</p>
        </div>
        <img src="/assets/desserts.jpg" alt="AUREVIS products" />
      </section>
    </>
  );
}

import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  ChefHat,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  ["37+", "Օշարակի համ"],
  ["10+", "Պյուրեի համ"],
  ["100+", "Recipe գաղափար"],
  ["HoReCa", "Գործընկերային լուծումներ"],
];

export default function HomePage() {
  return (
    <>
      <section className="hero premium-hero">
        <img
          src="/assets/hero.jpg"
          alt="AUREVIS collection"
          className="hero-bg"
        />

        <div className="hero-overlay" />
        <div className="hero-gold-glow" />

        <div className="hero-copy">
  <p className="eyebrow">
    ՀԱՅԱՍՏԱՆՈՒՄ ԱՌԱՋԻՆ ՄԻԱՍՆԱԿԱՆ ՊՐՈՖԵՍԻՈՆԱԼ HORECA ՀԱՐԹԱԿԸ
  </p>

  <h1>
    Համից՝ մինչև
    <br />
    յուրահատուկ ըմպելիք։
  </h1>

  <p>
    Պրեմիում օշարակներ, մրգային պյուրեներ և ամբողջական
    HoReCa լուծումներ՝ սրճարանների, ռեստորանների,
    հյուրանոցների և հրուշակեղենի արտադրամասերի համար։
  </p>

  <div className="hero-buttons">
    <Link className="button gold" to="/catalog">
      Բացել կատալոգը
      <ArrowRight size={18} />
    </Link>

    <a className="button glass" href="#contact">
      Դառնալ HoReCa գործընկեր
    </a>
  </div>

  <div className="hero-stats">
    <article>
      <b>37+</b>
      <span>Օշարակի համ</span>
    </article>

    <article>
      <b>10+</b>
      <span>Մրգային պյուրե</span>
    </article>

    <article>
      <b>Անվճար</b>
      <span>Առաքում Հայաստանում</span>
    </article>

    <article>
      <b>Bonus</b>
      <span>Միասնական հաշվեկշիռ</span>
    </article>
  </div>
</div>

          <div className="hero-buttons">
            <Link
              className="button gold"
              to="/catalog"
            >
              Դիտել կատալոգը
              <ArrowRight size={18} />
            </Link>

            <Link
              className="button glass"
              to="/academy"
            >
              Բացել Academy-ն
            </Link>
          </div>

          <div className="hero-stats">
            {stats.map(([value, label]) => (
              <article key={label}>
                <b>{value}</b>
                <span>{label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="feature-strip premium-strip">
        <article>
          <BadgeCheck />
          <b>Պրեմիում որակ</b>
          <span>Կայուն համ և արդյունք</span>
        </article>

        <article>
          <ChefHat />
          <b>Recipe Academy</b>
          <span>Բաղադրատոմսեր և խորհուրդներ</span>
        </article>

        <article>
          <Calculator />
          <b>Profit Tools</b>
          <span>Ինքնարժեք և շահույթ</span>
        </article>

        <article>
          <Truck />
          <b>Անվճար առաքում</b>
          <span>Ամբողջ Հայաստանում</span>
        </article>
      </section>

      <section className="story premium-story">
        <div>
          <p className="eyebrow dark">
            AUREVIS PLATFORM
          </p>

          <h2>
            Ոչ միայն ապրանք։ Ամբողջական HoReCa
            գործընկերություն։
          </h2>

          <p>
            Պատվերներ, Wallet, Bonus, Academy,
            սարքավորումներ և Admin Control Center՝
            մեկ միասնական հարթակում։
          </p>

          <div className="story-points">
            <span>
              <Sparkles size={17} />
              Menu & recipe support
            </span>

            <span>
              <Sparkles size={17} />
              Equipment program
            </span>

            <span>
              <Sparkles size={17} />
              Business calculators
            </span>
          </div>
        </div>
  <img
  src="/assets/aurevis-partnership.jpg"
  alt="AUREVIS ապրանքներ"
/>
      </section>

      <section id="contact" className="home-contact-wrapper">
        <div className="catalog-contact-section">
          <div className="catalog-contact-glow" />

          <div className="catalog-contact-heading">
            <span>AUREVIS · CONTACT</span>

            <h2>
              Պատվերներ և համագործակցություն
            </h2>

            <p>
              Ապրանքների պատվերի, HoReCa
              համագործակցության և գործնական
              առաջարկների համար կապվեք մեզ հետ։
            </p>
          </div>

          <div className="catalog-contact-cards">
            <a
              className="catalog-contact-card"
              href="tel:+37491024232"
            >
              <span className="contact-icon">
                ☎
              </span>

              <div>
                <small>Զանգահարել</small>
                <b>091 024 232</b>
                <p>Տնօրեն՝ Արման</p>
              </div>
            </a>

            <a
              className="catalog-contact-card"
              href="mailto:aurevis@mail.ru"
            >
              <span className="contact-icon">
                ✉
              </span>

              <div>
                <small>Էլեկտրոնային փոստ</small>
                <b>aurevis@mail.ru</b>
                <p>Պատվերներ և առաջարկներ</p>
              </div>
            </a>

            <a
              className="catalog-contact-card"
              href="https://www.instagram.com/aureviscompany/"
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact-icon">
                ◎
              </span>

              <div>
                <small>Instagram</small>
                <b>@aureviscompany</b>
                <p>Նորություններ և տեսականի</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

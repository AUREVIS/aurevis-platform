import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  ChefHat,
  Gift,
  Snowflake,
  Percent,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();

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
            {t("heroEyebrow")}
          </p>

          <h1>
            {t("heroTitleA")}
            <br />
            {t("heroTitleB")}
          </h1>

          <p>
            {t("heroText")}
          </p>

          <div className="hero-buttons">
            <Link className="button gold" to="/catalog">
              {t("openCatalog")}
              <ArrowRight size={18} />
            </Link>

            <Link className="button glass" to="/horeca-benefits">
              {t("becomePartner")}
            </Link>
          </div>

          <div className="hero-stats">
            <article>
              <b>37+</b>
              <span>{t("syrupFlavors")}</span>
            </article>

            <article>
              <b>10+</b>
              <span>{t("purees")}</span>
            </article>

            <article>
              <b>{t("free")}</b>
              <span>{t("delivery")}</span>
            </article>

            <article>
              <b>Bonus</b>
              <span>{t("unifiedBalance")}</span>
            </article>
          </div>
        </div>
      </section>

      <section className="home-shop-sections">
        <div className="home-section-heading">
          <p className="eyebrow dark">AUREVIS COLLECTION</p>
          <h2>{t("discoverProducts")}</h2>
          <p>{t("discoverProductsText")}</p>
        </div>

        <div className="home-category-grid">
          <Link className="home-category-card" to="/catalog">
            <img src="/assets/syrup-strawberry.webp" alt={t("categorySyrups")} />
            <span className="home-category-shade" />
            <div>
              <small>37+ {t("syrupFlavors")}</small>
              <h3>{t("professionalSyrups")}</h3>
              <p>{t("professionalSyrupsText")}</p>
              <b>{t("viewCollection")} <ArrowRight size={17} /></b>
            </div>
          </Link>

          <Link className="home-category-card" to="/catalog">
            <img src="/assets/Mango.png" alt={t("categoryPurees")} />
            <span className="home-category-shade" />
            <div>
              <small>10+ {t("purees")}</small>
              <h3>{t("professionalPurees")}</h3>
              <p>{t("professionalPureesText")}</p>
              <b>{t("viewCollection")} <ArrowRight size={17} /></b>
            </div>
          </Link>

          <Link className="home-category-card" to="/horeca-benefits">
            <img src="/assets/aurevis-partnership.jpg" alt={t("horecaSolutions")} />
            <span className="home-category-shade" />
            <div>
              <small>AUREVIS HoReCa</small>
              <h3>{t("horecaSolutions")}</h3>
              <p>{t("horecaSolutionsText")}</p>
              <b>{t("learnBenefits")} <ArrowRight size={17} /></b>
            </div>
          </Link>
        </div>
      </section>

      <section className="home-benefits-promo">
        <div className="home-benefits-copy">
          <p className="eyebrow">{t("benefitsEyebrow")}</p>
          <h2>{t("homeBenefitsTitle")}</h2>
          <p>{t("homeBenefitsText")}</p>
          <Link className="button gold" to="/horeca-benefits">
            {t("learnBenefits")} <ArrowRight size={18} />
          </Link>
        </div>

        <div className="home-benefit-items">
          <article><Snowflake /><b>5 KG</b><span>{t("iceGiftShort")}</span></article>
          <article><Percent /><b>5–9%</b><span>{t("cashbackShort")}</span></article>
          <article><Gift /><b>3 {t("monthsShort")}</b><span>{t("giftsShort")}</span></article>
        </div>
      </section>

      <section className="feature-strip premium-strip">
        <article>
          <BadgeCheck />
          <b>{t("quality")}</b>
          <span>{t("stable")}</span>
        </article>

        <article>
          <ChefHat />
          <b>Recipe Academy</b>
          <span>{t("recipes")}</span>
        </article>

        <article>
          <Calculator />
          <b>{t("profitTools")}</b>
          <span>{t("costProfit")}</span>
        </article>

        <article>
          <Truck />
          <b>{t("freeDelivery")}</b>
          <span>{t("allArmenia")}</span>
        </article>
      </section>

      <section className="story premium-story">
        <div>
          <p className="eyebrow dark">
            AUREVIS PLATFORM
          </p>

          <h2>
            {t("partnershipTitle")}
          </h2>

          <p>
            {t("partnershipText")}
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

          <Link className="story-benefits-link" to="/horeca-benefits">
            {t("learnBenefits")} <ArrowRight size={17} />
          </Link>
        </div>

        <img
          src="/assets/aurevis-partnership.jpg"
          alt="AUREVIS ապրանքներ"
        />
      </section>

      <section
        id="contact"
        className="home-contact-wrapper"
      >
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

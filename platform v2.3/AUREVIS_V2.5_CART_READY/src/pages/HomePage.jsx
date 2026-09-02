import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  ChefHat,
  Gift,
  Snowflake,
  Percent,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { getCatalogProducts } from "../lib/catalog";

const featuredSelection = [
  { name: "strawberry", category: "syrup", image: "/assets/syrups/strawberry.png" },
  { name: "passion fruit", category: "syrup", image: "/assets/syrups/passion-fruit.png" },
  { name: "mojito", category: "syrup", image: "/assets/syrups/mojito.png" },
  { name: "mango", category: "puree", image: "/assets/Mango.png" },
  { name: "berry mix", category: "puree", image: "/assets/Berri Mix.png" },
  { name: "raspberry", category: "puree", image: "/assets/RaspBerry.png" },
];

const money = (value, language) =>
  new Intl.NumberFormat({ hy: "hy-AM", ru: "ru-RU", en: "en-US", ka: "ka-GE" }[language] || "hy-AM")
    .format(Number(value || 0)) + " ֏";

const normalized = (value = "") => String(value).toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

export default function HomePage() {
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    let active = true;

    getCatalogProducts().then(({ products }) => {
      if (!active) return;

      const selected = featuredSelection.map((wanted) => {
        const match = products.find((product) => {
          const name = normalized(`${product.name || ""} ${product.nameHy || ""}`);
          const category = normalized(product.category);
          return name.includes(wanted.name) && category.includes(wanted.category);
        });

        return match ? { ...match, featuredImage: wanted.image } : null;
      }).filter(Boolean);

      setFeaturedProducts(selected);
    });

    return () => { active = false; };
  }, []);

  function addFeatured(product) {
    addItem(product);
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1200);
  }

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

        <div className="hero-mix-scene" aria-hidden="true">
          <div className="mix-bottle-wrap">
            <img
              className="mix-real-bottle"
              src="/assets/hero-real-bottle-v2.webp"
              alt=""
            />
            <span className="mix-stream" />
          </div>

          <div className="mix-real-glass-wrap">
            <img
              className="mix-real-glass"
              src="/assets/hero-real-glass-v2.webp"
              alt=""
            />
            <i className="mix-bubble bubble-one" />
            <i className="mix-bubble bubble-two" />
            <i className="mix-bubble bubble-three" />
            <i className="mix-bubble bubble-four" />
          </div>

          <span className="mix-scene-label">AUREVIS · SIGNATURE MIX</span>
        </div>

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

      {featuredProducts.length > 0 && (
        <section className="home-best-sellers">
          <div className="home-best-heading">
            <div>
              <p className="eyebrow dark">AUREVIS BEST SELLERS</p>
              <h2>{t("bestSellersTitle")}</h2>
              <p>{t("bestSellersText")}</p>
            </div>
            <Link to="/catalog">{t("viewAllProducts")} <ArrowRight size={17} /></Link>
          </div>

          <div className="home-best-grid">
            {featuredProducts.map((product) => (
              <article className="home-best-card" key={product.id}>
                <Link
                  className={`home-best-image ${product.category?.includes("puree") ? "puree-featured" : ""}`}
                  to="/catalog"
                >
                  <span>{t("bestSellerBadge")}</span>
                  <img src={product.featuredImage} alt={product.name} loading="lazy" />
                </Link>
                <div className="home-best-info">
                  <small>{t(product.category?.includes("puree") ? "categoryPurees" : "categorySyrups")}</small>
                  <h3>{language === "hy" && product.nameHy ? product.nameHy : product.name}</h3>
                  <p>{product.volume || (product.category?.includes("puree") ? "1 L" : "700 ml")}</p>
                  <div>
                    <b>{money(product.price, language)}</b>
                    <button type="button" onClick={() => addFeatured(product)}>
                      <ShoppingBag size={17} />
                      {addedId === product.id ? t("added") : t("add")}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

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

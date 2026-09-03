import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getCatalogProducts } from "../lib/catalog";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { getCatalogImage } from "./CatalogPage";

const money = (value, language = "hy") =>
  `${new Intl.NumberFormat({ hy: "hy-AM", ru: "ru-RU", en: "en-US", ka: "ka-GE" }[language] || "hy-AM").format(Number(value || 0))} ֏`;

const copy = {
  hy: { back: "Վերադառնալ կատալոգ", syrup: "Պրոֆեսիոնալ օշարակ", puree: "Պրոֆեսիոնալ պյուրե", volume: "Ծավալ", dose: "Առաջարկվող չափաբաժին", yield: "Մոտավոր բաժակներ", syrupDose: "15–20 մլ", pureeDose: "25–30 մլ", syrupYield: "մինչև 50 բաժակ", pureeYield: "մինչև 33 բաժակ", add: "Ավելացնել զամբյուղ", added: "Ավելացված է", quality: "Պրոֆեսիոնալ որակ", stable: "Կայուն համ և գույն յուրաքանչյուր մատուցման ժամանակ", use: "Հարմար է լիմոնադների, սուրճերի, թեյերի, կոկտեյլների և աղանդերի համար։", unavailable: "Ապրանքը չի գտնվել կամ այլևս հասանելի չէ։" },
  ru: { back: "Вернуться в каталог", syrup: "Профессиональный сироп", puree: "Профессиональное пюре", volume: "Объём", dose: "Рекомендуемая дозировка", yield: "Примерное количество порций", syrupDose: "15–20 мл", pureeDose: "25–30 мл", syrupYield: "до 50 порций", pureeYield: "до 33 порций", add: "Добавить в корзину", added: "Добавлено", quality: "Профессиональное качество", stable: "Стабильный вкус и цвет в каждой подаче", use: "Подходит для лимонадов, кофе, чая, коктейлей и десертов.", unavailable: "Товар не найден или больше недоступен." },
  en: { back: "Back to catalog", syrup: "Professional syrup", puree: "Professional purée", volume: "Volume", dose: "Recommended serving", yield: "Approximate yield", syrupDose: "15–20 ml", pureeDose: "25–30 ml", syrupYield: "up to 50 drinks", pureeYield: "up to 33 drinks", add: "Add to cart", added: "Added", quality: "Professional quality", stable: "Consistent flavor and color in every serve", use: "Ideal for lemonades, coffee, tea, cocktails and desserts.", unavailable: "This product could not be found or is no longer available." },
  ka: { back: "კატალოგში დაბრუნება", syrup: "პროფესიონალური სიროფი", puree: "პროფესიონალური პიურე", volume: "მოცულობა", dose: "რეკომენდებული დოზა", yield: "დაახლოებით პორციები", syrupDose: "15–20 მლ", pureeDose: "25–30 მლ", syrupYield: "50-მდე სასმელი", pureeYield: "33-მდე სასმელი", add: "კალათაში დამატება", added: "დამატებულია", quality: "პროფესიონალური ხარისხი", stable: "სტაბილური გემო და ფერი ყოველ ჯერზე", use: "იდეალურია ლიმონათებისთვის, ყავისთვის, ჩაისთვის, კოქტეილებისა და დესერტებისთვის.", unavailable: "პროდუქტი ვერ მოიძებნა ან აღარ არის ხელმისაწვდომი." },
};

export default function ProductPage() {
  const { productId } = useParams();
  const { language } = useLanguage();
  const { addItem } = useCart();
  const text = copy[language] || copy.hy;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let active = true;
    getCatalogProducts().then(({ products }) => {
      if (!active) return;
      setProduct((products || []).find((item) => String(item.id) === String(productId)) || null);
      setLoading(false);
    });
    return () => { active = false; };
  }, [productId]);

  if (loading) return <div className="route-loader">Բեռնվում է…</div>;
  if (!product) return <section className="page product-page"><div className="empty-state"><h2>{text.unavailable}</h2><Link to="/catalog">{text.back}</Link></div></section>;

  const category = String(product.category || "").toLowerCase();
  const isPuree = category === "puree" || category === "purees";
  const image = getCatalogImage(product);

  function addToCart() {
    addItem(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <section className="page product-page">
      <Link className="product-page-back" to="/catalog"><ArrowLeft size={18} /> {text.back}</Link>
      <div className="product-page-layout">
        <div className={`product-page-visual ${isPuree ? "puree" : "syrup"}`}>
          {product.discountPercent > 0 && <span className="catalog-sale-badge">−{product.discountPercent}%</span>}
          {image ? <img src={image} alt={product.name} /> : <div className="product-page-placeholder">AUREVIS</div>}
        </div>

        <div className="product-page-copy">
          <p className="eyebrow dark">AUREVIS · {isPuree ? text.puree : text.syrup}</p>
          <h1>{language === "hy" && product.nameHy ? product.nameHy : product.name}</h1>
          {product.nameHy && product.nameHy !== product.name && <span className="product-page-secondary-name">{product.name}</span>}
          <p className="product-page-description">{product.description || text.use}</p>

          <div className="product-page-price">
            {product.originalPrice && <del>{money(product.originalPrice, language)}</del>}
            <b>{money(product.price, language)}</b>
          </div>

          <div className="product-page-specs">
            <article><span>{text.volume}</span><b>{product.volume || "1 L"}</b></article>
            <article><span>{text.dose}</span><b>{isPuree ? text.pureeDose : text.syrupDose}</b></article>
            <article><span>{text.yield}</span><b>{isPuree ? text.pureeYield : text.syrupYield}</b></article>
          </div>

          <div className="product-page-quality"><BadgeCheck /><span><b>{text.quality}</b><small>{text.stable}</small></span></div>

          <div className="product-page-order">
            <div className="catalog-quantity-control">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={18} /></button>
              <b>{quantity}</b>
              <button type="button" onClick={() => setQuantity((value) => value + 1)}><Plus size={18} /></button>
            </div>
            <button type="button" className="product-page-add" onClick={addToCart}><ShoppingBag size={20} /> {added ? text.added : text.add}<b>{money(product.price * quantity, language)}</b></button>
          </div>

          <Link className="product-page-academy" to="/academy"><Sparkles size={18} /> AUREVIS Academy</Link>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  Minus,
  Plus,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { getCatalogProducts } from "../lib/catalog";
import { useCart } from "../context/CartContext";

const money = (value) =>
  new Intl.NumberFormat("hy-AM").format(Number(value || 0)) + " ֏";

const categoryLabels = {
  syrups: "Օշարակներ",
  syrup: "Օշարակներ",
  purees: "Պյուրեներ",
  puree: "Պյուրեներ",
  bakery: "Խմորեղեն",
  desserts: "Դեսերտներ",
  bread: "Հաց",
  equipment: "Սարքավորումներ",
  "bar-tools": "Բար գործիքներ",
  other: "Այլ ապրանքներ",
};

const syrupImages = [
  { names: ["strawberry"], image: "/assets/syrups/strawberry.png" },
  { names: ["raspberry"], image: "/assets/syrups/raspberry.png" },
  { names: ["passion fruit", "passionfruit", "maracuya"], image: "/assets/syrups/passion-fruit.png" },
  { names: ["berry mix", "berrymix"], image: "/assets/syrups/berry-mix.png" },
  { names: ["chocolate"], image: "/assets/syrups/chocolate.png" },
  { names: ["salted caramel"], image: "/assets/syrups/salted-caramel.png" },
  { names: ["caramel"], image: "/assets/syrups/caramel.png" },
  { names: ["vanilla"], image: "/assets/syrups/vanilla.png" },
  { names: ["mango"], image: "/assets/syrups/mango.png" },
  { names: ["mojito"], image: "/assets/syrups/mojito.png" },
  { names: ["lemongrass", "lemon grass"], image: "/assets/syrups/lemongrass.png" },
  { names: ["lime"], image: "/assets/syrups/lime.png" },
  { names: ["lemon"], image: "/assets/syrups/lemon.png" },
  { names: ["peach"], image: "/assets/syrups/peach.png" },
  { names: ["blueberry"], image: "/assets/syrups/blueberry.png" },
  { names: ["black currant", "blackcurrant"], image: "/assets/syrups/black-currant.png" },
  { names: ["cherry"], image: "/assets/syrups/cherry.png" },
  { names: ["banana"], image: "/assets/syrups/banana.png" },
  { names: ["coconut"], image: "/assets/syrups/coconut.png" },
  { names: ["lychee"], image: "/assets/syrups/lychee.png" },
  { names: ["sea buckthorn", "seabuckthorn"], image: "/assets/syrups/sea-buckthorn.png" },
  { names: ["pomegranate"], image: "/assets/syrups/pomegranate.png" },
  { names: ["pineapple"], image: "/assets/syrups/pineapple.png" },
  { names: ["mandarine", "mandarin"], image: "/assets/syrups/mandarine.png" },
  { names: ["blue curacao", "bluecuracao"], image: "/assets/syrups/blue-curacao.png" },
  { names: ["grapefruit"], image: "/assets/syrups/grapefruit.png" },
  { names: ["orange"], image: "/assets/syrups/orange.png" },
  { names: ["green apple", "apple"], image: "/assets/syrups/apple.png" },
  { names: ["watermelon"], image: "/assets/syrups/watermelon.png" },
  { names: ["melon"], image: "/assets/syrups/melon.png" },
  { names: ["yuzu"], image: "/assets/syrups/yuzu.png" },
  { names: ["rhubarb"], image: "/assets/syrups/rhubarb.png" },
  { names: ["grape"], image: "/assets/syrups/grape.png" },
  { names: ["hazelnut"], image: "/assets/syrups/hazelnut.png" },
  { names: ["mint"], image: "/assets/syrups/mint.png" },
  { names: ["pistachio", "pistaco"], image: "/assets/syrups/pistachio.png" },
  { names: ["cinnamon", "cinamonn"], image: "/assets/syrups/cinnamon.png" },
  { names: ["grenadine"], image: "/assets/syrups/grenadine.png" },
  { names: ["ginger"], image: "/assets/syrups/ginger.png" },
  { names: ["rose"], image: "/assets/syrups/rose.png" },
  { names: ["apricot"], image: "/assets/syrups/apricot.png" },
];

const catalogImages = [
  {
    names: ["club sandwich bread"],
    image: "/assets/club-sandwich-bread.webp",
  },
  {
    names: ["brioche bread"],
    image: "/assets/brioche-bread.webp",
  },
  {
    names: ["tiramisu", "տիրամիսու"],
    image: "/assets/aurevis-tiramisu.webp",
  },
  {
    names: ["butter croissant"],
    image: "/assets/butter-croissant.webp",
  },
  {
    names: ["chocolate croissant"],
    image: "/assets/chocolate-croissant.webp",
  },
  {
    names: ["almond croissant"],
    image: "/assets/almond-croissant.webp",
  },
  {
    names: ["passion fruit", "passionfruit", "maracuya"],
    image: "/assets/Passion Fruit.png",
  },
  {
    names: ["berry mix", "berrymix", "berri mix"],
    image: "/assets/Berri Mix.png",
  },
  {
    names: ["black currant", "blackcurrant"],
    image: "/assets/BlackCurrant.png",
  },
  {
    names: ["blueberry"],
    image: "/assets/Blueberry.png",
  },
  {
    names: ["raspberry"],
    image: "/assets/RaspBerry.png",
  },
  {
    names: ["strawberry"],
    image: "/assets/Strawberry.png",
  },
  {
    names: ["pineapple"],
    image: "/assets/Pineapple.png",
  },
  {
    names: ["banana"],
    image: "/assets/Banana.png",
  },
  {
    names: ["cherry"],
    image: "/assets/Cherry.png",
  },
  {
    names: ["coconut"],
    image: "/assets/Coconut.png",
  },
  {
    names: ["kiwi"],
    image: "/assets/Kiwi.png",
  },
  {
    names: ["mango"],
    image: "/assets/Mango.png",
  },
  {
    names: ["yuzu"],
    image: "/assets/Yuzu.png",
  },
  {
    names: ["caramel"],
    image: "/assets/Caramel.png",
  },
];

const normalizeText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

const containsPhrase = (text, phrase) =>
  ` ${text} `.includes(` ${normalizeText(phrase)} `);

function getCatalogImage(product) {
  const productText = normalizeText(
    `${product.name || ""} ${product.nameHy || ""}`
  );

  const category = normalizeText(product.category);
  const isSyrup = category === "syrup" || category === "syrups";

  if (isSyrup) {
    const matchedSyrup = syrupImages.find((item) =>
      item.names.some((name) => containsPhrase(productText, name))
    );

    if (matchedSyrup) {
      return matchedSyrup.image;
    }

    return product.image || product.image_url || product.imageUrl || "";
  }

  const matchedImage = catalogImages.find((item) =>
    item.names.some((name) => productText.includes(name))
  );

  if (matchedImage) {
    return matchedImage.image;
  }

  const isBottle =
    category === "puree" ||
    category === "purees" ||
    category === "syrup" ||
    category === "syrups";

  if (!isBottle) {
    return (
      product.image ||
      product.image_url ||
      product.imageUrl ||
      ""
    );
  }

  return "";
}

function ProductVisual({ product, modal = false }) {
  const image = getCatalogImage(product);
  const category = normalizeText(product.category);

  const isPuree =
    category === "puree" ||
    category === "purees";

  const isSyrup =
    category === "syrup" ||
    category === "syrups";

  if (image) {
    return (
      <img
        className={`real-product-image ${
          modal ? "modal-product-image" : ""
        }`}
        src={image}
        alt={product.name}
        loading="lazy"
      />
    );
  }

  if (isPuree || isSyrup) {
    return (
      <div
        className={`mini-bottle ${
          isPuree ? "puree-bottle" : "syrup-bottle"
        }`}
      >
        {isPuree ? (
          <span className="mini-pump" />
        ) : (
          <span className="mini-cap" />
        )}

        <div className="mini-label">
          <small>AUREVIS</small>
          <b>{product.name}</b>
          <span>
            {isPuree
              ? "PREMIUM PURÉE"
              : "PREMIUM SYRUP"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="catalog-category-art"
      aria-label={product.name}
    >
      <span>AUREVIS</span>
      <b>{product.name}</b>
    </div>
  );
}

export default function CatalogPage() {
  const { addItem } = useCart();

  const [addedId, setAddedId] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  async function loadCatalog() {
    setLoading(true);

    try {
      const result = await getCatalogProducts();
      setProducts(result.products || []);
    } catch (error) {
      console.error("Catalog loading failed:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCatalog();
  }, []);

  useEffect(() => {
    if (!selectedProduct) return undefined;

    document.body.classList.add("catalog-modal-open");

    const closeWithEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    };

    window.addEventListener("keydown", closeWithEscape);

    return () => {
      document.body.classList.remove("catalog-modal-open");
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [selectedProduct]);

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return ["all", ...unique];
  }, [products]);

  const visible = useMemo(() => {
    const searchText = normalizeText(query);

    return products.filter((product) => {
      const productName = normalizeText(
        `${product.name || ""} ${product.nameHy || ""}`
      );

      if (normalizeText(product.name) === "aurevis") {
        return false;
      }

      const matchesQuery =
        !searchText ||
        productName.includes(searchText);

      const matchesCategory =
        category === "all" ||
        product.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  function handleAddToCart(product) {
    addItem(product);
    setAddedId(product.id);

    window.setTimeout(() => {
      setAddedId(null);
    }, 900);
  }

  function openProduct(product) {
    setSelectedProduct(product);
    setQuantity(1);
  }

  function addSelectedProduct() {
    for (let index = 0; index < quantity; index += 1) {
      addItem(selectedProduct);
    }

    setAddedId(selectedProduct.id);
    setSelectedProduct(null);

    window.setTimeout(() => {
      setAddedId(null);
    }, 900);
  }

  return (
    <section className="page catalog-page">
      <div className="page-heading catalog-heading-row">
        <div>
          <p className="eyebrow dark">
            AUREVIS CATALOG
          </p>

          <h1>Պրոֆեսիոնալ կատալոգ</h1>

          <p>
            Պրեմիում օշարակներ, մրգային պյուրեներ և
            HoReCa լուծումներ՝ մեկ վայրում։
          </p>
        </div>
      </div>

      <div className="catalog-tools">
        <label className="catalog-search">
          <Search size={20} />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Փնտրել՝ Mojito, Vanilla, Raspberry..."
          />
        </label>

        <div className="catalog-categories">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={
                category === item ? "active" : ""
              }
              onClick={() => setCategory(item)}
            >
              {item === "all"
                ? "Բոլորը"
                : categoryLabels[item] || item}
            </button>
          ))}
        </div>
      </div>

      <div className="catalog-count">
        {loading
          ? "Բեռնվում է..."
          : `${visible.length} ապրանք`}
      </div>

      <div className="product-grid">
        {visible.map((product) => (
          <article
            className="product-card catalog-clickable-card"
            key={product.id}
            role="button"
            tabIndex={0}
            onClick={() => openProduct(product)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openProduct(product);
              }
            }}
          >
            <div
              className="product-art"
              style={{
                "--accent":
                  product.accent || "#c59a42",
              }}
            >
              <ProductVisual product={product} />
            </div>

            <div>
              <span>
                {product.categoryName ||
                  categoryLabels[product.category] ||
                  product.category ||
                  "AUREVIS"}
              </span>

              <h2>{product.name}</h2>

              {product.nameHy &&
                product.nameHy !== product.name && (
                  <p className="product-hy">
                    {product.nameHy}
                  </p>
                )}

              <p>{product.volume || "1 լիտր"}</p>

              <div className="product-meta">
                {product.bonus > 0 && (
                  <small>
                    +{product.bonus} Bonus
                  </small>
                )}

                {product.iceGiftKg > 0 && (
                  <small>
                    +{product.iceGiftKg} կգ սառույց
                  </small>
                )}
              </div>

              <div className="price-row">
                <b>{money(product.price)}</b>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  {addedId === product.id
                    ? "Ավելացված է ✓"
                    : "+ Ավելացնել"}
                </button>
              </div>

              <span className="catalog-details-hint">
                Սեղմել՝ մանրամասները տեսնելու համար
              </span>
            </div>
          </article>
        ))}
      </div>

      {selectedProduct && (
        <div
          className="catalog-product-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedProduct(null);
            }
          }}
        >
          <article
            className="catalog-product-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="catalog-product-title"
          >
            <button
              type="button"
              className="catalog-modal-close"
              aria-label="Փակել"
              onClick={() => setSelectedProduct(null)}
            >
              <X size={22} />
            </button>

            <div
              className="catalog-modal-art"
              style={{
                "--accent":
                  selectedProduct.accent || "#c59a42",
              }}
            >
              <ProductVisual
                product={selectedProduct}
                modal
              />
            </div>

            <div className="catalog-modal-content">
              <p className="catalog-modal-category">
                {selectedProduct.categoryName ||
                  categoryLabels[selectedProduct.category] ||
                  selectedProduct.category ||
                  "AUREVIS"}
              </p>

              <h2 id="catalog-product-title">
                {selectedProduct.name}
              </h2>

              {selectedProduct.nameHy &&
                selectedProduct.nameHy !== selectedProduct.name && (
                  <p className="catalog-modal-name-hy">
                    {selectedProduct.nameHy}
                  </p>
                )}

              <p className="catalog-modal-description">
                {selectedProduct.description ||
                  "Պրոֆեսիոնալ AUREVIS արտադրանք՝ սրճարանների, ռեստորանների և HoReCa նախագծերի համար։"}
              </p>

              <div className="catalog-modal-information">
                <span>
                  Ծավալ
                  <b>{selectedProduct.volume || "1 լիտր"}</b>
                </span>

                <span>
                  Գին
                  <b>{money(selectedProduct.price)}</b>
                </span>
              </div>

              <div className="product-meta catalog-modal-bonuses">
                {selectedProduct.bonus > 0 && (
                  <small>
                    +{selectedProduct.bonus} Bonus
                  </small>
                )}

                {selectedProduct.iceGiftKg > 0 && (
                  <small>
                    +{selectedProduct.iceGiftKg} կգ սառույց
                  </small>
                )}
              </div>

              <div className="catalog-modal-order-row">
                <div
                  className="catalog-quantity-control"
                  aria-label="Քանակ"
                >
                  <button
                    type="button"
                    aria-label="Պակասեցնել"
                    onClick={() =>
                      setQuantity((current) =>
                        Math.max(1, current - 1)
                      )
                    }
                  >
                    <Minus size={18} />
                  </button>

                  <b>{quantity}</b>

                  <button
                    type="button"
                    aria-label="Ավելացնել"
                    onClick={() =>
                      setQuantity((current) => current + 1)
                    }
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <button
                  type="button"
                  className="catalog-modal-add-button"
                  onClick={addSelectedProduct}
                >
                  <ShoppingBag size={19} />
                  Ավելացնել զամբյուղ
                  <b>
                    {money(
                      Number(selectedProduct.price || 0) *
                        quantity
                    )}
                  </b>
                </button>
              </div>
            </div>
          </article>
        </div>
      )}

      {!loading && !visible.length && (
        <div className="empty-state">
          <h2>Ապրանք չի գտնվել</h2>

          <p>
            Փոխիր որոնման բառը կամ ընտրիր այլ բաժին։
          </p>
        </div>
      )}<div className="catalog-contact-section">
  <div className="catalog-contact-glow" />

  <div className="catalog-contact-heading">
    <span>AUREVIS · CONTACT</span>

    <h2>Պատվերներ և համագործակցություն</h2>

    <p>
      Ապրանքների պատվերի, HoReCa համագործակցության և
      գործնական առաջարկների համար կապվեք մեզ հետ։
    </p>
  </div>

  <div className="catalog-contact-cards">
    <a
      className="catalog-contact-card"
      href="tel:+37491024232"
    >
      <span className="contact-icon">☎</span>

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
      <span className="contact-icon">✉</span>

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
      <span className="contact-icon">◎</span>

      <div>
        <small>Instagram</small>
        <b>@aureviscompany</b>
        <p>Նորություններ և տեսականի</p>
      </div>
    </a>
  </div>
</div>
    </section>
  );
}

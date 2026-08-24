import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
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

const catalogImages = [
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

function getCatalogImage(product) {
  const productText = normalizeText(
    `${product.name || ""} ${product.nameHy || ""}`
  );

  const matchedImage = catalogImages.find((item) =>
    item.names.some((name) => productText.includes(name))
  );

  if (matchedImage) {
    return matchedImage.image;
  }

  const category = normalizeText(product.category);
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

function ProductVisual({ product }) {
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
        className="real-product-image"
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
            className="product-card"
            key={product.id}
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
                  onClick={() =>
                    handleAddToCart(product)
                  }
                >
                  {addedId === product.id
                    ? "Ավելացված է ✓"
                    : "+ Ավելացնել"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!loading && !visible.length && (
        <div className="empty-state">
          <h2>Ապրանք չի գտնվել</h2>

          <p>
            Փոխիր որոնման բառը կամ ընտրիր այլ բաժին։
          </p>
        </div>
      )}
    </section>
  );
}

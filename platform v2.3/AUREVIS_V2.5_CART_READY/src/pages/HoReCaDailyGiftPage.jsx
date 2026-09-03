import { useEffect, useMemo, useState } from "react";
import { Gift, Percent, Sparkles } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabase";

const bottles = [
  ["Strawberry", "/assets/syrups/strawberry.png"],
  ["Passion Fruit", "/assets/syrups/passion-fruit.png"],
  ["Mango", "/assets/syrups/mango.png"],
  ["Blueberry", "/assets/syrups/blueberry.png"],
  ["Raspberry", "/assets/syrups/raspberry.png"],
  ["Mojito", "/assets/syrups/mojito.png"],
  ["Caramel", "/assets/syrups/caramel.png"],
  ["Pistachio", "/assets/syrups/pistachio.png"],
  ["Pomegranate", "/assets/syrups/pomegranate.png"],
  ["Yuzu", "/assets/syrups/yuzu.png"],
].map(([name, image], index) => ({ name, image, index }));

const copy = {
  hy: {
    eyebrow: "AUREVIS HORECA DAILY GIFT", title: "Այսօրվա անակնկալը քեզ է սպասում",
    lead: "Մեկ փորձ ամեն օր։ Շահիր օշարակ կամ պյուրե, կամ ստացիր մինչև 12% cashback այսօրվա պատվերի համար։",
    play: "Փորձել բախտը", playing: "Ընտրում ենք քո անակնկալը…", already: "Այսօրվա փորձն արդեն օգտագործել ես",
    gift: "Դու շահեցիր մեկ շիշ", cashback: "Այսօրվա cashback", both: "Երկու նվեր միանգամից", none: "Այսօր չշահեցիր, բայց վաղը նոր փորձ կունենաս։",
    valid: "Կիրառվում է ավտոմատ՝ այսօր կատարած առաջին պատվերի ժամանակ։", catalog: "Ընտրել ապրանքներ", account: "Իմ հաշիվը",
    unavailable: "Այս բաժինը հասանելի է միայն հաստատված HoReCa գործընկերներին։", error: "Չհաջողվեց բացել խաղը։ Փորձիր կրկին։",
  },
  ru: {
    eyebrow: "AUREVIS HORECA DAILY GIFT", title: "Сегодняшний сюрприз ждёт вас",
    lead: "Одна попытка в день. Выиграйте сироп или пюре либо получите до 12% cashback на заказ сегодня.",
    play: "Испытать удачу", playing: "Выбираем ваш сюрприз…", already: "Сегодняшняя попытка уже использована",
    gift: "Вы выиграли одну бутылку", cashback: "Cashback на сегодня", both: "Сразу два подарка", none: "Сегодня без выигрыша — новая попытка будет завтра.",
    valid: "Применится автоматически к первому заказу, оформленному сегодня.", catalog: "Выбрать товары", account: "Мой аккаунт",
    unavailable: "Раздел доступен только подтверждённым HoReCa-партнёрам.", error: "Не удалось открыть игру. Попробуйте ещё раз.",
  },
  en: {
    eyebrow: "AUREVIS HORECA DAILY GIFT", title: "Today's surprise is waiting for you",
    lead: "One try per day. Win a syrup or purée, or get up to 12% cashback on today's order.",
    play: "Try your luck", playing: "Choosing your surprise…", already: "You have already used today's try",
    gift: "You won one bottle", cashback: "Today's cashback", both: "Two rewards at once", none: "No reward today, but you can try again tomorrow.",
    valid: "Applied automatically to the first order you place today.", catalog: "Choose products", account: "My account",
    unavailable: "This area is only available to approved HoReCa partners.", error: "The game could not be opened. Please try again.",
  },
  ka: {
    eyebrow: "AUREVIS HORECA DAILY GIFT", title: "დღევანდელი სიურპრიზი გელოდებათ",
    lead: "დღეში ერთი ცდა. მოიგეთ სიროფი ან პიურე, ან მიიღეთ 12%-მდე cashback დღევანდელ შეკვეთაზე.",
    play: "სცადეთ ბედი", playing: "ვარჩევთ თქვენს სიურპრიზს…", already: "დღევანდელი ცდა უკვე გამოიყენეთ",
    gift: "თქვენ მოიგეთ ერთი ბოთლი", cashback: "დღევანდელი cashback", both: "ორი საჩუქარი ერთად", none: "დღეს ვერ მოიგეთ — ხვალ ახალი ცდა გექნებათ.",
    valid: "ავტომატურად დაემატება დღეს გაკეთებულ პირველ შეკვეთას.", catalog: "პროდუქტების არჩევა", account: "ჩემი ანგარიში",
    unavailable: "ეს გვერდი მხოლოდ დადასტურებული HoReCa პარტნიორებისთვისაა.", error: "თამაშის გახსნა ვერ მოხერხდა. სცადეთ თავიდან.",
  },
};

const normalize = (value = "") => String(value).toLowerCase().replace(/^syrup-/, "").replace(/^puree-/, "").replace(/\s+/g, "-");

function bottleImage(play) {
  if (play?.gift_image) return play.gift_image;
  const key = normalize(play?.gift_sku || play?.gift_name);
  return bottles.find((bottle) => key.includes(normalize(bottle.name)))?.image || "/assets/syrups/passion-fruit.png";
}

export default function HoReCaDailyGiftPage() {
  const { loading: authLoading, user, profile } = useAuth();
  const { language } = useLanguage();
  const text = copy[language] || copy.hy;
  const [status, setStatus] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState("");

  const approved = profile?.account_type === "horeca" && profile?.horeca_status === "approved";
  const play = status?.play || null;
  const resultTitle = useMemo(() => {
    if (!play) return "";
    if (play.gift_won && Number(play.cashback_rate) > 0) return text.both;
    if (play.gift_won) return text.gift;
    if (Number(play.cashback_rate) > 0) return text.cashback;
    return text.none;
  }, [play, text]);

  useEffect(() => {
    if (!user || !approved || !supabase) return;
    let active = true;
    supabase.rpc("get_horeca_daily_gift_status").then(({ data, error: requestError }) => {
      if (!active) return;
      if (requestError) setError(text.error);
      else setStatus(data);
    });
    return () => { active = false; };
  }, [user, approved, text.error]);

  async function playNow() {
    if (spinning || status?.played) return;
    setSpinning(true);
    setError("");
    const startedAt = Date.now();
    const { data, error: requestError } = await supabase.rpc("play_horeca_daily_gift");
    const remaining = Math.max(0, 3200 - (Date.now() - startedAt));
    window.setTimeout(() => {
      if (requestError) setError(requestError.message || text.error);
      else setStatus(data);
      setSpinning(false);
    }, remaining);
  }

  if (authLoading) return <div className="route-loader">{text.playing}</div>;
  if (!user) return <Navigate to="/account" replace />;

  return (
    <section className="daily-gift-page">
      <div className="daily-gift-shell">
        <div className="daily-gift-heading">
          <p className="eyebrow">{text.eyebrow}</p>
          <h1>{approved ? text.title : text.unavailable}</h1>
          {approved && <p>{status?.played ? text.already : text.lead}</p>}
        </div>

        {approved && (
          <div className={`daily-gift-stage ${spinning ? "is-spinning" : ""} ${play ? "has-result" : ""}`}>
            {!play && (
              <div className="daily-bottle-wheel" aria-hidden="true">
                {bottles.map((bottle) => (
                  <button
                    type="button"
                    className="daily-mini-bottle"
                    key={bottle.name}
                    style={{ "--gift-index": bottle.index }}
                    disabled={spinning || !status || !status.eligible}
                    onClick={playNow}
                    aria-label={`${text.play}: ${bottle.name}`}
                  >
                    <img src={bottle.image} alt="" />
                    <span>{bottle.name}</span>
                  </button>
                ))}
              </div>
            )}

            {play && (
              <div className="daily-gift-result">
                <Sparkles className="daily-result-sparkle" />
                <p>{resultTitle}</p>
                <div className="daily-result-rewards">
                  {play.gift_won && (
                    <article className="daily-bottle-prize">
                      <img src={bottleImage(play)} alt={play.gift_name || "AUREVIS"} />
                      <div><Gift /><span>{text.gift}</span><b>{play.gift_name}</b></div>
                    </article>
                  )}
                  {Number(play.cashback_rate) > 0 && (
                    <article className="daily-cashback-prize">
                      <Percent />
                      <strong>{play.cashback_rate}%</strong>
                      <span>{text.cashback}</span>
                    </article>
                  )}
                </div>
                {(play.gift_won || Number(play.cashback_rate) > 0) && <small>{text.valid}</small>}
                <div className="daily-result-actions">
                  <Link className="submit-button" to="/catalog">{text.catalog}</Link>
                  <Link to="/account">{text.account}</Link>
                </div>
              </div>
            )}

            {!play && (
              <button className="daily-play-button" type="button" disabled={spinning || !status || !status.eligible} onClick={playNow}>
                <Sparkles />
                <span>{spinning ? text.playing : text.play}</span>
              </button>
            )}
          </div>
        )}

        {error && <p className="form-message error daily-gift-error">{error}</p>}
        {!approved && <Link className="submit-button daily-back-link" to="/account">{text.account}</Link>}
      </div>
    </section>
  );
}

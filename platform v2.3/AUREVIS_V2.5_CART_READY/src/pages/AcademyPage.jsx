import {
  Calculator,
  FlaskConical,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { useState } from "react";

const money = (value) =>
  new Intl.NumberFormat("hy-AM").format(value) + " ֏";

export default function AcademyPage() {
  const [dose, setDose] = useState(40);
  const [sale, setSale] = useState(1800);

  const bottlePrice = 5600;
  const additionalCost = 260;

  const cups = Math.max(
    1,
    Math.floor(1000 / Number(dose || 1))
  );

  const productCost = Math.round(
    bottlePrice / cups
  );

  const totalCost = productCost + additionalCost;
  const profit = Number(sale || 0) - totalCost;
  const bottleProfit = profit * cups;

  return (
    <section className="page academy-page">
      <header className="academy-premium-hero">
        <div className="academy-hero-content">
          <p className="eyebrow">
            AUREVIS BUSINESS ACADEMY
          </p>

          <h1>
            Բաղադրատոմսից՝
            <br />
            մինչև իրական շահույթ
          </h1>

          <p>
            Հաշվարկիր յուրաքանչյուր բաժակի
            ինքնարժեքը, վաճառքի շահույթը և մեկ շշից
            ստացվող ամբողջ եկամուտը։
          </p>

          <div className="academy-benefits">
            <span>
              <FlaskConical size={18} />
              Ճշգրիտ չափաբաժին
            </span>

            <span>
              <TrendingUp size={18} />
              Շահույթի հաշվարկ
            </span>

            <span>
              <WalletCards size={18} />
              Բիզնես վերահսկում
            </span>
          </div>
        </div>

        <div className="academy-hero-badge">
          <Calculator size={40} />

          <small>AUREVIS TOOL</small>
          <b>PROFIT</b>
          <span>CALCULATOR</span>
        </div>
      </header>

      <div className="academy-dashboard">
        <div className="academy-input-panel">
          <div className="academy-panel-heading">
            <span>
              <Calculator size={22} />
            </span>

            <div>
              <small>ԲԻԶՆԵՍ ՀԱՇՎԻՉ</small>
              <h2>Մուտքագրիր տվյալները</h2>
            </div>
          </div>

          <div className="academy-field-grid">
            <label>
              <span>Պյուրեի չափաբաժին</span>

              <div className="academy-input-wrap">
                <input
                  type="number"
                  min="1"
                  value={dose}
                  onChange={(event) =>
                    setDose(event.target.value)
                  }
                />

                <b>մլ</b>
              </div>
            </label>

            <label>
              <span>Մեկ բաժակի վաճառքի գին</span>

              <div className="academy-input-wrap">
                <input
                  type="number"
                  min="0"
                  value={sale}
                  onChange={(event) =>
                    setSale(Number(event.target.value))
                  }
                />

                <b>֏</b>
              </div>
            </label>
          </div>

          <div className="academy-cost-note">
            <span>Հաշվարկի հիմքը</span>

            <p>
              Պյուրեի գին՝ <b>{money(bottlePrice)}</b>
            </p>

            <p>
              Լրացուցիչ ծախս՝{" "}
              <b>{money(additionalCost)}</b>
            </p>
          </div>
        </div>

        <div className="academy-results-panel">
          <div className="academy-results-heading">
            <small>ՀԱՇՎԱՐԿԻ ԱՐԴՅՈՒՆՔ</small>
            <h2>Քո բիզնեսի ցուցանիշները</h2>
          </div>

          <div className="academy-results-grid">
            <article>
              <span>Մեկ շշից</span>
              <b>{cups}</b>
              <small>բաժակ</small>
            </article>

            <article>
              <span>Մեկ բաժակի ինքնարժեք</span>
              <b>{money(totalCost)}</b>
              <small>ներառյալ լրացուցիչ ծախսը</small>
            </article>

            <article>
              <span>Շահույթ մեկ բաժակից</span>
              <b>{money(profit)}</b>
              <small>վաճառքի յուրաքանչյուր բաժակից</small>
            </article>

            <article className="academy-featured-result">
              <span>Ընդհանուր շահույթ մեկ շշից</span>
              <b>{money(bottleProfit)}</b>
              <small>{cups} բաժակի վաճառքից</small>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

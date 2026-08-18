import { useMemo, useState } from "react";

export default function AcademyPage() {
  const [dose, setDose] = useState(40);
  const [sale, setSale] = useState(1800);
  const bottlePrice = 5600;
  const cups = Math.max(1, Math.floor(1000 / Number(dose || 1)));
  const productCost = Math.round(bottlePrice / cups);
  const totalCost = productCost + 260;
  const profit = sale - totalCost;

  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow dark">AUREVIS ACADEMY</p>
        <h1>Բաղադրատոմսից մինչև շահույթ</h1>
      </div>
      <div className="calculator">
        <div>
          <label>Պյուրեի չափաբաժին (մլ)<input type="number" value={dose} onChange={(e) => setDose(e.target.value)} /></label>
          <label>Վաճառքի գին (֏)<input type="number" value={sale} onChange={(e) => setSale(Number(e.target.value))} /></label>
        </div>
        <div className="calculator-results">
          <article><span>Մեկ շշից</span><b>{cups} բաժակ</b></article>
          <article><span>Ինքնարժեք</span><b>{totalCost} ֏</b></article>
          <article><span>Շահույթ / բաժակ</span><b>{profit} ֏</b></article>
          <article><span>Շահույթ / շիշ</span><b>{profit * cups} ֏</b></article>
        </div>
      </div>
    </section>
  );
}

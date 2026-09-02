import {
  ArrowRight,
  BadgeCheck,
  Gift,
  PackageOpen,
  Percent,
  Snowflake,
  Trophy,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const tiers = [
  { key: "bronze", rate: 5 },
  { key: "silver", rate: 7 },
  { key: "gold", rate: 9 },
];

export default function BenefitsPage() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const isApprovedHoReCa =
    profile?.account_type === "horeca" &&
    profile?.horeca_status === "approved";

  return (
    <section className="benefits-page">
      <header className="benefits-hero">
        <div>
          <p className="eyebrow">{t("benefitsEyebrow")}</p>
          <h1>{t("benefitsTitle")}</h1>
          <p>{t("benefitsLead")}</p>
          <div className="benefits-actions">
            <Link className="button gold" to="/account">
              {user ? t("myBonuses") : t("joinProgram")}
              <ArrowRight size={18} />
            </Link>
            <Link className="button glass" to="/catalog">
              {t("openCatalog")}
            </Link>
          </div>
        </div>
        <div className="benefits-hero-badge">
          <Snowflake size={54} />
          <b>5 KG</b>
          <span>{t("iceTitle")}</span>
        </div>
      </header>

      <div className="benefit-card-grid">
        <article>
          <Snowflake />
          <h2>{t("iceTitle")}</h2>
          <p>{t("iceText")}</p>
        </article>
        <article>
          <WalletCards />
          <h2>{t("cashbackTitle")}</h2>
          <p>{t("cashbackText")}</p>
        </article>
        <article>
          <Gift />
          <h2>{t("giftsTitle")}</h2>
          <p>{t("giftsText")}</p>
        </article>
        <article>
          <PackageOpen />
          <h2>{t("equipmentTitle")}</h2>
          <p>{t("equipmentText")}</p>
        </article>
      </div>

      <section className="tier-section">
        <div className="tier-heading">
          <Trophy />
          <div>
            <p className="eyebrow dark">AUREVIS LOYALTY</p>
            <h2>{t("levelsTitle")}</h2>
            <p>{t("levelsText")}</p>
          </div>
        </div>
        <div className="tier-grid">
          {tiers.map((tier) => (
            <article className={`tier-card ${tier.key}`} key={tier.key}>
              <BadgeCheck />
              <span>{t(tier.key)}</span>
              <b>{tier.rate}%</b>
              <small>{t("cashback")}</small>
            </article>
          ))}
        </div>
      </section>

      <div className={`benefits-eligibility ${isApprovedHoReCa ? "approved" : ""}`}>
        {isApprovedHoReCa ? <BadgeCheck /> : <Percent />}
        <p>{t("eligibility")}</p>
      </div>
    </section>
  );
}

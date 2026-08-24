import { useEffect, useState } from "react";
import {
  Heart,
  Menu,
  ShoppingBag,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const money = (value) =>
  new Intl.NumberFormat("hy-AM").format(
    Number(value || 0)
  ) + " ֏";

export default function Header() {
  const { isAdmin, user, profile } = useAuth();
  const { count } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);

  const walletBalance = Number(
    profile?.wallet_balance ??
    profile?.bonus_balance ??
    profile?.balance ??
    0
  );

  useEffect(() => {
    document.body.classList.toggle(
      "mobile-menu-open",
      menuOpen
    );

    return () =>
      document.body.classList.remove(
        "mobile-menu-open"
      );
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header sticky-main-header">
      <NavLink
        to="/"
        className="brand"
        onClick={closeMenu}
      >
        <img
          src="/assets/logo.png"
          alt="AUREVIS"
        />

        <span className="brand-copy">
          <strong>AUREVIS</strong>
          <small>PREMIUM COLLECTION</small>
        </span>
      </NavLink>

      <nav
        className={menuOpen ? "open" : ""}
        aria-label="Գլխավոր մենյու"
      >
        <NavLink to="/" onClick={closeMenu}>
          Գլխավոր
        </NavLink>

        <NavLink
          to="/catalog"
          onClick={closeMenu}
        >
          Կատալոգ
        </NavLink>

        <NavLink
          to="/academy"
          onClick={closeMenu}
        >
          AUREVIS Academy
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/admin"
            onClick={closeMenu}
          >
            Admin
          </NavLink>
        )}

        <NavLink
          className="mobile-account-link"
          to="/account"
          onClick={closeMenu}
        >
          {user
            ? "Իմ հաշիվը"
            : "Մուտք / Գրանցում"}
        </NavLink>
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className="desktop-action"
          aria-label="Ընտրյալներ"
        >
          <Heart size={19} />
        </button>

        <NavLink
          className="header-wallet-link"
          to="/bonus"
          aria-label="Հաշվեկշիռ"
        >
          <WalletCards size={19} />

          <span>
            <small>Հաշվեկշիռ</small>
            <b>{money(walletBalance)}</b>
          </span>
        </NavLink>

        <NavLink
          className="cart-link always-visible-cart"
          to="/cart"
          aria-label={`Զամբյուղ՝ ${count} ապրանք`}
        >
          <ShoppingBag size={20} />

          <span className="cart-count">
            {count}
          </span>
        </NavLink>

        <NavLink
          className={user ? "signed-in" : ""}
          to="/account"
          aria-label="Հաշիվ"
        >
          <UserRound size={19} />
        </NavLink>

        <button
          type="button"
          className="menu-toggle"
          aria-label={
            menuOpen
              ? "Փակել մենյուն"
              : "Բացել մենյուն"
          }
          aria-expanded={menuOpen}
          onClick={() =>
            setMenuOpen((open) => !open)
          }
        >
          {menuOpen
            ? <X size={22} />
            : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="menu-backdrop"
          aria-label="Փակել մենյուն"
          onClick={closeMenu}
        />
      )}
    </header>
  );
}

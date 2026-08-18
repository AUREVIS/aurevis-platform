import { useEffect, useState } from "react";
import { Heart, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { isAdmin, user } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", menuOpen);
    return () => document.body.classList.remove("mobile-menu-open");
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <NavLink to="/" className="brand" onClick={closeMenu}>
        <img src="/assets/logo.png" alt="AUREVIS" />
        <span className="brand-copy">
          <strong>AUREVIS</strong>
          <small>PREMIUM COLLECTION</small>
        </span>
      </NavLink>

      <nav className={menuOpen ? "open" : ""} aria-label="Գլխավոր մենյու">
        <NavLink to="/" onClick={closeMenu}>Գլխավոր</NavLink>
        <NavLink to="/catalog" onClick={closeMenu}>Կատալոգ</NavLink>
        <NavLink to="/academy" onClick={closeMenu}>AUREVIS Academy</NavLink>
        {isAdmin && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}
        <NavLink className="mobile-account-link" to="/account" onClick={closeMenu}>
          {user ? "Իմ հաշիվը" : "Մուտք / Գրանցում"}
        </NavLink>
      </nav>

      <div className="header-actions">
        <button className="desktop-action" aria-label="Ընտրյալներ"><Heart size={19} /></button>
        <NavLink className="cart-link" to="/cart" aria-label="Զամբյուղ">
          <ShoppingBag size={19} />{count > 0 && <span className="cart-count">{count}</span>}
        </NavLink>
        <NavLink className={user ? "signed-in" : ""} to="/account" aria-label="Հաշիվ">
          <UserRound size={19} />
        </NavLink>
        <button
          className="menu-toggle"
          aria-label={menuOpen ? "Փակել մենյուն" : "Բացել մենյուն"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {menuOpen && <button className="menu-backdrop" aria-label="Փակել մենյուն" onClick={closeMenu} />}
    </header>
  );
}

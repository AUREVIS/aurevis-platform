import { Heart, ShoppingBag, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <NavLink to="/" className="brand">
        <img src="/assets/logo.png" alt="AUREVIS" />
        <span>AUREVIS</span>
      </NavLink>

      <nav>
        <NavLink to="/">Գլխավոր</NavLink>
        <NavLink to="/catalog">Կատալոգ</NavLink>
        <NavLink to="/academy">Academy</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </nav>

      <div className="header-actions">
        <button aria-label="Favorites"><Heart size={20} /></button>
        <button aria-label="Cart"><ShoppingBag size={20} /></button>
        <NavLink to="/account" aria-label="Account"><UserRound size={20} /></NavLink>
      </div>
    </header>
  );
}

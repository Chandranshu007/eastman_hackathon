import { Search, ShoppingBag } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState(
    new URLSearchParams(location.search).get("q") || "",
  );

  useEffect(() => {
    setSearch(new URLSearchParams(location.search).get("q") || "");
  }, [location.search]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearch(value);
    const query = value.trim();
    navigate(query ? `/?q=${encodeURIComponent(query)}` : "/", { replace: true });
  };

  return (
    <>
      <div className="announcement">Smart Shopping. Better Deals. Easy Checkout.</div>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="Eastman Store home">
            <span className="brand-mark">E</span>
            <span>Eastman <strong>Store</strong></span>
          </Link>
          <label className="header-search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search products..."
              aria-label="Search products"
              value={search}
              onChange={handleSearch}
            />
          </label>
          <nav className="main-nav" aria-label="Main navigation">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/categories">Categories</NavLink>
            <NavLink className="cart-nav" to="/cart">
              <ShoppingBag size={19} aria-hidden="true" />
              <span>Cart</span>
              <span className="cart-count" aria-label={`${itemCount} items in cart`}>{itemCount}</span>
            </NavLink>
          </nav>
        </div>
      </header>
    </>
  );
}

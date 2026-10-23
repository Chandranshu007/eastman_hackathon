import { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag, ShoppingCart, Search, Plus, Minus, Trash2, ArrowRight,
  Check, PackageCheck, RefreshCw, AlertCircle, X, Sparkles, Truck
} from "lucide-react";
import { getProducts, getCart, addToCart, setQuantity, removeItem, clearCart } from "./api";

const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 2
}).format(Number(value || 0));

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], itemCount: 0, subtotal: 0 });
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState("");

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [p, c] = await Promise.all([getProducts(), getCart()]);
      setProducts(p);
      setCart(c);
    } catch (e) {
      setError(e.response?.data?.error || "Can't reach the API. Check that the backend and PostgreSQL are running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  const categories = useMemo(() => ["All", ...new Set(products.map(p => p.category))], [products]);
  const filtered = useMemo(() => products.filter(p =>
    (category === "All" || p.category === category) &&
    `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(search.toLowerCase())
  ), [products, category, search]);

  async function runAction(action, successMessage) {
    setBusy(true);
    setNotice(null);
    setError("");
    try {
      const updated = await action();
      if (updated?.items) setCart(updated);
      else setCart(await getCart());
      setNotice(successMessage);
      window.setTimeout(() => setNotice(null), 2600);
    } catch (e) {
      setError(e.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const cartProductIds = new Set(cart.items.map(i => i.product_id));

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Cartly home">
          <span className="brand-mark"><ShoppingBag size={20} strokeWidth={2.5}/></span>
          <span>cartly<span className="brand-dot">.</span></span>
        </a>
        <nav className="nav-links"><a className="active" href="#shop">Shop</a><a href="#benefits">Why Cartly</a></nav>
        <a className="cart-pill" href="#cart"><ShoppingCart size={18}/><span>Cart</span><b>{cart.itemCount}</b></a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={14}/> YOUR EVERYDAY FINDS</div>
            <h1>Good things.<br/><span>Great choices.</span></h1>
            <p>Find your favourites, add them to your bag, and let us handle the totals.</p>
            <a className="hero-cta" href="#shop">Explore products <ArrowRight size={17}/></a>
            <div className="hero-note"><span className="avatar-stack"><i>✓</i><i>♡</i><i>✦</i></span><span>Simple shopping, made delightful.</span></div>
          </div>
          <div className="hero-art">
            <div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div>
            <div className="hero-tag tag-top"><PackageCheck size={17}/><span>Quality picks</span></div>
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900" alt="Red sneaker product highlight"/>
            <div className="hero-tag tag-bottom"><span className="live-dot"></span><span>Cart updates instantly</span></div>
            <span className="art-spark spark-one">✳</span><span className="art-spark spark-two">✦</span>
          </div>
        </section>

        {notice && <div className="toast success"><Check size={17}/>{notice}<button onClick={() => setNotice(null)} aria-label="Dismiss"><X size={15}/></button></div>}
        {error && <div className="alert"><AlertCircle size={18}/><span>{error}</span><button onClick={loadAll}><RefreshCw size={15}/> Retry</button></div>}

        <section id="shop" className="shop-layout">
          <div className="catalog">
            <div className="section-heading">
              <div><div className="eyebrow">THE COLLECTION</div><h2>Find your next favourite</h2><p>Thoughtful essentials for everyday life.</p></div>
              <span className="result-count">{filtered.length} products</span>
            </div>
            <div className="catalog-controls">
              <div className="searchbox"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." aria-label="Search products"/></div>
              <div className="category-list">{categories.map(c => <button key={c} className={category === c ? "category active" : "category"} onClick={() => setCategory(c)}>{c}</button>)}</div>
            </div>

            {loading ? <div className="loading-grid">{[1,2,3,4].map(n => <div className="skeleton" key={n}/>)}</div> :
            <div className="product-grid">
              {filtered.map((p, idx) => {
                const inCart = cart.items.find(i => i.product_id === p.id);
                return <article className="product-card" key={p.id}>
                  <div className={`product-image image-tone-${idx % 4}`}>
                    <span className="product-category">{p.category}</span>
                    <img src={p.image_url} alt={p.name} loading="lazy" onError={e => { e.currentTarget.style.opacity = "0"; }}/>
                    {inCart && <span className="in-cart"><Check size={13}/> In cart · {inCart.quantity}</span>}
                  </div>
                  <div className="product-info">
                    <h3>{p.name}</h3><p>{p.description}</p>
                    <div className="product-bottom"><strong>{money(p.price)}</strong>
                      <button className={inCart ? "add-button added" : "add-button"} disabled={busy || p.stock < 1} onClick={() => runAction(() => addToCart(p.id), `${p.name} added to cart`)} aria-label={`Add ${p.name} to cart`}>
                        {inCart ? <Check size={16}/> : <Plus size={16}/>}<span>{inCart ? "Add another" : "Add to cart"}</span>
                      </button>
                    </div>
                    <div className="stock-note">{p.stock > 0 ? `${p.stock} available` : "Out of stock"}</div>
                  </div>
                </article>;
              })}
              {!filtered.length && <div className="empty-search"><Search size={25}/><h3>No matches found</h3><p>Try another search or category.</p></div>}
            </div>}
          </div>

          <aside id="cart" className="cart-panel">
            <div className="cart-header"><div><div className="eyebrow">YOUR SELECTION</div><h2>Your cart <span>({cart.itemCount})</span></h2></div><span className="cart-icon"><ShoppingCart size={20}/></span></div>
            {loading ? <div className="cart-loading">Loading your cart…</div> : cart.items.length === 0 ? (
              <div className="empty-cart"><div className="empty-bag"><ShoppingBag size={27}/></div><h3>Your cart is taking a break</h3><p>Add something you love and it will show up here.</p><a href="#shop">Browse products <ArrowRight size={15}/></a></div>
            ) : <>
              <div className="cart-items">
                {cart.items.map(item => <div className="cart-line" key={item.product_id}>
                  <div className="cart-thumb"><img src={item.image_url} alt="" onError={e => {e.currentTarget.style.opacity = "0";}}/></div>
                  <div className="cart-line-info"><h3>{item.name}</h3><p>{money(item.price)}</p>
                    <div className="quantity-control">
                      <button disabled={busy || item.quantity <= 1} onClick={() => runAction(() => setQuantity(item.product_id, item.quantity - 1), "Quantity updated")} aria-label={`Decrease ${item.name}`}><Minus size={13}/></button>
                      <span>{item.quantity}</span>
                      <button disabled={busy || item.quantity >= item.stock} onClick={() => runAction(() => setQuantity(item.product_id, item.quantity + 1), "Quantity updated")} aria-label={`Increase ${item.name}`}><Plus size={13}/></button>
                    </div>
                  </div>
                  <div className="line-end"><strong>{money(item.item_total)}</strong><button className="remove-button" disabled={busy} onClick={() => runAction(() => removeItem(item.product_id), `${item.name} removed`)} aria-label={`Remove ${item.name}`}><Trash2 size={15}/></button></div>
                </div>)}
              </div>
              <button className="clear-cart" disabled={busy} onClick={() => runAction(clearCart, "Cart cleared")}>Clear cart</button>
              <div className="summary">
                <div className="summary-row"><span>Items ({cart.itemCount})</span><span>{money(cart.subtotal)}</span></div>
                <div className="summary-row"><span>Delivery</span><span className="free-delivery">FREE</span></div>
                <div className="summary-row total"><span>Subtotal</span><strong>{money(cart.subtotal)}</strong></div>
                <p className="tax-note">Taxes, if applicable, are calculated at checkout.</p>
                <button className="checkout-button" onClick={() => setNotice("Cart is ready. Checkout is outside this cart-module demo.")}>Continue <ArrowRight size={17}/></button>
              </div>
            </>}
            <div className="secure-note"><span><Truck size={16}/></span><div><strong>Ready when you are</strong><p>Your cart stays saved in the database.</p></div></div>
          </aside>
        </section>

        <section id="benefits" className="benefits">
          <div><span className="benefit-icon"><RefreshCw size={19}/></span><div><h3>Instant updates</h3><p>Change quantities and see your totals update.</p></div></div>
          <div><span className="benefit-icon"><PackageCheck size={19}/></span><div><h3>Saved cart</h3><p>Your cart is stored in PostgreSQL.</p></div></div>
          <div><span className="benefit-icon"><ShoppingBag size={19}/></span><div><h3>Simple by design</h3><p>A clean experience from browsing to bag.</p></div></div>
        </section>
      </main>
      <footer><a className="brand footer-brand" href="#"><span className="brand-mark"><ShoppingBag size={16}/></span><span>cartly<span className="brand-dot">.</span></span></a><span>Built with React, Express & PostgreSQL</span><span>Demo user · Local development</span></footer>
    </div>
  );
}

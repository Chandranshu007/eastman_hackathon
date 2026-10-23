import { ArrowLeft, ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import QuantitySelector from "../components/QuantitySelector";
import { useCart } from "../context/CartContext";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

export default function Cart() {
  const { detailedItems, itemCount, subtotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  return (
    <main className="content-width cart-page">
      <div className="cart-heading">
        <div>
          <span className="eyebrow">YOUR EASTMAN BAG</span>
          <h1>Your Shopping Cart</h1>
          <p>{detailedItems.length} {detailedItems.length === 1 ? "product" : "products"} · {itemCount} {itemCount === 1 ? "item" : "items"}</p>
        </div>
        <Link className="back-link" to="/"><ArrowLeft size={16} aria-hidden="true" /> Continue shopping</Link>
      </div>

      {detailedItems.length === 0 ? (
        <section className="empty-cart">
          <div className="empty-cart-icon"><ShoppingBag size={31} strokeWidth={1.5} aria-hidden="true" /></div>
          <span className="eyebrow">NOTHING HERE JUST YET</span>
          <h2>Your cart is empty.</h2>
          <p>Find something useful, lovely, or a little bit of both.</p>
          <Link className="button button-primary" to="/">Explore products <ArrowRight size={17} aria-hidden="true" /></Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-items" aria-label="Cart items">
            {detailedItems.map((item) => (
              <article className="cart-item" key={item.id}>
                <Link className="cart-item-image" to={`/product/${item.id}`}>
                  <ProductImage src={item.image} alt={item.name} />
                </Link>
                <div className="cart-item-info">
                  <span className="product-category">{item.category}</span>
                  <Link className="cart-item-name" to={`/product/${item.id}`}>{item.name}</Link>
                  <span className="cart-unit-price">{formatPrice(item.price)} <small>each</small></span>
                  <QuantitySelector
                    quantity={item.quantity}
                    onChange={(quantity) => updateQuantity(item.id, quantity)}
                    max={item.stock}
                    label={`Quantity for ${item.name}`}
                  />
                </div>
                <div className="cart-item-total">
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                  <button className="remove-button" type="button" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={15} aria-hidden="true" /> Remove
                  </button>
                </div>
              </article>
            ))}
          </section>
          <aside className="order-summary">
            <h2>Order summary</h2>
            <div className="summary-line"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
            <div className="summary-line"><span>Discount</span><span>{formatPrice(0)}</span></div>
            <div className="summary-line"><span>Shipping</span><span>{formatPrice(0)}</span></div>
            <p className="shipping-note">Shipping rules may be added at checkout.</p>
            <div className="summary-total"><strong>Estimated total</strong><strong>{formatPrice(subtotal)}</strong></div>
            <button className="button button-primary checkout-button" type="button" onClick={() => navigate("/checkout")}>
              Proceed to checkout <ArrowRight size={17} aria-hidden="true" />
            </button>
            <div className="summary-secure"><ShoppingBag size={15} aria-hidden="true" /> Checkout integration coming next</div>
          </aside>
        </div>
      )}
    </main>
  );
}

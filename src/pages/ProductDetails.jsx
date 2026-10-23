import { ArrowLeft, CheckCircle2, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductImage from "../components/ProductImage";
import QuantitySelector from "../components/QuantitySelector";
import { useCart } from "../context/CartContext";
import { getProductById } from "../data/products";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

export default function ProductDetails() {
  const { productId } = useParams();
  const product = getProductById(productId);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className="content-width not-found">
        <div className="not-found-mark">?</div>
        <span className="eyebrow">WE COULDN'T FIND THAT ITEM</span>
        <h1>Product not found</h1>
        <p>It may have moved or is no longer part of our collection.</p>
        <Link className="button button-primary" to="/">Back to home</Link>
      </main>
    );
  }

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <main className="content-width detail-page">
      <Link className="back-link" to="/"><ArrowLeft size={16} aria-hidden="true" /> Back to products</Link>
      <div className="detail-layout">
        <div className="detail-image-wrap">
          <ProductImage src={product.image} alt={product.name} className="detail-image" />
          <span className="detail-image-caption">A thoughtful pick from Eastman Store</span>
        </div>
        <section className="detail-info">
          <span className="eyebrow">{product.category.toUpperCase()}</span>
          <h1>{product.name}</h1>
          <div className="rating-row">
            <span className="rating-stars"><Star size={16} fill="currentColor" aria-hidden="true" /> {product.rating.toFixed(1)}</span>
            <span className="review-copy">Customer favorite</span>
          </div>
          <div className="detail-price-row">
            <strong>{formatPrice(product.price)}</strong>
            <del>{formatPrice(product.originalPrice)}</del>
            <span className="discount-badge">{discount}% off</span>
          </div>
          <p className="detail-description">{product.description}</p>
          <div className={`detail-stock${product.stock === 0 ? " unavailable" : ""}`}>
            <CheckCircle2 size={17} aria-hidden="true" />
            {product.stock > 0 ? `${product.stock} available` : "Currently out of stock"}
          </div>
          <div className="detail-divider" />
          <div className="purchase-row">
            <div>
              <span className="field-label">Quantity</span>
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                max={Math.max(product.stock, 1)}
              />
            </div>
            <button
              className="button button-primary detail-add"
              type="button"
              disabled={product.stock === 0}
              onClick={() => addToCart(product.id, quantity)}
            >
              <ShoppingBag size={17} aria-hidden="true" /> Add to cart
            </button>
          </div>
          <div className="delivery-card">
            <div><Truck size={19} aria-hidden="true" /><span><strong>Easy delivery</strong><small>Delivery options available at checkout</small></span></div>
            <div><ShieldCheck size={19} aria-hidden="true" /><span><strong>Shop with confidence</strong><small>Quality essentials, thoughtfully selected</small></span></div>
          </div>
          <Link className="subtle-link" to="/cart">View your cart</Link>
        </section>
      </div>
    </main>
  );
}

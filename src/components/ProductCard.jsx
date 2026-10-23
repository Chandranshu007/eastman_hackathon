import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProductImage from "./ProductImage";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <article className="product-card">
      <Link className="product-image-link" to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
        <ProductImage src={product.image} alt={product.name} className="product-image" />
        <span className="discount-badge">{discount}% off</span>
      </Link>
      <div className="product-card-content">
        <span className="product-category">{product.category}</span>
        <Link className="product-name" to={`/product/${product.id}`}>{product.name}</Link>
        <div className="product-price-row">
          <span className="product-price">{formatPrice(product.price)}</span>
          <span className="original-price">{formatPrice(product.originalPrice)}</span>
        </div>
        <div className={`stock-note${product.stock === 0 ? " unavailable" : ""}`}>
          {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
        </div>
        <div className="product-card-actions">
          <Link className="button button-outline button-small" to={`/product/${product.id}`}>
            Details <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          <button
            className="button button-primary button-small"
            type="button"
            disabled={product.stock === 0}
            onClick={() => addToCart(product.id)}
          >
            <ShoppingBag size={15} aria-hidden="true" /> Add
          </button>
        </div>
      </div>
    </article>
  );
}

import { ArrowRight, SearchX, ShieldCheck, Truck } from "lucide-react";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function Home() {
  const [searchParams] = useSearchParams();
  const search = (searchParams.get("q") || "").trim().toLowerCase();

  const matchingProducts = useMemo(
    () => products.filter((product) =>
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search),
    ),
    [search],
  );

  const featuredProducts = useMemo(
    () => [...products]
      .sort((first, second) => second.rating - first.rating)
      .slice(0, 4),
    [],
  );
  const visibleProducts = search ? matchingProducts : featuredProducts;

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> MADE FOR EVERYDAY</span>
          <h1>Find your next <span>favorite.</span></h1>
          <p>Explore quality products at great prices. The little upgrades that make every day better.</p>
          <a className="button button-primary hero-button" href="#featured">
            {search ? "View results" : "Explore favorites"} <ArrowRight size={17} aria-hidden="true" />
          </a>
          <div className="hero-perks">
            <span><Truck size={17} aria-hidden="true" /> Easy delivery</span>
            <span><ShieldCheck size={17} aria-hidden="true" /> Quality you can trust</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Curated shopping essentials">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <div className="hero-note"><span className="hero-note-icon">✳</span><span>Good finds.<br /><strong>Better days.</strong></span></div>
          <div className="hero-card hero-card-top"><span className="hero-card-symbol">◌</span><span>Everyday<br />essentials</span></div>
          <div className="hero-card hero-card-bottom"><span className="hero-card-symbol">↗</span><span>Picked for<br />your routine</span></div>
          <div className="hero-center"><span>EST.</span><strong>E</strong><small>EASTMAN STORE</small></div>
        </div>
      </section>

      <section className="benefits-strip" aria-label="Shopping benefits">
        <span>Curated essentials</span><i />
        <span>Great value, every day</span><i />
        <span>Easy, secure shopping</span>
      </section>

      <section className="catalog-section content-width" id="featured">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{search ? "SEARCH RESULTS" : "THE EASTMAN EDIT"}</span>
            <h2>{search ? `Results for “${searchParams.get("q")}”` : "Popular right now"}</h2>
            <p>{search ? "Products matching your search." : "Customer-loved picks to make everyday a little better."}</p>
          </div>
          <span className="result-count">{visibleProducts.length} {visibleProducts.length === 1 ? "product" : "products"}</span>
        </div>
        {visibleProducts.length > 0 ? (
          <>
            <div className="product-grid">
              {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
            {!search && (
              <div className="home-catalog-link">
                <Link className="button button-outline" to="/categories">
                  Browse all products <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="empty-results">
            <SearchX size={34} strokeWidth={1.5} aria-hidden="true" />
            <h3>No products found</h3>
            <p>Try another product name or category in the search box.</p>
            <Link className="button button-outline" to="/">Clear search</Link>
          </div>
        )}
      </section>
    </main>
  );
}

import { ArrowRight, SearchX } from "lucide-react";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";
import { categories } from "../data/categories";
import { products } from "../data/products";

const allProductsCategory = "All Products";
const categoryOptions = [allProductsCategory, ...categories.map((category) => category.name)];

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const selectedCategory = categoryOptions.includes(requestedCategory)
    ? requestedCategory
    : allProductsCategory;

  const visibleProducts = useMemo(
    () => selectedCategory === allProductsCategory
      ? products
      : products.filter((product) => product.category === selectedCategory),
    [selectedCategory],
  );

  const selectCategory = (category) => {
    setSearchParams(category === allProductsCategory ? {} : { category });
    document.getElementById("category-products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="categories-page">
      <section className="categories-hero">
        <div className="content-width categories-hero-inner">
          <span className="eyebrow"><span className="eyebrow-dot" /> FIND YOUR EVERYDAY FAVORITES</span>
          <h1>Explore our <span>categories.</span></h1>
          <p>Browse a handpicked mix of useful finds for your home, your plans, and everywhere in between.</p>
          <div className="categories-hero-count">
            <strong>{categories.length}</strong> categories
            <span />
            <strong>{products.length}</strong> thoughtfully picked products
          </div>
        </div>
      </section>

      <section className="content-width categories-browser">
        <div className="section-heading categories-heading">
          <div>
            <span className="eyebrow">A LITTLE SOMETHING FOR EVERYONE</span>
            <h2>Choose what you need</h2>
            <p>Select a category to see the products that belong to it.</p>
          </div>
          {selectedCategory !== allProductsCategory && (
            <button className="text-link clear-category" type="button" onClick={() => selectCategory(allProductsCategory)}>
              Clear selection <span aria-hidden="true">×</span>
            </button>
          )}
        </div>

        <div className="category-feature-grid">
          {categories.map((category) => (
            <button
              className={`category-feature-card${selectedCategory === category.name ? " selected" : ""}`}
              key={category.name}
              type="button"
              aria-pressed={selectedCategory === category.name}
              onClick={() => selectCategory(category.name)}
            >
              <span className="category-feature-image" style={{ backgroundImage: `url("${category.image}")` }} />
              <span className="category-feature-content">
                <span className="category-feature-name">{category.name}</span>
                <span className="category-feature-description">{category.description}</span>
                <span className="category-feature-meta">
                  {category.productCount} {category.productCount === 1 ? "product" : "products"}
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </span>
            </button>
          ))}
        </div>

        <section className="category-products" id="category-products">
          <div className="category-products-heading">
            <div>
              <span className="eyebrow">THE COLLECTION</span>
              <h2>{selectedCategory}</h2>
            </div>
            <span className="result-count">{visibleProducts.length} {visibleProducts.length === 1 ? "product" : "products"}</span>
          </div>
          <CategoryFilter selected={selectedCategory} onSelect={selectCategory} categories={categoryOptions} />
          {visibleProducts.length > 0 ? (
            <div className="product-grid">
              {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="empty-results">
              <SearchX size={34} strokeWidth={1.5} aria-hidden="true" />
              <h3>No products found</h3>
              <p>Choose a different category to browse our collection.</p>
              <Link className="button button-outline" to="/categories">Show all categories</Link>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

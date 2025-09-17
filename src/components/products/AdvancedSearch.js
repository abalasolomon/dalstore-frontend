import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listCategories } from "../../redux/actions/categoryActions";
import axios from "axios";
import Loader from "../../common/Loader";
import Message from "../../common/Message";
import { API_URL } from "../../config/apiConfig";
import { useSearchParams, useNavigate } from "react-router-dom";

const AdvancedSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from URL params
  const keywordParam = searchParams.get("keyword") || "";
  const categoryParam = searchParams.get("category") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const colorParam = searchParams.get("color") || "";
  const sizeParam = searchParams.get("size") || "";
  const orderingParam = searchParams.get("ordering") || "-created_at";

  // 🔎 Filters state
  const [keyword, setKeyword] = useState(keywordParam);
  const [category, setCategory] = useState(categoryParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [color, setColor] = useState(colorParam);
  const [size, setSize] = useState(sizeParam);
  const [ordering, setOrdering] = useState(orderingParam);
  const [showFilters, setShowFilters] = useState(false);

  // 📦 Products
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // 🗂️ Categories from Redux
  const { categories, loading: loadingCategories } = useSelector(
    (state) => state.categoryList || {}
  );

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  // Update URL with current filters
  const updateURLParams = useCallback(() => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (color) params.set("color", color);
    if (size) params.set("size", size);
    if (ordering !== "-created_at") params.set("ordering", ordering);
    
    navigate(`?${params.toString()}`, { replace: true });
  }, [keyword, category, minPrice, maxPrice, color, size, ordering, navigate]);

  // Fetch products with debouncing
  const fetchProducts = useCallback(async (isNewSearch = false) => {
    const currentPage = isNewSearch ? 1 : page;
    
    setLoadingProducts(true);
    setError(null);
    
    try {
      const { data } = await axios.get(`${API_URL}/api/search/`, {
        params: {
          search: keyword || undefined,
          "category__id": category || undefined,
          "price__gte": minPrice || undefined,
          "price__lte": maxPrice || undefined,
          "variants__color": color || undefined,
          "variants__size": size || undefined,
          ordering,
          page: currentPage,
        },
      });

      if (isNewSearch) {
        setProducts(data.results || []);
        setPage(1);
      } else {
        setProducts(prev => [...prev, ...(data.results || [])]);
      }
      
      setHasMore(!!data.next);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoadingProducts(false);
    }
  }, [keyword, category, minPrice, maxPrice, color, size, ordering, page]);

  // Debounced search
  useEffect(() => {
    updateURLParams();
    
    const handler = setTimeout(() => {
      fetchProducts(true);
    }, 500);

    return () => clearTimeout(handler);
  }, [updateURLParams, fetchProducts, keyword, category, minPrice, maxPrice, color, size, ordering]);

  const handleResetFilters = () => {
    setKeyword("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setColor("");
    setSize("");
    setOrdering("-created_at");
    setSearchParams({});
  };

  const loadMore = () => {
    if (hasMore && !loadingProducts) {
      setPage(prev => prev + 1);
      fetchProducts(false);
    }
  };

  const handleProductClick = (product) => {
    // Navigate to product detail page using slug
    navigate(`/product/${product.slug}`);
  };

  const hasActiveFilters = keyword || category || minPrice || maxPrice || color || size || ordering !== "-created_at";

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Advanced Search</h2>
        <div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          {hasActiveFilters && (
            <button
              className="btn btn-outline-danger"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 🔍 Filters Section */}
      {showFilters && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="form-control"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {loadingCategories ? (
                    <option disabled>Loading categories...</option>
                  ) : (
                    categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Sort By</label>
                <select
                  className="form-select"
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                >
                  <option value="-created_at">Newest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-average_rating">Top Rated</option>
                  <option value="name">Name: A-Z</option>
                  <option value="-name">Name: Z-A</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Min Price (₦)</label>
                <input
                  type="number"
                  placeholder="Min"
                  className="form-control"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Max Price (₦)</label>
                <input
                  type="number"
                  placeholder="Max"
                  className="form-control"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Color</label>
                <input
                  type="text"
                  placeholder="e.g. Red, Blue"
                  className="form-control"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Size</label>
                <input
                  type="text"
                  placeholder="e.g. S, M, L"
                  className="form-control"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-muted mb-0">
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </p>
        {hasActiveFilters && (
          <small className="text-muted">
            Filtered by: {keyword && "Search"}{keyword && category && ", "}
            {category && "Category"}{category && minPrice && ", "}
            {minPrice && "Min Price"}{minPrice && maxPrice && ", "}
            {maxPrice && "Max Price"}{maxPrice && color && ", "}
            {color && "Color"}{color && size && ", "}
            {size && "Size"}
          </small>
        )}
      </div>

      {/* 📦 Products Section */}
      {loadingProducts && page === 1 ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : products.length === 0 ? (
        <Message>
          No products found. Try adjusting your filters.
        </Message>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {products.map((product) => (
              <div key={product.id} className="col">
                <div 
                  className="card h-100 product-card"
                  onClick={() => handleProductClick(product)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={product.images?.[0]?.image || "/placeholder.png"}
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">{product.name}</h6>
                    <div className="mt-auto">
                      {product.promo_price ? (
                        <div>
                          <span className="text-decoration-line-through text-muted me-2">
                            ₦{product.price}
                          </span>
                          <span className="text-success fw-bold">
                            ₦{product.promo_price}
                          </span>
                        </div>
                      ) : (
                        <span className="fw-bold">₦{product.price}</span>
                      )}
                      <small className="d-block text-muted">
                        {product.category}
                      </small>
                      {product.average_rating > 0 && (
                        <div className="mt-2">
                          <small className="text-warning">
                            {"★".repeat(Math.round(product.average_rating))}
                            {"☆".repeat(5 - Math.round(product.average_rating))}
                          </small>
                          <small className="text-muted ms-1">
                            ({product.review_count})
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-4">
              <button
                className="btn btn-outline-primary"
                onClick={loadMore}
                disabled={loadingProducts}
              >
                {loadingProducts ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdvancedSearch;
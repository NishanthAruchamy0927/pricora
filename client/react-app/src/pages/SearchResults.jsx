import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts, getProducts } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q');
  const category = searchParams.get('category');
  const page = Number(searchParams.get('page')) || 1;

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let res;
        if (q) {
          res = await searchProducts(q);
          setProducts(res.data.products);
          setTotalPages(1);
        } else {
          res = await getProducts({ category, sort, page, limit: 12 });
          setProducts(res.data.products);
          setTotalPages(res.data.totalPages || 1);
        }
      } catch (err) {
        console.error('Search failed', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [q, category, sort, page]);

  const goToPage = (newPage) => {
    const params = Object.fromEntries(searchParams.entries());
    params.page = newPage;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h2>{q ? `Results for "${q}"` : 'Browse Products'}</h2>
        {!q && (
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort: Newest</option>
            <option value="rating">Rating</option>
            <option value="popularity">Popularity</option>
          </select>
        )}
      </div>

      {loading ? (
        <div className="skeleton-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="no-results">
          <h3>No products found</h3>
          <p>Try a different search term or browse categories from the home page.</p>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {!q && totalPages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                ← Previous
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <button disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
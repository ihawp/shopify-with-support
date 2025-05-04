import { useEffect, useState } from 'react';
import { client } from '../middleware/ShopifyProvider.jsx';

import Product from '../components/Product.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (cursor = null) => {
    setLoading(true);

    const query = `
      {
        products(first: 2${cursor ? `, after: "${cursor}"` : ''}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
                  node {
                    id
                    title
                    handle
                    variants(first: 1) {
                      edges {
                        node {
                          id
                        }
                      }
                    }
                    images(first: 1) {
                      edges {
                        node {
                          url
                        }
                      }
                    }
                  }
                }
        }
      }
    `;

    try {
      const response = await client.request(query);

      const newProducts = response?.data?.products?.edges || [];
      const pageInfo = response?.data?.products?.pageInfo;

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.node.id));
        const uniqueNew = newProducts.filter((p) => !existingIds.has(p.node.id));
        return [...prev, ...uniqueNew];
      });
      setEndCursor(pageInfo.endCursor);
      setHasNextPage(pageInfo.hasNextPage);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <main>
      <header>
        <h1>Home Page</h1>
      </header>

      <section>
        {products.length === 0 ? <p>No results</p> : null}
        {products.map(({ node }, index) => (
          <Product node={node} key={node.id || index} />
        ))}
      </section>

      {hasNextPage && (
        <button onClick={() => fetchProducts(endCursor)} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </main>
  );
}

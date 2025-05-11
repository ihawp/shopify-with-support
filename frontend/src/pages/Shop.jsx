import { useEffect, useState, useContext } from 'react';
import { client } from '../middleware/ShopifyProvider.jsx';

import Product from '../components/Product.jsx';
import '../styles/Shop/shop.css';
import Hero from '../components/Hero.jsx';
import SearchBar from '../components/SearchBar.jsx';

import { SocketContext } from "../middleware/SocketProvider";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const { users } = useContext(SocketContext);

  const fetchProducts = async (cursor = null) => {
    setLoading(true);

    const query = `
    {
      products(first: 6${cursor ? `, after: "${cursor}"` : ''}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                    currencyCode
                  }
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

  return <main className='flex flex-col items-center gap-1'>

      <Hero leftIdentity='shop-hero' backgroundClass={'background-1'} title='store.ihawp.com' subtitle="We&apos;re here to help." description='Want to learn Front-End Web Development?' hashLinks={[{to: '#user-count', title: "Shop Now"}]} links={[{to: '/support', title: "Need Help?"}]}/>

      <section className='flex flex-row gap-1 justify-between'>
        <div title={`Shoppers Online: ${users}`} className='bubble py-1 px-0-5 flex items-center flex-row gap-1' id="user-count">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"/></svg>
          <span>{users}</span>
        </div>
        <SearchBar />
      </section>

      <section id="shop" className='shop-products flex flex-row flex-wrap'>
        {products.map(({ node }, index) => (
          <Product node={node} key={node.id || index} />
        ))}
      </section>

        {hasNextPage && (
          <section className='text-center h-1 flex justify-center items-center'>
          <button className="py-1 px-0-5" onClick={() => fetchProducts(endCursor)} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
          </section>
        )}
    </main>;
}

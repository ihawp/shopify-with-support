import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';

import { client } from '../middleware/ShopifyProvider';

import { CartContext } from '../middleware/CartProvider';

import '../styles/Product/individual.css';

export default function Product() {
    const { id } = useParams();
    const location = useLocation();

    const { addItemToCart, removeItemFromCart, isItemInCart, updateItemQuantity, loadingCart } = useContext(CartContext);

    const gid = location.state?.gid || 'gid://shopify/Product/' + id;

    const [productInfo, setProductInfo] = useState([]);

    useEffect(() => {

        const query = `
            {
                product(id: "${gid}") {
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
        `;

        // might be useful for cases of showing up to product page without handle.
        // by I could keep product ids on hand somewhere..?
        // productByHandle is deprecated
        const deprecatedQuery = `
            {
                productByHandle(handle: "${'gid://shopify/Product/' + id}") {
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
        `;

        const getProductById = async () => {
            const cliReq = await client.request(query);
            if (cliReq.data?.product) setProductInfo(cliReq.data.product);
        }

        getProductById();

    }, []);

    const AddToCart = (event) => {
        event.stopPropagation();
        addItemToCart(productInfo);
    }
    
    const RemoveFromCart = (event) => {
        event.stopPropagation();
        removeItemFromCart(productInfo.id);
    }

    return <main id="individual" className='flex flex-col items-center'>
        <header>
            <img src={productInfo.images?.edges[0].node.url} alt={productInfo.title} title={productInfo.title} />
            <div className="content">
                <div>
                    <h1>{productInfo.title}</h1>
                    <p>{productInfo.description}</p>
                </div>
                <div>
                    <p className="price" aria-label="Price">{`$${productInfo?.variants?.edges[0]?.node?.price?.amount}0 ${productInfo?.variants?.edges[0]?.node?.price?.currencyCode}`}</p>
                    {isItemInCart(productInfo.id) ? <button className="p-0-5 h-min min-w-1-5" onClick={RemoveFromCart}>Remove From Cart</button> : <button className="p-0-5 h-min min-w-1-5" onClick={AddToCart}>Add To Cart</button> }
                </div>
            </div>
        </header>
        <section>
        </section>
    </main>;
}
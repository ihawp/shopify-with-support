import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { client } from '../middleware/ShopifyProvider';

export default function Product() {
    const { handle } = useParams();
    const location = useLocation();

    const id = location.state?.gid;

    const [productInfo, setProductInfo] = useState([]);

    useEffect(() => {

        const query = `
            {
                product(id: "${id}") {
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
                productByHandle(handle: "${handle}") {
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
            if (cliReq.data?.product) {
                setProductInfo(cliReq.data.product);
            }
        }

        getProductById();

    }, []);

    return <main className='flex flex-col items-center'>
        <header>
            <h1>{productInfo.title}</h1>
        </header>
        <section>
            <p>{productInfo.description}</p>
        </section>
    </main>;
}
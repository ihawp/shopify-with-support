import { useContext, useState, useEffect } from 'react';
import { CartContext } from "../middleware/CartProvider";
import { client } from '../middleware/ShopifyProvider';

import Product from '../components/Product';
import Hero from '../components/Hero';

import '../styles/Cart/cart.css';

export default function Cart() {

    const { cartItems, addItemToCart, removeItemFromCart, isItemInCart, updateItemQuantity, loadingCart } = useContext(CartContext);

    const [cartPrice, setCartPrice] = useState(0);
    const [itemizedPrices, setItemizedPrices] = useState([]);

    async function createCheckout(cartItems) {
        const lines = cartItems.map((item) => ({
            merchandiseId: item.variants.edges[0].node.id,
            quantity: item.quantity || 1,
        }));

        const cartCreateMutation = `
            mutation ($input: CartInput!) {
                cartCreate(input: $input) {
                    cart {
                        id
                        checkoutUrl
                    }
                    userErrors {
                        message
                    }
                }
            }
        `;

        try {
            const { data, errors } = await client.request(cartCreateMutation, {
                variables: { input: { lines } },
            });

            if (errors) {
                console.error('GraphQL errors:', errors);
            } else {
                const checkoutUrl = data?.cartCreate?.cart?.checkoutUrl;
                if (checkoutUrl) {
                    window.location.href = checkoutUrl;
                }
            }
        } catch (err) {
            console.error('Cart creation failed:', err);
        }
    }

    const RemoveFromCart = (event, id) => {
        event.stopPropagation();
        removeItemFromCart(id);
    }

    const AddToCart = (event, product) => {
        event.stopPropagation();
        addItemToCart(product);
    }

    useEffect(() => {
        if (cartItems.length > 0) {
            const itemDetails = cartItems.map((item) => {
                const price = parseFloat(item?.variants?.edges[0]?.node?.price?.amount || 0);
                const quantity = item.quantity || 1;
                const total = price * quantity;
                return {
                    title: item.title,
                    quantity,
                    price,
                    total
                };
            });

            const totalPrice = itemDetails.reduce((sum, item) => sum + item.total, 0);
            setItemizedPrices(itemDetails);
            setCartPrice(totalPrice);
        } else {
            setCartPrice(0);
            setItemizedPrices([]);
        }
    }, [cartItems]);

    const makeCheckoutButton = () => {
        return (
            <button className="py-1 px-0-5" onClick={() => createCheckout(cartItems)}>
                Go to Checkout
            </button>
        );
    }

    return (
        <main className='flex flex-col items-center'>
            {cartItems.length > 0 ? (
                <header>
                    <div className='cart-title'>
                        <h1>Your Cart | {cartItems.length} items</h1>
                        <p>Total ${cartPrice.toFixed(2)}</p>
                        {makeCheckoutButton()}
                    </div>
                </header>
            ) : null}
            <section>
                <div className='cart-product flex flex-col gap-2'>
                    {cartItems.length > 0 ? (
                        cartItems.map((item, key) => (
                            <Product
                                key={key}
                                node={item}
                                cart={{ AddToCart, RemoveFromCart, isItemInCart }}
                            />
                        ))
                    ) : (
                        <Hero leftIdentity={'support-hero cart-hero'} backgroundClass={'background-3'} title='Cart' subtitle='Your Cart is empty!' description='Add items, or receive support by clicking the buttons below.' links={[ { to: '/support', title: 'Get Support' }, { to: '/', title: 'Shop Now' } ]} />
                    )}
                </div>
            </section>
            {cartItems.length > 0 ? (
                <section className='flex flex-col mt-2 pt-1 cart-price'>
                    {itemizedPrices.length > 0 && (
                        <div>
                            <ul>
                              {itemizedPrices.map((item, idx) => (
                                <li key={idx}>
                                  <span className="price-calculation">{item.quantity} x {item.title}</span> <span className="price-calculation-total">(${item.total})</span>
                                </li>
                              ))}
                            </ul>
                        </div>
                    )}
                    <div className='flex flex-row w-100 items-center mt-1 bt-1 pt-1 justify-between'>
                      <p>Total: ${cartPrice.toFixed(2)}</p>
                      {makeCheckoutButton()}
                    </div>
                </section>
            ) : null}
        </main>
    );
}
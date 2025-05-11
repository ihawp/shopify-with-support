// GOALS of PAGE:

// if items in cart show them!

// if not say no items and provide button
// to store (home)

// generate checkout button that links
// to shopify SECURE checkout page

import { useContext, useState, useEffect } from 'react';

import { CartContext } from "../middleware/CartProvider";

import Product from '../components/Product';

import { client } from '../middleware/ShopifyProvider';
import Hero from '../components/Hero';

export default function Cart() {

    const { cartItems, addItemToCart, removeItemFromCart, isItemInCart, updateItemQuantity, loadingCart } = useContext(CartContext);

    // This allows for product to stay in cart if removed (for readding)
    // Product is removed upon reload as it would not be included in localStorage
    // after the initial removal... unless it was readded to cart..!
    const [cartPrice, setCartPrice] = useState(0);

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
              window.location.href = checkoutUrl;  // Redirect to checkout URL
            }
          }
        } catch (err) {
          console.error('Cart creation failed:', err);
        }
    }

    // this below is repeated in Product.jsx
    // Part of a larger pattern of needing to be able 
    // to update cart via ANY product listings.
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
        const total = cartItems.reduce((sum, item) => {
          const price = parseFloat(item?.variants?.edges[0]?.node?.price?.amount || 0);
          return sum + price;
        }, 0);
    
        setCartPrice(total);
      } else {
        setCartPrice(0);
      }
    }, [cartItems]);

    return <main className='flex flex-col items-center'>
        {cartItems.length > 0 ? <header className='px-2'>
            <h1>Your Cart:</h1>
        </header> : null}
        <section>
            <div className='cart-product flex flex-col gap-2'>
                {cartItems.length > 0 ? cartItems.map((item, key) => {
                    // pipe drilling
                    return <Product key={key} node={item} cart={{ AddToCart, RemoveFromCart, isItemInCart }} />
                }) : <Hero leftIdentity={'support-hero cart-hero'} backgroundClass={'background-3'} title='Cart' subtitle='Your Cart is empty!' description='Add items, or receive support by clicking the buttons below.' links={[{to: '/support', title: 'Get Support'}, {to: '/', title: 'Shop Now'}]} />}
            </div>
        </section>
        {cartItems.length > 0 ? <section className='flex justify-center mt-2 justify-between bt-1 pt-1'>
            <p>Total: ${cartPrice}.00</p>
            {cartItems.length > 0 && (
                <button className="py-1 px-0-5" onClick={() => createCheckout(cartItems)}>
                    Go to Checkout
                </button>
            )}
        </section> : null}
    </main>

}

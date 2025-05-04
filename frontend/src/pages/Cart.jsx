// GOALS of PAGE:

// if items in cart show them!

// if not say no items and provide button
// to store (home)

// generate checkout button that links
// to shopify SECURE checkout page

import { useContext, useState } from 'react';

import { CartContext } from "../middleware/CartProvider";

import CartProduct from '../components/CartProduct';

import { client } from '../middleware/ShopifyProvider';

export default function Cart() {

    const { cartItems, addItemToCart, removeItemFromCart, isItemInCart, updateItemQuantity, loadingCart } = useContext(CartContext);

    // This allows for product to stay in cart if removed (for readding)
    // Product is removed upon reload as it would not be included in localStorage
    // after the initial removal... unless it was readded to cart..!
    const [cartOnPrint, setCartOnPrint] = useState(cartItems);

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

    return <main>
        <header>
            <h1>Cart Page</h1>
        </header>
        <section>
            <p>Print cart contents here.</p>
            <div>
                {cartOnPrint.map((item, key) => {
                    // pipe drilling
                    return <CartProduct key={key} item={item} cart={{ AddToCart, RemoveFromCart, isItemInCart }} />
                })}
            </div>
        </section>
        <section>
            {cartItems.length > 0 && (
                <button onClick={() => createCheckout(cartItems)}>
                    Go to Checkout
                </button>
            )}
        </section>
    </main>

}

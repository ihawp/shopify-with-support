import { createContext, useState, useEffect } from 'react';

import { client } from './ShopifyProvider';

export const CartContext = createContext();

export default function CartProvider({ children }) {
  
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
      localStorage.removeItem('cart');
      return [];
    }
  });

  const [loadingCart, setLoadingCart] = useState(cartItems);

  useEffect(() => {
    if (cartItems.length > 0) {
      setLoadingCart(false);
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeItemFromCart = (id) => {
    setCartItems((prev) => prev.filter(item => item.id !== id));
  };

  const isItemInCart = (id) => {
    return cartItems.some(item => item.id === id);
  };

  const updateItemQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeItemFromCart(id);
    } else {
      setCartItems((prev) => 
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addItemToCart,
      removeItemFromCart,
      isItemInCart,
      updateItemQuantity,
      loadingCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
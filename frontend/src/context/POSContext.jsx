import { createContext, useState, useContext } from 'react';
import { transactionService } from '../services/transactions';

const POSContext = createContext(null);

export const usePOS = () => useContext(POSContext);

export const POSProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [receipt, setReceipt] = useState(null);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity < product.stock) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return prev;
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const product = item.product;
          if (newQty > product.stock) {
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const checkout = async () => {
    if (cart.length === 0) return;
    const items = cart.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));
    try {
      const transaction = await transactionService.create(items);
      setReceipt(transaction);
      setCart([]);
      return transaction;
    } catch (error) {
      alert(error.response?.data?.message || 'Checkout failed');
      throw error;
    }
  };

  return (
    <POSContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        total,
        checkout,
        receipt,
        setReceipt,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

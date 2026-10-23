import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products } from "../data/products";

const CartContext = createContext(null);
const productById = new Map(products.map((product) => [product.id, product]));

function readStoredCart() {
  try {
    const storedCart = JSON.parse(localStorage.getItem("eastman-cart") || "[]");
    if (!Array.isArray(storedCart)) return [];

    return storedCart.flatMap((item) => {
      const product = productById.get(item?.id);
      const quantity = Number(item?.quantity);
      return product && Number.isInteger(quantity) && quantity > 0
        ? [{ id: product.id, quantity: Math.min(quantity, product.stock) }]
        : [];
    }).filter((item) => item.quantity > 0);
  } catch (error) {
    console.error("Unable to restore the saved cart.", error);
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readStoredCart);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("eastman-cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Unable to save the cart.", error);
    }
  }, [cartItems]);

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timeout = window.setTimeout(() => setToastMessage(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const addToCart = (productId, quantity = 1) => {
    const product = productById.get(productId);
    if (!product || product.stock < 1 || !Number.isInteger(quantity) || quantity < 1) return false;

    setCartItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === productId);
      const currentQuantity = existing?.quantity ?? 0;
      const nextQuantity = Math.min(currentQuantity + quantity, product.stock);
      return existing
        ? currentItems.map((item) =>
            item.id === productId ? { ...item, quantity: nextQuantity } : item,
          )
        : [...currentItems, { id: productId, quantity: Math.min(quantity, product.stock) }];
    });
    setToastMessage("Added to cart");
    return true;
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    const product = productById.get(productId);
    if (!product) return;
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(Math.floor(quantity), product.stock) }
          : item,
      ).filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => setCartItems([]);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const detailedItems = cartItems.flatMap((item) => {
    const product = productById.get(item.id);
    return product ? [{ ...product, quantity: item.quantity }] : [];
  });
  const subtotal = detailedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const value = useMemo(
    () => ({
      cartItems,
      detailedItems,
      itemCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toastMessage,
      dismissToast: () => setToastMessage(""),
    }),
    [cartItems, detailedItems, itemCount, subtotal, toastMessage],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider.");
  return context;
}

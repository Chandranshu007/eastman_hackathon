import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Toast from "./components/Toast";
import { CartProvider, useCart } from "./context/CartContext";
import Cart from "./pages/Cart";
import Categories from "./pages/Categories";
import CheckoutPlaceholder from "./pages/CheckoutPlaceholder";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";

function AppShell() {
  const { toastMessage, dismissToast } = useCart();
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckoutPlaceholder />} />
        <Route path="*" element={<ProductDetails />} />
      </Routes>
      <Footer />
      <Toast message={toastMessage} onDismiss={dismissToast} />
    </BrowserRouter>
  );
}

export default function App() {
  return <CartProvider><AppShell /></CartProvider>;
}

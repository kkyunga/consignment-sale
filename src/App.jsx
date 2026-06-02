import { useState } from "react";
import Dashboard         from "./pages/Dashboard";
import ProductForm       from "./pages/ProductForm.jsx";
import ProductList       from "./pages/ProductList";
import ProductDetail     from "./pages/ProductDetail";
import OrderManagement   from "./pages/OrderManagement";
import CalculatorPage    from "./pages/MarginCalculator";
import "./App.css";

const NAV = [
  { key: "dashboard",       icon: "▦", label: "대시보드" },
  { key: "productList",     icon: "☰", label: "상품 목록" },
  { key: "productAdd",      icon: "＋", label: "상품 추가" },
  { key: "orderManagement", icon: "◫", label: "주문 관리" },
  { key: "calculator",      icon: "⊞", label: "마진 계산기" },
];

export default function App() {
  const [page, setPage]             = useState("dashboard");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = (key) => {
    setPage(key);
    setSelectedProduct(null);
  };

  /* 상품 목록 → 상세 */
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setPage("productDetail");
  };

  return (
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <span className="logo-icon">⬡</span>
            <span className="logo-text">셀러허브</span>
          </div>
          <nav className="sidebar-nav">
            {NAV.map(({ key, icon, label }) => (
                <button
                    key={key}
                    className={`nav-item ${page === key || (key === "productList" && page === "productDetail") ? "active" : ""}`}
                    onClick={() => navigate(key)}
                >
                  <span className="nav-icon">{icon}</span>
                  <span>{label}</span>
                </button>
            ))}
            <button className="nav-item">
              <span className="nav-icon">⚙</span>
              <span>설정</span>
            </button>
          </nav>
        </aside>

        <main className="main-content">
          {page === "dashboard"        && <Dashboard />}
          {page === "productAdd"       && <ProductForm />}
          {page === "productList"      && (
              <ProductList onSelectProduct={handleSelectProduct} />
          )}
          {page === "productDetail"    && (
              <ProductDetail
                  product={selectedProduct}
                  onBack={() => setPage("productList")}
              />
          )}
          {page === "orderManagement"  && <OrderManagement />}
          {page === "calculator"       && <CalculatorPage />}
        </main>
      </div>
  );
}
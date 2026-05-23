import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import ProductForm from "./pages/ProductForm";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("dashboard"); // "dashboard" | "productAdd"

  return (
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <span className="logo-icon">⬡</span>
            <span className="logo-text">셀러허브</span>
          </div>
          <nav className="sidebar-nav">
            <button
                className={`nav-item ${page === "dashboard" ? "active" : ""}`}
                onClick={() => setPage("dashboard")}
            >
              <span className="nav-icon">▦</span>
              <span>대시보드</span>
            </button>
            <button
                className={`nav-item ${page === "productAdd" ? "active" : ""}`}
                onClick={() => setPage("productAdd")}
            >
              <span className="nav-icon">＋</span>
              <span>상품 추가</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">☰</span>
              <span>상품 목록</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">◫</span>
              <span>주문 관리</span>
            </button>
            <button className="nav-item">
              <span className="nav-icon">⚙</span>
              <span>설정</span>
            </button>
          </nav>
        </aside>

        <main className="main-content">
          {page === "dashboard" && <Dashboard />}
          {page === "productAdd" && <ProductForm />}
        </main>
      </div>
  );
}
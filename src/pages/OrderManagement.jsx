import { useState } from "react";

/* ── 샘플 주문 데이터 ── */
const SAMPLE_ORDERS = [
    { id: 1, platform: "네이버", name: "강하지 건식 5봉지", optionTitle: "랜덤 2종", salePrice: 15000, qty: 2, registeredAt: "2026-04-22 11:29:34" },
    { id: 2, platform: "쿠팡",  name: "사과 5kg 유기농",   optionTitle: "대",        salePrice: 20000, qty: 1, registeredAt: "2026-04-21 09:14:10" },
    { id: 3, platform: "11번가", name: "배 3kg",            optionTitle: "-",        salePrice: 15000, qty: 3, registeredAt: "2026-04-20 16:44:55" },
    { id: 4, platform: "네이버", name: "딸기 500g",         optionTitle: "소",        salePrice: 12000, qty: 1, registeredAt: "2026-04-19 08:30:00" },
];

/* ── 샘플 상품 데이터 (조회하기 모달용) ── */
const SAMPLE_PRODUCTS_FOR_SEARCH = [
    { id: 1, platform: "네이버",  name: "강하지 건식 5봉지", option: "랜덤 2종" },
    { id: 2, platform: "쿠팡",   name: "사과 5kg 유기농",   option: "소/중/대" },
    { id: 3, platform: "11번가", name: "배 3kg",            option: "-" },
    { id: 4, platform: "네이버", name: "딸기 500g",         option: "소/중/대" },
    { id: 5, platform: "쿠팡",   name: "감귤 2kg",          option: "-" },
];

const PLATFORM_COLORS = {
    쿠팡:    { bg: "#fff1f0", color: "#cf1322" },
    네이버:   { bg: "#e6f4ff", color: "#0958d9" },
    "11번가": { bg: "#fff7e6", color: "#d46b08" },
};

function PlatformChip({ name }) {
    const s = PLATFORM_COLORS[name] ?? { bg: "#f0f0f0", color: "#555" };
    return (
        <span style={{
            display: "inline-block", padding: "2px 10px", borderRadius: 100,
            fontSize: 12, fontWeight: 600, background: s.bg, color: s.color,
        }}>
            {name}
        </span>
    );
}

/* ──────────────────────────────────────────
   상품 조회 모달 (조회하기 클릭 시)
────────────────────────────────────────── */
function ProductSearchModal({ onSelect, onClose }) {
    const [searchText, setSearchText] = useState("");
    const [inputText,  setInputText]  = useState("");

    const filtered = SAMPLE_PRODUCTS_FOR_SEARCH.filter(
        (p) => searchText === "" || p.name.includes(searchText) || p.platform.includes(searchText)
    );

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-box" style={{ width: 480 }}>
                <div className="modal-title">
                    <span style={{ color: "var(--accent)" }}>🔍</span> 상품 조회
                </div>

                {/* 검색 */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <span style={{
                        padding: "8px 12px", background: "var(--bg)",
                        border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)",
                        fontSize: 13, color: "var(--text-secondary)",
                    }}>
                        상품명
                    </span>
                    <input
                        type="text"
                        placeholder="검색어"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && setSearchText(inputText)}
                        style={{ flex: 1 }}
                    />
                    <button
                        className="btn btn-primary"
                        style={{ padding: "8px 14px" }}
                        onClick={() => setSearchText(inputText)}
                    >
                        🔍
                    </button>
                </div>

                {/* 결과 테이블 */}
                <div style={{
                    maxHeight: 260, overflowY: "auto",
                    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                }}>
                    <table className="data-table" style={{ fontSize: 13 }}>
                        <thead>
                        <tr>
                            <th>플랫폼</th>
                            <th>상품명</th>
                            <th>옵션</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={{ textAlign: "center", padding: 24, color: "var(--text-muted)" }}>
                                    검색 결과 없음
                                </td>
                            </tr>
                        ) : (
                            filtered.map((p) => (
                                <tr
                                    key={p.id}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => onSelect(p)}
                                >
                                    <td><PlatformChip name={p.platform} /></td>
                                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                                    <td style={{ color: "var(--text-secondary)" }}>{p.option}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="modal-actions" style={{ marginTop: 16 }}>
                    <button className="btn btn-secondary" onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────
   행 클릭 팝업 (상품조회 + 수량 수정)
────────────────────────────────────────── */
function OrderRowPopup({ order, onClose, onSave }) {
    const [qty, setQty] = useState(order.qty);
    const [showProductSearch, setShowProductSearch] = useState(false);
    const [linkedProduct, setLinkedProduct] = useState(null);

    const handleSelectProduct = (p) => {
        setLinkedProduct(p);
        setShowProductSearch(false);
    };

    return (
        <>
            {showProductSearch && (
                <ProductSearchModal
                    onSelect={handleSelectProduct}
                    onClose={() => setShowProductSearch(false)}
                />
            )}

            <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
                <div className="modal-box" style={{ width: 380 }}>
                    <div className="modal-title">
                        <span style={{ color: "var(--accent)" }}>📦</span> 주문 상세
                    </div>

                    {/* 주문 요약 */}
                    <div style={{
                        background: "var(--bg)", borderRadius: "var(--radius-sm)",
                        padding: "12px 14px", marginBottom: 20, fontSize: 13,
                    }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                            <PlatformChip name={order.platform} />
                            <strong>{order.name}</strong>
                        </div>
                        <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                            옵션: {order.optionTitle} &nbsp;|&nbsp; {order.salePrice.toLocaleString()}원
                        </div>
                    </div>

                    {/* 상품 조회 */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{
                            fontSize: 12, fontWeight: 600, color: "var(--text-secondary)",
                            marginBottom: 8,
                        }}>
                            상품 조회
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <div style={{
                                flex: 1, padding: "8px 12px",
                                background: linkedProduct ? "var(--accent-light)" : "var(--bg)",
                                border: `1.5px solid ${linkedProduct ? "var(--accent)" : "var(--border)"}`,
                                borderRadius: "var(--radius-sm)",
                                fontSize: 13,
                                color: linkedProduct ? "var(--accent)" : "var(--text-muted)",
                            }}>
                                {linkedProduct
                                    ? `${linkedProduct.platform} · ${linkedProduct.name}`
                                    : "연결된 상품 없음"}
                            </div>
                            <button
                                className="btn btn-ghost"
                                onClick={() => setShowProductSearch(true)}
                            >
                                조회하기
                            </button>
                        </div>
                    </div>

                    {/* 수량 */}
                    <div style={{ marginBottom: 24 }}>
                        <div style={{
                            fontSize: 12, fontWeight: 600, color: "var(--text-secondary)",
                            marginBottom: 8,
                        }}>
                            수량
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <input
                                type="number"
                                min={1}
                                value={qty}
                                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                                style={{ width: 100, fontSize: 16, fontWeight: 700, textAlign: "center" }}
                            />
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <button
                                    onClick={() => setQty((q) => q + 1)}
                                    style={{
                                        width: 28, height: 22,
                                        border: "1.5px solid var(--border)", borderRadius: "4px 4px 0 0",
                                        background: "var(--surface)", cursor: "pointer", fontSize: 11,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}
                                >
                                    ▲
                                </button>
                                <button
                                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                                    style={{
                                        width: 28, height: 22,
                                        border: "1.5px solid var(--border)", borderTop: "none",
                                        borderRadius: "0 0 4px 4px",
                                        background: "var(--surface)", cursor: "pointer", fontSize: 11,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}
                                >
                                    ▼
                                </button>
                            </div>
                            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>키패드 입력 가능</span>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button className="btn btn-secondary" onClick={onClose}>취소</button>
                        <button className="btn btn-primary" onClick={() => { onSave(order.id, qty); onClose(); }}>
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ──────────────────────────────────────────
   주문 관리 (메인)
────────────────────────────────────────── */
export default function OrderManagement() {
    const [orders, setOrders]         = useState(SAMPLE_ORDERS);
    const [selected, setSelected]     = useState([]);
    const [activeOrder, setActiveOrder] = useState(null); // 팝업 대상 행

    /* 체크박스 */
    const toggleRow = (id) =>
        setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    const toggleAll = () =>
        setSelected(selected.length === orders.length ? [] : orders.map((o) => o.id));

    /* 삭제 */
    const handleDeleteSelected = () => {
        if (selected.length === 0) return alert("삭제할 항목을 선택하세요.");
        if (window.confirm(`${selected.length}개 주문을 삭제할까요?`)) {
            setOrders((prev) => prev.filter((o) => !selected.includes(o.id)));
            setSelected([]);
        }
    };

    /* 추가 (빈 행) */
    const handleAdd = () => {
        const newOrder = {
            id: Date.now(),
            platform: "네이버",
            name: "새 주문",
            optionTitle: "-",
            salePrice: 0,
            qty: 1,
            registeredAt: new Date().toISOString().replace("T", " ").slice(0, 19),
        };
        setOrders((prev) => [newOrder, ...prev]);
    };

    /* 수량 저장 */
    const handleSaveQty = (orderId, newQty) => {
        setOrders((prev) =>
            prev.map((o) => o.id === orderId ? { ...o, qty: newQty } : o)
        );
    };

    return (
        <div>
            {/* 행 팝업 */}
            {activeOrder && (
                <OrderRowPopup
                    order={activeOrder}
                    onClose={() => setActiveOrder(null)}
                    onSave={handleSaveQty}
                />
            )}

            {/* 헤더 */}
            <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                    <div className="page-title">주문 관리</div>
                    <div className="page-subtitle">주문 내역을 확인하고 수량을 관리하세요</div>
                </div>
                <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
                    <button
                        className="btn btn-secondary"
                        style={{
                            color: selected.length ? "var(--danger)" : undefined,
                            borderColor: selected.length ? "var(--danger)" : undefined,
                        }}
                        onClick={handleDeleteSelected}
                    >
                        삭제 {selected.length > 0 && `(${selected.length})`}
                    </button>
                    <button className="btn btn-primary" onClick={handleAdd}>
                        ＋ 추가
                    </button>
                </div>
            </div>

            {/* 테이블 */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th style={{ width: 40, textAlign: "center" }}>
                                <input
                                    type="checkbox"
                                    checked={selected.length === orders.length && orders.length > 0}
                                    onChange={toggleAll}
                                />
                            </th>
                            <th>플랫폼</th>
                            <th>상품명</th>
                            <th>옵션 제목 (내용)</th>
                            <th>판매가</th>
                            <th>수량</th>
                            <th>등록일</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                                    주문 내역이 없습니다
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr
                                    key={order.id}
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                        if (e.target.type === "checkbox") return;
                                        setActiveOrder(order);
                                    }}
                                >
                                    <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(order.id)}
                                            onChange={() => toggleRow(order.id)}
                                        />
                                    </td>
                                    <td><PlatformChip name={order.platform} /></td>
                                    <td style={{ fontWeight: 500 }}>{order.name}</td>
                                    <td style={{ color: "var(--text-secondary)" }}>{order.optionTitle}</td>
                                    <td style={{ fontWeight: 600 }}>{order.salePrice.toLocaleString()}원</td>
                                    <td>
                                            <span style={{
                                                display: "inline-block",
                                                padding: "2px 12px", borderRadius: 100,
                                                background: "var(--accent-light)",
                                                color: "var(--accent)", fontWeight: 700,
                                            }}>
                                                {order.qty}
                                            </span>
                                    </td>
                                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>
                                        {order.registeredAt}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <div style={{
                    padding: "12px 20px",
                    borderTop: "1px solid var(--border)",
                    fontSize: 13, color: "var(--text-muted)",
                    display: "flex", justifyContent: "space-between",
                }}>
                    <span>전체 {orders.length}건</span>
                    <span>{selected.length > 0 && `${selected.length}개 선택됨`}</span>
                </div>
            </div>
        </div>
    );
}
import { useState, useMemo } from "react";

/* ── 샘플 데이터 ── */
const SAMPLE_PRODUCTS = [
    { id: 1, platform: "쿠팡",   name: "사과 5kg 유기농", source: "화과농원", supplyPrice: 10000, salePrice: 20000, shipping: "있음", extraShipping: "없음", netProfit: 5000 },
    { id: 2, platform: "네이버",  name: "사과 5kg",      source: "화과농원", supplyPrice: 10000, salePrice: 20000, shipping: "있음", extraShipping: "있음", netProfit: 4000 },
    { id: 3, platform: "11번가", name: "배 3kg",         source: "과일마트", supplyPrice: 8000,  salePrice: 15000, shipping: "무료", extraShipping: "없음", netProfit: 3500 },
    { id: 4, platform: "쿠팡",   name: "딸기 500g",     source: "딸기농장", supplyPrice: 5000,  salePrice: 12000, shipping: "있음", extraShipping: "있음", netProfit: 2800 },
    { id: 5, platform: "네이버",  name: "감귤 2kg",      source: "제주농원", supplyPrice: 7000,  salePrice: 14000, shipping: "무료", extraShipping: "없음", netProfit: 3200 },
];

const PLATFORM_COLORS = {
    쿠팡:   { bg: "#fff1f0", color: "#cf1322" },
    네이버:  { bg: "#e6f4ff", color: "#0958d9" },
    "11번가":{ bg: "#fff7e6", color: "#d46b08" },
    지마켓:  { bg: "#f9f0ff", color: "#531dab" },
};

const CATEGORIES = ["전체", "식품", "의류", "전자기기", "생활용품", "기타"];

const COLUMNS = [
    { key: "platform",      label: "플랫폼" },
    { key: "name",          label: "상품명" },
    { key: "source",        label: "출처" },
    { key: "supplyPrice",   label: "공급가" },
    { key: "salePrice",     label: "판매가" },
    { key: "shipping",      label: "배송비" },
    { key: "extraShipping", label: "추가배송비" },
    { key: "netProfit",     label: "순이익" },
];

/* ── 플랫폼 칩 ── */
function PlatformChip({ name }) {
    const style = PLATFORM_COLORS[name] ?? { bg: "#f0f0f0", color: "#555" };
    return (
        <span style={{
            display: "inline-block", padding: "2px 10px", borderRadius: 100,
            fontSize: 12, fontWeight: 600,
            background: style.bg, color: style.color,
        }}>
            {name}
        </span>
    );
}

/* ── 정렬 아이콘 ── */
function SortIcon({ dir }) {
    return (
        <span style={{ fontSize: 10, marginLeft: 3, opacity: 0.6 }}>
            {dir === "asc" ? "▲" : dir === "desc" ? "▼" : "⇅"}
        </span>
    );
}

export default function ProductList({ onSelectProduct }) {
    const [category, setCategory]         = useState("전체");
    const [searchText, setSearchText]     = useState("");
    const [inputText, setInputText]       = useState("");
    const [selected, setSelected]         = useState([]);
    const [sortKey, setSortKey]           = useState(null);
    const [sortDir, setSortDir]           = useState("asc");

    /* 정렬 토글 */
    const handleSort = (key) => {
        if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else { setSortKey(key); setSortDir("asc"); }
    };

    /* 필터 + 정렬 */
    const rows = useMemo(() => {
        let list = SAMPLE_PRODUCTS.filter((p) =>
            (category === "전체" || true) &&
            (searchText === "" || p.name.includes(searchText) || p.source.includes(searchText))
        );
        if (sortKey) {
            list = [...list].sort((a, b) => {
                const av = a[sortKey], bv = b[sortKey];
                if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
                return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
            });
        }
        return list;
    }, [category, searchText, sortKey, sortDir]);

    /* 체크박스 */
    const toggleRow = (id) =>
        setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    const toggleAll = () =>
        setSelected(selected.length === rows.length ? [] : rows.map((r) => r.id));

    /* 선택 삭제 */
    const handleDeleteSelected = () => {
        if (selected.length === 0) return alert("삭제할 항목을 선택하세요.");
        if (window.confirm(`${selected.length}개 항목을 삭제할까요?`)) setSelected([]);
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-title">상품 목록</div>
                <div className="page-subtitle">등록된 상품을 조회하고 관리하세요</div>
            </div>

            {/* ── 카테고리 + 검색 툴바 ── */}
            <div className="card" style={{ marginBottom: 16, padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    {/* 카테고리 */}
                    <div style={{ display: "flex", gap: 6 }}>
                        {CATEGORIES.map((c) => (
                            <button
                                key={c}
                                onClick={() => setCategory(c)}
                                style={{
                                    padding: "6px 14px",
                                    borderRadius: 100,
                                    border: "1.5px solid",
                                    borderColor: category === c ? "var(--accent)" : "var(--border)",
                                    background: category === c ? "var(--accent)" : "var(--surface)",
                                    color: category === c ? "#fff" : "var(--text-secondary)",
                                    fontFamily: "inherit",
                                    fontSize: 13,
                                    fontWeight: category === c ? 600 : 400,
                                    cursor: "pointer",
                                    transition: "all .15s",
                                }}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    <div style={{ flex: 1 }} />

                    {/* 검색 */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <select
                            style={{
                                padding: "8px 10px", border: "1.5px solid var(--border)",
                                borderRadius: "var(--radius-sm)", fontFamily: "inherit",
                                fontSize: 13, color: "var(--text-primary)", background: "var(--surface)",
                                cursor: "pointer",
                            }}
                        >
                            <option>상품명</option>
                            <option>출처</option>
                            <option>플랫폼</option>
                        </select>
                        <input
                            type="text"
                            placeholder="검색어"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && setSearchText(inputText)}
                            style={{ width: 200 }}
                        />
                        <button
                            className="btn btn-primary"
                            style={{ padding: "8px 14px" }}
                            onClick={() => setSearchText(inputText)}
                        >
                            🔍
                        </button>
                    </div>

                    {/* 선택 삭제 */}
                    <button
                        className="btn btn-secondary"
                        style={{
                            borderColor: selected.length ? "var(--danger)" : undefined,
                            color: selected.length ? "var(--danger)" : undefined,
                        }}
                        onClick={handleDeleteSelected}
                    >
                        선택삭제 {selected.length > 0 && `(${selected.length})`}
                    </button>
                </div>
            </div>

            {/* ── 테이블 ── */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                    <table className="data-table" style={{ minWidth: 860 }}>
                        <thead>
                        <tr>
                            {/* 전체선택 체크박스 */}
                            <th style={{ width: 40, textAlign: "center" }}>
                                <input
                                    type="checkbox"
                                    checked={selected.length === rows.length && rows.length > 0}
                                    onChange={toggleAll}
                                />
                            </th>
                            {COLUMNS.map((col) => (
                                <th
                                    key={col.key}
                                    onClick={() => handleSort(col.key)}
                                    style={{ cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" }}
                                >
                                    {col.label}
                                    <SortIcon dir={sortKey === col.key ? sortDir : null} />
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={COLUMNS.length + 1} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                                    검색 결과가 없습니다
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr
                                    key={row.id}
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                        if (e.target.type === "checkbox") return;
                                        onSelectProduct?.(row);
                                    }}
                                >
                                    <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(row.id)}
                                            onChange={() => toggleRow(row.id)}
                                        />
                                    </td>
                                    <td><PlatformChip name={row.platform} /></td>
                                    <td style={{ fontWeight: 500 }}>{row.name}</td>
                                    <td style={{ color: "var(--text-secondary)" }}>{row.source}</td>
                                    <td>{row.supplyPrice.toLocaleString()}원</td>
                                    <td style={{ fontWeight: 600 }}>{row.salePrice.toLocaleString()}원</td>
                                    <td>
                                            <span style={{
                                                color: row.shipping === "무료" ? "var(--success)" : "var(--text-primary)",
                                                fontWeight: row.shipping === "무료" ? 600 : 400,
                                            }}>
                                                {row.shipping}
                                            </span>
                                    </td>
                                    <td>
                                            <span style={{
                                                color: row.extraShipping === "없음" ? "var(--text-muted)" : "var(--text-primary)",
                                            }}>
                                                {row.extraShipping}
                                            </span>
                                    </td>
                                    <td style={{
                                        fontWeight: 700,
                                        color: row.netProfit >= 0 ? "var(--success)" : "var(--danger)",
                                    }}>
                                        {row.netProfit.toLocaleString()}원
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 테이블 푸터 */}
                <div style={{
                    padding: "12px 20px",
                    borderTop: "1px solid var(--border)",
                    fontSize: 13,
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <span>전체 {rows.length}개</span>
                    <span>{selected.length > 0 && `${selected.length}개 선택됨`}</span>
                </div>
            </div>
        </div>
    );
}
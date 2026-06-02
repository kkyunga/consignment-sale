import { useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

/* ── Sample data ── */
const salesTrend = [
    { label: "7월", value: 65000 },
    { label: "8월", value: 82000 },
    { label: "9월", value: 74000 },
    { label: "10월", value: 98000 },
    { label: "11월", value: 61000 },
    { label: "12월", value: 63000 },
];

const platformData = [
    { name: "쿠팡", value: 48 },
    { name: "지마켓", value: 31 },
    { name: "네이버", value: 21 },
];

const categoryData = [
    { name: "의류", value: 35 },
    { name: "식품", value: 25 },
    { name: "전자기기", value: 22 },
    { name: "기타", value: 18 },
];

const quarterData = [
    { name: "1분기", value: 30 },
    { name: "2분기", value: 28 },
    { name: "3분기", value: 25 },
    { name: "4분기", value: 17 },
];

const COLORS = ["#4f7df3", "#f97316", "#10b981", "#a78bfa", "#f59e0b"];

const cerTable = [
    { platform: "쿠팡", product: "콜라 (10개)", price: "16,000", buyer: "김경아", status: "교환" },
    { platform: "지마켓", product: "우유 (2L)", price: "4,500", buyer: "이민수", status: "반품" },
    { platform: "네이버", product: "물티슈 (100매)", price: "8,900", buyer: "박지혜", status: "취소" },
    { platform: "쿠팡", product: "과자 세트", price: "22,000", buyer: "최태양", status: "교환" },
];

/* ── Sub-components ── */
function DonutChart({ data, title }) {
    return (
        <div className="card">
            <div className="section-label">{title}</div>
            <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={3}
                        dataKey="value"
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(v) => `${v}%`}
                        contentStyle={{ borderRadius: 8, fontSize: 12 }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="donut-label-list">
                {data.map((item, i) => (
                    <div key={i} className="donut-label-item">
                        <div style={{ display: "flex", alignItems: "center" }}>
              <span
                  className="donut-label-dot"
                  style={{ background: COLORS[i % COLORS.length] }}
              />
                            {item.name}
                        </div>
                        <span style={{ fontWeight: 600 }}>{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── Dashboard ── */
export default function Dashboard() {
    const [period, setPeriod] = useState("월");
    const [cerPeriod, setCerPeriod] = useState("월");

    const periodOptions = ["일", "주", "월", "년"];

    const statusClass = {
        교환: "exchange",
        반품: "return",
        취소: "cancel",
    };

    const cerCounts = {
        취소: cerTable.filter((r) => r.status === "취소").length,
        교환: cerTable.filter((r) => r.status === "교환").length,
        반품: cerTable.filter((r) => r.status === "반품").length,
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-title">대시보드</div>
                <div className="page-subtitle">오늘의 판매 현황을 한눈에 확인하세요</div>
            </div>

            {/* ─── Stat cards ─── */}
            <div className="stat-grid">
                {[
                    { label: "금일 매출액", value: "1,284,000", unit: "원", badge: "▲ 12.4%" },
                    { label: "총 주문수", value: "37", unit: "건", badge: "▲ 5건" },
                    { label: "순수익", value: "386,200", unit: "원", badge: "▲ 8.1%" },
                    { label: "미처리 주문", value: "4", unit: "건", badge: "⚠ 확인 필요" },
                ].map((s) => (
                    <div className="stat-card" key={s.label}>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-value">
                            {s.value}
                            <span className="stat-unit">{s.unit}</span>
                        </div>
                        <div
                            className="stat-badge"
                            style={{
                                color: s.label === "미처리 주문" ? "var(--warning)" : "var(--success)",
                            }}
                        >
                            {s.badge}
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── Sales Trend ─── */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 20,
                    }}
                >
                    <div className="section-label" style={{ margin: 0 }}>매출 추이</div>
                    <div className="filter-tabs">
                        {periodOptions.map((p) => (
                            <button
                                key={p}
                                className={`filter-tab ${period === p ? "active" : ""}`}
                                onClick={() => setPeriod(p)}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={salesTrend} margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e9f2" />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 12, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            formatter={(v) => [`${v.toLocaleString()}원`, "매출"]}
                            contentStyle={{ borderRadius: 10, fontSize: 13, border: "1px solid #e5e9f2" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#4f7df3"
                            strokeWidth={2.5}
                            dot={{ fill: "#4f7df3", r: 4, strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* ─── Donut charts ─── */}
            <div className="charts-grid">
                <DonutChart data={platformData} title="플랫폼별 매출" />
                <DonutChart data={categoryData} title="카테고리별 매출" />
                <DonutChart data={quarterData} title="분기별 매출" />
            </div>

            {/* ─── CER section ─── */}
            <div className="card">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 16,
                    }}
                >
                    <div className="section-label" style={{ margin: 0 }}>취소 / 교환 / 반품 추이</div>
                    <div className="filter-tabs">
                        {periodOptions.map((p) => (
                            <button
                                key={p}
                                className={`filter-tab ${cerPeriod === p ? "active" : ""}`}
                                onClick={() => setCerPeriod(p)}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="cer-stats">
                    {["취소", "교환", "반품"].map((label) => (
                        <div className="cer-stat" key={label}>
                            <div className="cer-stat-label">{label}</div>
                            <div className="cer-stat-value">
                                {cerCounts[label]}
                                <span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-secondary)", marginLeft: 2 }}>건</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>플랫폼</th>
                            <th>상품명 (옵션)</th>
                            <th>금액</th>
                            <th>상태</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cerTable.map((row, i) => (
                            <tr key={i}>
                                <td>
                                    <span className="platform-chip">{row.platform}</span>
                                </td>
                                <td>{row.product}</td>
                                <td style={{ fontWeight: 600 }}>{row.price}원</td>
                                <td>
                    <span className={`status-badge ${statusClass[row.status]}`}>
                      {row.status}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
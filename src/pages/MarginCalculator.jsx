import { useState, useRef } from "react";

function Field({ label, name, unit, placeholder, refs }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
                {label}
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                    ref={(el) => { refs.current[name] = el; }}
                    type="number"
                    placeholder={placeholder ?? "0"}
                    style={{ flex: 1, width: "100%" }}
                />
                {unit && (
                    <span style={{ fontSize: 13, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{unit}</span>
                )}
            </div>
        </div>
    );
}

function ResultRow({ label, value, highlight }) {
    return (
        <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "9px 0", borderBottom: "1px solid var(--border)",
        }}>
            <span style={{ fontSize: 13, color: highlight ? "var(--accent)" : "var(--text-secondary)", fontWeight: highlight ? 700 : 400 }}>
                {label}
            </span>
            <span style={{ fontSize: 13, fontWeight: highlight ? 700 : 600, color: highlight ? "var(--accent)" : "var(--text-primary)" }}>
                {value}
            </span>
        </div>
    );
}

export default function CalculatorPage() {
    const refs = useRef({});
    const [priceResult, setPriceResult] = useState(null);
    const [marginResult, setMarginResult] = useState(null);

    const v = (k) => parseFloat(refs.current[k]?.value) || 0;

    const calcPrice = () => {
        const cost = v("cost"), shipping = v("shipping"), fee = v("fee");
        const ad = v("ad"), etc = v("etc"), vat = v("vat"), target = v("targetMargin");
        const divisor = 1 - fee / 100 - vat / 100 - target / 100;
        if (divisor <= 0) {
            setPriceResult({ error: "수수료 + 부가세 + 목표마진율 합이 100%를 초과합니다." });
            return;
        }
        const price = (cost + shipping + ad + etc) / divisor;
        const feeAmt = price * (fee / 100);
        const vatAmt = price * (vat / 100);
        const totalCost = cost + shipping + ad + etc + feeAmt + vatAmt;
        setPriceResult({ price: Math.ceil(price), feeAmt, vatAmt, totalCost, profit: price - totalCost, target });
    };

    const calcMargin = () => {
        const cost = v("cost"), shipping = v("shipping"), price = v("price");
        const fee = v("fee"), ad = v("ad"), etc = v("etc"), vat = v("vat");
        const feeAmt = price * (fee / 100);
        const vatAmt = price * (vat / 100);
        const totalCost = cost + shipping + ad + etc + feeAmt + vatAmt;
        const profit = price - totalCost;
        setMarginResult({
            feeAmt, vatAmt, totalCost, profit, breakEven: totalCost,
            margin: price > 0 ? (profit / price) * 100 : 0,
            roi:    cost  > 0 ? (profit / cost)  * 100 : 0,
        });
    };

    const reset = () => {
        Object.values(refs.current).forEach((el) => { if (el) el.value = ""; });
        setPriceResult(null);
        setMarginResult(null);
    };

    return (
        <div>
            <div className="page-header">
                <div className="page-title">계산기</div>
                <div className="page-subtitle">판매가와 마진을 손쉽게 계산하세요</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr 1fr", gap: 20, alignItems: "start" }}>

                {/* ── 입력 카드 ── */}
                <div className="card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div className="section-label">정보 입력</div>

                    <Field label="상품 원가"    name="cost"         unit="원" refs={refs} />
                    <Field label="배송비"        name="shipping"     unit="원" refs={refs} />
                    <Field label="판매가"        name="price"        unit="원" refs={refs} placeholder="마진 계산 시 입력" />
                    <Field label="플랫폼 수수료" name="fee"          unit="%" refs={refs} />
                    <Field label="기타 비용"     name="etc"          unit="원" refs={refs} />
                    <Field label="부가세"        name="vat"          unit="%" refs={refs} />
                    <Field label="목표 마진율"   name="targetMargin" unit="%" refs={refs} placeholder="판매가 계산 시 입력" />

                    <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
                        <button className="btn btn-primary" style={{ width: "100%" }} onClick={calcPrice}>
                            판매가 계산
                        </button>
                        <button
                            className="btn"
                            style={{ width: "100%", background: "var(--success)", color: "#fff", border: "none", fontFamily: "inherit", fontWeight: 600, fontSize: 13 }}
                            onClick={calcMargin}
                        >
                            마진 계산
                        </button>
                        <button className="btn btn-secondary" style={{ width: "100%" }} onClick={reset}>
                            초기화
                        </button>
                    </div>
                </div>

                {/* ── 판매가 결과 ── */}
                <div className="card">
                    <div className="section-label">판매가 계산 결과</div>
                    {!priceResult ? (
                        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: 13, lineHeight: 1.8 }}>
                            원가·수수료·목표마진율 입력 후<br />판매가 계산 버튼을 누르세요.
                        </div>
                    ) : priceResult.error ? (
                        <div style={{ padding: 14, background: "#fef2f2", borderRadius: 8, color: "var(--danger)", fontSize: 13 }}>
                            {priceResult.error}
                        </div>
                    ) : (
                        <>
                            <div style={{
                                background: "var(--accent)", color: "#fff",
                                borderRadius: 10, padding: 20, textAlign: "center", marginBottom: 20,
                            }}>
                                <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>
                                    목표 마진율 {priceResult.target}% 기준 권장 판매가
                                </div>
                                <div style={{ fontSize: 26, fontWeight: 700 }}>
                                    {priceResult.price.toLocaleString()}원
                                </div>
                            </div>
                            <ResultRow label="플랫폼 수수료" value={`${Math.round(priceResult.feeAmt).toLocaleString()}원`} />
                            <ResultRow label="부가세"         value={`${Math.round(priceResult.vatAmt).toLocaleString()}원`} />
                            <ResultRow label="총비용"         value={`${Math.round(priceResult.totalCost).toLocaleString()}원`} />
                            <ResultRow label="예상 순이익"    value={`${Math.round(priceResult.profit).toLocaleString()}원`} highlight />
                        </>
                    )}
                </div>

                {/* ── 마진 결과 ── */}
                <div className="card">
                    <div className="section-label">마진 계산 결과</div>
                    {!marginResult ? (
                        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: 13, lineHeight: 1.8 }}>
                            판매가 포함 정보 입력 후<br />마진 계산 버튼을 누르세요.
                        </div>
                    ) : (
                        <>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                                {[
                                    { label: "마진율", value: `${marginResult.margin.toFixed(2)}%`, color: marginResult.margin >= 0 ? "var(--success)" : "var(--danger)" },
                                    { label: "ROI",    value: `${marginResult.roi.toFixed(2)}%`,    color: marginResult.roi    >= 0 ? "var(--accent)" : "var(--danger)" },
                                ].map((item) => (
                                    <div key={item.label} style={{ background: "var(--bg)", borderRadius: 10, padding: 14, textAlign: "center" }}>
                                        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, marginBottom: 6 }}>{item.label}</div>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: item.color }}>{item.value}</div>
                                    </div>
                                ))}
                            </div>
                            <ResultRow label="플랫폼 수수료"  value={`${Math.round(marginResult.feeAmt).toLocaleString()}원`} />
                            <ResultRow label="부가세"          value={`${Math.round(marginResult.vatAmt).toLocaleString()}원`} />
                            <ResultRow label="총비용"          value={`${Math.round(marginResult.totalCost).toLocaleString()}원`} />
                            <ResultRow label="손익분기 판매가" value={`${Math.round(marginResult.breakEven).toLocaleString()}원`} />
                            <div style={{ paddingTop: 8 }}>
                                <div style={{
                                    background: marginResult.profit >= 0 ? "#ecfdf5" : "#fef2f2",
                                    borderRadius: 8, padding: "12px 16px",
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: marginResult.profit >= 0 ? "var(--success)" : "var(--danger)" }}>순이익</span>
                                    <span style={{ fontSize: 16, fontWeight: 700, color: marginResult.profit >= 0 ? "var(--success)" : "var(--danger)" }}>
                                        {Math.round(marginResult.profit).toLocaleString()}원
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

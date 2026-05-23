import { useState } from "react";

/* ── 샘플 상세 데이터 ── */
const DETAIL_SAMPLE = {
    platform: "네이버",
    name: "사과 5kg 유기농",
    source: "화과농원",
    supplyPrice: 10000,
    salePrice: 20000,
    hasOption: true,
    options: [
        { title: "사이즈", items: ["소", "중", "대"] },
    ],
    shippingType: "paid",    // free | paid | conditional
    shippingCost: 3000,
    condMinAmount: 30000,
    condShippingCost: 5000,
    hasExtraShipping: true,
    extraAreas: [
        { name: "제주도", zipFrom: "63000", zipTo: "63999", cost: 5000 },
    ],
    images: ["IMG 1", "IMG 2", "IMG 3"],
    detailPageUrl: "https://example.com/detail",
};

const SHIPPING_LABEL = { free: "무료", paid: "유료", conditional: "조건부유료" };

/* ── 읽기 전용 행 ── */
function DetailRow({ label, children }) {
    return (
        <div style={{ display: "flex", gap: 16, marginBottom: 18, alignItems: "flex-start" }}>
            <span style={{
                minWidth: 100, fontSize: 13, fontWeight: 600,
                color: "var(--text-secondary)", paddingTop: 2,
            }}>
                {label}
            </span>
            <div style={{ flex: 1, fontSize: 14, color: "var(--text-primary)" }}>
                {children}
            </div>
        </div>
    );
}

/* ── 이미지 썸네일 ── */
function ImageThumb({ label, isMain }) {
    return (
        <div style={{
            width: 80, height: 80,
            border: `2px solid ${isMain ? "var(--accent)" : "var(--border)"}`,
            borderRadius: "var(--radius-sm)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: isMain ? "var(--accent-light)" : "var(--bg)",
            fontSize: 11, color: isMain ? "var(--accent)" : "var(--text-muted)",
            gap: 4, position: "relative",
        }}>
            <span style={{ fontSize: 24 }}>🖼</span>
            <span>{label}</span>
            {isMain && (
                <span style={{
                    position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                    background: "var(--accent)", color: "#fff",
                    fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 100,
                    whiteSpace: "nowrap",
                }}>
                    대표
                </span>
            )}
        </div>
    );
}

export default function ProductDetail({ product, onBack }) {
    /* product prop이 없으면 샘플 사용 */
    const data = product ?? DETAIL_SAMPLE;

    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData]     = useState(data);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = () => {
        alert("상품이 삭제되었습니다.");
        setShowDeleteConfirm(false);
        onBack?.();
    };

    const handleSave = () => {
        setIsEditMode(false);
        alert("수정이 저장되었습니다.");
    };

    const d = isEditMode ? editData : data;

    return (
        <div>
            {/* 페이지 헤더 */}
            <div className="page-header" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                    className="btn btn-secondary"
                    style={{ padding: "7px 12px", fontSize: 12 }}
                    onClick={onBack}
                >
                    ← 목록
                </button>
                <div>
                    <div className="page-title">상품 상세</div>
                    <div className="page-subtitle">등록된 상품 정보를 확인하고 수정하세요</div>
                </div>
            </div>

            {/* 삭제 확인 모달 */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ width: 320 }}>
                        <div className="modal-title" style={{ color: "var(--danger)" }}>⚠ 상품 삭제</div>
                        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>
                            <strong>{d.name}</strong> 상품을 삭제하시겠습니까?<br />
                            이 작업은 되돌릴 수 없습니다.
                        </p>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>취소</button>
                            <button
                                className="btn btn-primary"
                                style={{ background: "var(--danger)" }}
                                onClick={handleDelete}
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="card" style={{
                border: isEditMode ? "2px solid var(--accent)" : "1px solid var(--border)",
                transition: "border .2s",
            }}>
                {/* ── 상단 버튼 ── */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 24 }}>
                    {isEditMode ? (
                        <>
                            <button className="btn btn-secondary" onClick={() => setIsEditMode(false)}>취소</button>
                            <button className="btn btn-primary" onClick={handleSave}>저장</button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-secondary" onClick={onBack}>취소</button>
                            <button
                                className="btn btn-secondary"
                                style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                삭제
                            </button>
                            <button className="btn btn-primary" onClick={() => setIsEditMode(true)}>수정</button>
                        </>
                    )}
                </div>

                {/* ── 기본 정보 ── */}
                <div style={{ marginBottom: 24 }}>
                    <div className="section-label">기본 정보</div>

                    <DetailRow label="플랫폼명">
                        {isEditMode ? (
                            <input type="text" value={editData.platform}
                                   onChange={(e) => setEditData({ ...editData, platform: e.target.value })}
                                   style={{ width: 280 }} />
                        ) : (
                            <span style={{
                                display: "inline-block", padding: "3px 12px", borderRadius: 100,
                                background: "#e6f4ff", color: "#0958d9", fontWeight: 600, fontSize: 13,
                            }}>
                                {d.platform}
                            </span>
                        )}
                    </DetailRow>

                    <DetailRow label="상품명">
                        {isEditMode ? (
                            <input type="text" value={editData.name}
                                   onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                   style={{ width: 320 }} />
                        ) : (
                            <strong>{d.name}</strong>
                        )}
                    </DetailRow>

                    <DetailRow label="출처 (링처)">
                        {isEditMode ? (
                            <input type="text" value={editData.source}
                                   onChange={(e) => setEditData({ ...editData, source: e.target.value })}
                                   style={{ width: 280 }} />
                        ) : (
                            <span style={{ color: "var(--text-secondary)" }}>{d.source}</span>
                        )}
                    </DetailRow>

                    <DetailRow label="매입가 / 판매가">
                        {isEditMode ? (
                            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                                <input type="number" value={editData.supplyPrice}
                                       onChange={(e) => setEditData({ ...editData, supplyPrice: Number(e.target.value) })}
                                       style={{ width: 120 }} />
                                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>원</span>
                                <span style={{ color: "var(--text-muted)" }}>→</span>
                                <input type="number" value={editData.salePrice}
                                       onChange={(e) => setEditData({ ...editData, salePrice: Number(e.target.value) })}
                                       style={{ width: 120 }} />
                                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>원</span>
                            </div>
                        ) : (
                            <div style={{ display: "flex", gap: 20 }}>
                                <span><span style={{ color: "var(--text-muted)", marginRight: 6 }}>매입</span><strong>{d.supplyPrice.toLocaleString()}원</strong></span>
                                <span style={{ color: "var(--text-muted)" }}>→</span>
                                <span><span style={{ color: "var(--text-muted)", marginRight: 6 }}>판매</span><strong style={{ color: "var(--accent)" }}>{d.salePrice.toLocaleString()}원</strong></span>
                            </div>
                        )}
                    </DetailRow>
                </div>

                <hr className="divider" />

                {/* ── 옵션 ── */}
                <div style={{ marginBottom: 24 }}>
                    <div className="section-label">옵션</div>
                    <DetailRow label="옵션 여부">
                        <span style={{
                            display: "inline-block", padding: "3px 12px", borderRadius: 100,
                            background: d.hasOption ? "#ecfdf5" : "#f3f4f6",
                            color: d.hasOption ? "var(--success)" : "var(--text-muted)",
                            fontWeight: 600, fontSize: 13,
                        }}>
                            {d.hasOption ? "있음" : "없음"}
                        </span>
                    </DetailRow>

                    {d.hasOption && d.options?.map((opt, i) => (
                        <DetailRow key={i} label={`옵션 ${i + 1}`}>
                            <div style={{
                                background: "var(--bg)", borderRadius: "var(--radius-sm)",
                                padding: "10px 14px", display: "inline-block",
                            }}>
                                <span style={{ fontWeight: 600, marginRight: 8 }}>{opt.title}</span>
                                {opt.items.map((item, j) => (
                                    <span key={j} style={{
                                        display: "inline-block", margin: "2px 4px",
                                        padding: "2px 10px", borderRadius: 100,
                                        background: "var(--surface)", border: "1px solid var(--border)",
                                        fontSize: 12,
                                    }}>
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </DetailRow>
                    ))}
                </div>

                <hr className="divider" />

                {/* ── 배송비 ── */}
                <div style={{ marginBottom: 24 }}>
                    <div className="section-label">배송 정보</div>

                    <DetailRow label="배송비 여부">
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                            <span style={{
                                display: "inline-block", padding: "3px 12px", borderRadius: 100,
                                background: d.shippingType === "free" ? "#ecfdf5" : "#fff7ed",
                                color: d.shippingType === "free" ? "var(--success)" : "var(--accent2)",
                                fontWeight: 600, fontSize: 13,
                            }}>
                                {SHIPPING_LABEL[d.shippingType]}
                            </span>
                            {d.shippingType === "paid" && (
                                <span style={{ fontSize: 14 }}>배송비 <strong>{d.shippingCost.toLocaleString()}원</strong></span>
                            )}
                            {d.shippingType === "conditional" && (
                                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                                    {d.condMinAmount.toLocaleString()}원 미만 시 <strong>{d.condShippingCost.toLocaleString()}원</strong>
                                </span>
                            )}
                        </div>
                    </DetailRow>

                    <DetailRow label="추가배송비">
                        <span style={{
                            display: "inline-block", padding: "3px 12px", borderRadius: 100,
                            background: d.hasExtraShipping ? "#fff7ed" : "#f3f4f6",
                            color: d.hasExtraShipping ? "var(--accent2)" : "var(--text-muted)",
                            fontWeight: 600, fontSize: 13,
                        }}>
                            {d.hasExtraShipping ? "있음" : "없음"}
                        </span>

                        {d.hasExtraShipping && d.extraAreas?.map((area, i) => (
                            <div key={i} style={{
                                marginTop: 8, padding: "8px 14px", background: "var(--bg)",
                                borderRadius: "var(--radius-sm)", fontSize: 13,
                                display: "inline-flex", gap: 14, alignItems: "center",
                            }}>
                                <span>📍 {area.name}</span>
                                <span style={{ color: "var(--text-muted)" }}>{area.zipFrom} ~ {area.zipTo}</span>
                                <strong>{area.cost.toLocaleString()}원</strong>
                            </div>
                        ))}
                    </DetailRow>
                </div>

                <hr className="divider" />

                {/* ── 이미지 ── */}
                <div style={{ marginBottom: 24 }}>
                    <div className="section-label">이미지</div>
                    <DetailRow label="상품 이미지">
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}>
                            {d.images?.map((img, i) => (
                                <ImageThumb key={i} label={img} isMain={i === 0} />
                            ))}
                            <div style={{
                                width: 80, height: 80,
                                border: "2px dashed var(--border)", borderRadius: "var(--radius-sm)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", color: "var(--text-muted)", fontSize: 24,
                            }}>
                                +
                            </div>
                        </div>
                    </DetailRow>

                    <DetailRow label="상세 페이지">
                        <button
                            className="btn btn-ghost"
                            onClick={() => window.open(d.detailPageUrl, "_blank")}
                            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                        >
                            보기 👁
                        </button>
                    </DetailRow>
                </div>
            </div>
        </div>
    );
}
import { useState } from "react";

/* ──────────────────────────────────────
   Platform Add Modal
────────────────────────────────────── */
function PlatformModal({ onClose, onAdd }) {
    const [form, setForm] = useState({ url: "", id: "", password: "", name: "" });
    const [message, setMessage] = useState(null); // { type: 'success'|'error', text }

    const handleAdd = () => {
        if (!form.url || !form.id || !form.password || !form.name) {
            setMessage({ type: "error", text: "모든 항목을 입력해 주세요." });
            return;
        }
        onAdd(form);
        setMessage({ type: "success", text: "플랫폼이 추가되었습니다." });
        setTimeout(() => {
            onClose();
        }, 800);
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-box">
                <div className="modal-title">
                    <span style={{ color: "var(--accent)" }}>⬡</span> 플랫폼 추가
                </div>

                <div className="modal-form">
                    {[
                        { label: "URL 주소", key: "url", type: "text", placeholder: "https://..." },
                        { label: "아이디", key: "id", type: "text", placeholder: "판매자 아이디" },
                        { label: "비밀번호", key: "password", type: "password", placeholder: "••••••••" },
                        { label: "플랫폼명", key: "name", type: "text", placeholder: "예: 쿠팡, 스마트스토어" },
                    ].map(({ label, key, type, placeholder }) => (
                        <div className="modal-field" key={key}>
                            <label>{label}</label>
                            <input
                                type={type}
                                placeholder={placeholder}
                                value={form[key]}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                style={{ width: "100%" }}
                            />
                        </div>
                    ))}
                </div>

                {message && (
                    <div className={`modal-message ${message.type}`}>{message.text}</div>
                )}

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>취소</button>
                    <button className="btn btn-primary" onClick={handleAdd}>추가</button>
                </div>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────
   Fee Tooltip
────────────────────────────────────── */
const FEE_INFO = {
    쿠팡: "로켓위탁: 판매가의 10.8%\n아이템윈: 판매가의 5.8%",
    "11번가": "일반: 판매가의 8%\n특가: 판매가의 12%",
    네이버: "스마트스토어: 판매가의 5.63%\n브랜드스토어: 판매가의 2%",
};

function InfoTooltip({ platform }) {
    const [show, setShow] = useState(false);
    return (
        <span
            className="tooltip-wrapper"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
      <span className="info-icon">i</span>
            {show && (
                <div className="tooltip-box" style={{ whiteSpace: "pre-line" }}>
                    <strong style={{ display: "block", marginBottom: 4 }}>{platform} 수수료 정보</strong>
                    {FEE_INFO[platform]}
                </div>
            )}
    </span>
    );
}

/* ──────────────────────────────────────
   Platform Tab Margin Panel
────────────────────────────────────── */
function PlatformMarginPanel({ platform, supplyPrice, salePrice }) {
    const feeRates = { 쿠팡: 0.108, "11번가": 0.08, 네이버: 0.0563, 지마켓: 0.1 };
    const vatRate = 10;

    const fee = Math.round((salePrice || 0) * (feeRates[platform] || 0.1));
    const margin = (salePrice || 0) - (supplyPrice || 0) - fee;
    const marginRate = salePrice ? ((margin / salePrice) * 100).toFixed(1) : 0;
    const vat = Math.round((salePrice || 0) * (vatRate / 100));
    const netProfit = margin - vat;

    return (
        <div className="form-grid">
            <div className="form-row">
                <label className="form-label">마진</label>
                <div className="form-control">
                    <input
                        type="number"
                        className="md"
                        value={margin || ""}
                        readOnly
                        style={{ background: "var(--bg)", fontWeight: 600 }}
                    />
                    <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>원</span>
                    <span style={{ marginLeft: 24, color: "var(--text-secondary)", fontSize: 13 }}>마진율</span>
                    <input
                        type="number"
                        className="sm"
                        value={marginRate || ""}
                        readOnly
                        style={{ background: "var(--bg)", fontWeight: 600, marginLeft: 8 }}
                    />
                    <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>%</span>
                </div>
            </div>

            <div className="form-row">
                <label className="form-label">부가세</label>
                <div className="form-control">
                    <input
                        type="number"
                        className="sm"
                        defaultValue={vatRate}
                        style={{ width: 70 }}
                    />
                    <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>%</span>
                    <span style={{ color: "var(--text-muted)", margin: "0 4px" }}>(</span>
                    <input
                        type="number"
                        className="md"
                        value={vat || ""}
                        readOnly
                        style={{ background: "var(--bg)" }}
                    />
                    <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>원</span>
                    <span style={{ color: "var(--text-muted)" }}>)</span>
                </div>
            </div>

            <div className="form-row">
                <label className="form-label" style={{ fontWeight: 700, color: "var(--accent)" }}>
                    순이익
                </label>
                <div className="form-control">
                    <input
                        type="number"
                        style={{
                            width: 240,
                            background: "var(--accent-light)",
                            fontWeight: 700,
                            fontSize: 15,
                            color: netProfit >= 0 ? "var(--success)" : "var(--danger)",
                        }}
                        value={netProfit || ""}
                        readOnly
                    />
                    <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>원</span>
                </div>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────
   Product Form (Main)
────────────────────────────────────── */
const PLATFORMS_DEFAULT = ["쿠팡", "11번가", "네이버"];

export default function ProductForm() {
    const [showModal, setShowModal] = useState(false);
    const [platforms, setPlatforms] = useState(PLATFORMS_DEFAULT);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);

    // Product fields
    const [productName, setProductName] = useState("");
    const [source, setSource] = useState("");

    // Options
    const [hasOption, setHasOption] = useState(false);
    const [optionTitle, setOptionTitle] = useState("");
    const [optionItems, setOptionItems] = useState([{ content: "" }]);

    // Pricing
    const [supplyPrice, setSupplyPrice] = useState("");
    const [salePrice, setSalePrice] = useState("");

    // Shipping
    const [shippingType, setShippingType] = useState("free"); // free | paid | conditional
    const [shippingCost, setShippingCost] = useState("");
    const [minOrderAmount, setMinOrderAmount] = useState("");
    const [condShippingCost, setCondShippingCost] = useState("");

    // Remote area
    const [hasRemote, setHasRemote] = useState(false);
    const [remoteAreas, setRemoteAreas] = useState([{ name: "", zipFrom: "", zipTo: "", cost: "" }]);

    // Platform tabs
    const [activeTab, setActiveTab] = useState("쿠팡");
    const platformTabs = ["쿠팡", "11번가", "지마켓"];

    /* handlers */
    const handlePlatformToggle = (p) => {
        setSelectedPlatforms((prev) =>
            prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
        );
    };

    const handleAddPlatform = (form) => {
        if (!platforms.includes(form.name)) {
            setPlatforms((prev) => [...prev, form.name]);
        }
    };

    const addOptionItem = () => setOptionItems((prev) => [...prev, { content: "" }]);
    const updateOptionItem = (i, val) => {
        setOptionItems((prev) => prev.map((item, idx) => (idx === i ? { content: val } : item)));
    };
    const removeOptionItem = (i) => setOptionItems((prev) => prev.filter((_, idx) => idx !== i));

    const addRemoteArea = () =>
        setRemoteAreas((prev) => [...prev, { name: "", zipFrom: "", zipTo: "", cost: "" }]);
    const updateRemoteArea = (i, key, val) => {
        setRemoteAreas((prev) =>
            prev.map((item, idx) => (idx === i ? { ...item, [key]: val } : item))
        );
    };

    const handleSave = () => {
        alert("상품이 저장되었습니다.");
    };

    return (
        <div>
            {showModal && (
                <PlatformModal
                    onClose={() => setShowModal(false)}
                    onAdd={handleAddPlatform}
                />
            )}

            <div className="page-header">
                <div className="page-title">상품 추가</div>
                <div className="page-subtitle">판매할 상품 정보를 입력하세요</div>
            </div>

            <div className="card">
                {/* ── Platform select ── */}
                <div className="form-section">
                    <div className="section-label">플랫폼 선택</div>
                    <div className="form-row" style={{ alignItems: "center" }}>
                        <div className="form-control" style={{ gap: 16 }}>
                            <div className="checkbox-group">
                                {platforms.map((p) => (
                                    <label className="checkbox-label" key={p}>
                                        <input
                                            type="checkbox"
                                            checked={selectedPlatforms.includes(p)}
                                            onChange={() => handlePlatformToggle(p)}
                                        />
                                        {p}
                                        {PLATFORMS_DEFAULT.includes(p) && <InfoTooltip platform={p} />}
                                    </label>
                                ))}
                            </div>
                            <button
                                className="btn btn-ghost"
                                style={{ marginLeft: "auto" }}
                                onClick={() => setShowModal(true)}
                            >
                                ＋ 플랫폼 추가
                            </button>
                        </div>
                    </div>
                </div>

                <hr className="divider" />

                {/* ── Product name ── */}
                <div className="form-section">
                    <div className="section-label">기본 정보</div>
                    <div className="form-grid">
                        <div className="form-row">
                            <label className="form-label">상품명</label>
                            <div className="form-control">
                                <input
                                    type="text"
                                    className="lg"
                                    placeholder="상품명을 입력하세요"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    style={{ width: 320 }}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <label className="form-label">출처 (링처)</label>
                            <div className="form-control">
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    style={{ width: 320 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="divider" />

                {/* ── Options ── */}
                <div className="form-section">
                    <div className="section-label">옵션</div>
                    <div className="form-row">
                        <label className="form-label">옵션 여부</label>
                        <div className="form-control">
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        checked={hasOption}
                                        onChange={() => setHasOption(true)}
                                    />
                                    있음
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        checked={!hasOption}
                                        onChange={() => setHasOption(false)}
                                    />
                                    없음
                                </label>
                            </div>
                        </div>
                    </div>

                    {hasOption && (
                        <div className="sub-section">
                            <div
                                style={{
                                    fontSize: 12,
                                    color: "var(--accent)",
                                    marginBottom: 4,
                                    fontWeight: 600,
                                }}
                            >
                                제목 추가 (내용 1개 필수)
                            </div>

                            {/* Option title row */}
                            <div className="option-row">
                                <span style={{ fontSize: 12, color: "var(--text-secondary)", minWidth: 36 }}>제목</span>
                                <input
                                    type="text"
                                    className="sm"
                                    placeholder="색상, 사이즈..."
                                    value={optionTitle}
                                    onChange={(e) => setOptionTitle(e.target.value)}
                                />
                                <span style={{ fontSize: 12, color: "var(--text-secondary)", minWidth: 36, marginLeft: 12 }}>
                  내용
                </span>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                                    {optionItems.map((item, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <input
                                                type="text"
                                                className="md"
                                                placeholder={`내용 ${i + 1}`}
                                                value={item.content}
                                                onChange={(e) => updateOptionItem(i, e.target.value)}
                                            />
                                            {i > 0 && (
                                                <button
                                                    className="btn-icon sm"
                                                    style={{ background: "var(--danger)", fontSize: 16 }}
                                                    onClick={() => removeOptionItem(i)}
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="btn-icon sm"
                                    title="내용만 추가"
                                    onClick={addOptionItem}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <hr className="divider" />

                {/* ── Pricing ── */}
                <div className="form-section">
                    <div className="section-label">가격 정보</div>
                    <div className="form-grid">
                        <div className="form-row">
                            <label className="form-label">공급가</label>
                            <div className="form-control">
                                <input
                                    type="number"
                                    className="lg"
                                    placeholder="0"
                                    value={supplyPrice}
                                    onChange={(e) => setSupplyPrice(Number(e.target.value))}
                                />
                                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>원</span>
                            </div>
                        </div>
                        <div className="form-row">
                            <label className="form-label">판매가</label>
                            <div className="form-control">
                                <input
                                    type="number"
                                    className="lg"
                                    placeholder="0"
                                    value={salePrice}
                                    onChange={(e) => setSalePrice(Number(e.target.value))}
                                />
                                <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>원</span>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="divider" />

                {/* ── Shipping ── */}
                <div className="form-section">
                    <div className="section-label">배송비</div>
                    <div className="form-row" style={{ marginBottom: 12 }}>
                        <label className="form-label">배송 유형</label>
                        <div className="form-control">
                            <div className="radio-group">
                                {[["free", "무료"], ["paid", "유료"], ["conditional", "조건부유료"]].map(
                                    ([val, label]) => (
                                        <label className="radio-label" key={val}>
                                            <input
                                                type="radio"
                                                checked={shippingType === val}
                                                onChange={() => setShippingType(val)}
                                            />
                                            {label}
                                        </label>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {shippingType === "paid" && (
                        <div className="sub-section" style={{ marginLeft: 106 }}>
                            <div className="option-row">
                                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>비용</span>
                                <input
                                    type="number"
                                    className="sm"
                                    placeholder="0"
                                    value={shippingCost}
                                    onChange={(e) => setShippingCost(e.target.value)}
                                />
                                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>원</span>
                            </div>
                        </div>
                    )}

                    {shippingType === "conditional" && (
                        <div className="sub-section" style={{ marginLeft: 106 }}>
                            <div className="option-row">
                                <span style={{ fontSize: 12, color: "var(--text-secondary)", minWidth: 64 }}>최소금액</span>
                                <input
                                    type="number"
                                    className="sm"
                                    placeholder="30,000"
                                    value={minOrderAmount}
                                    onChange={(e) => setMinOrderAmount(e.target.value)}
                                />
                                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>원 미만 시</span>
                            </div>
                            <div className="option-row">
                                <span style={{ fontSize: 12, color: "var(--text-secondary)", minWidth: 64 }}>배송비</span>
                                <input
                                    type="number"
                                    className="sm"
                                    placeholder="3,000"
                                    value={condShippingCost}
                                    onChange={(e) => setCondShippingCost(e.target.value)}
                                />
                                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>원</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Remote area ── */}
                <div className="form-section">
                    <div className="form-row" style={{ marginBottom: 12 }}>
                        <label className="form-label">산간지역 배송비</label>
                        <div className="form-control">
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        checked={hasRemote}
                                        onChange={() => setHasRemote(true)}
                                    />
                                    있음
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        checked={!hasRemote}
                                        onChange={() => setHasRemote(false)}
                                    />
                                    없음
                                </label>
                                {hasRemote && (
                                    <button className="btn-icon sm" onClick={addRemoteArea}>+</button>
                                )}
                            </div>
                        </div>
                    </div>

                    {hasRemote && (
                        <div className="sub-section" style={{ marginLeft: 106 }}>
                            {remoteAreas.map((area, i) => (
                                <div className="option-row" key={i} style={{ gap: 8, flexWrap: "wrap" }}>
                                    <span style={{ fontSize: 12, color: "var(--text-secondary)", minWidth: 36 }}>지역명</span>
                                    <input
                                        type="text"
                                        className="sm"
                                        placeholder="제주도"
                                        value={area.name}
                                        onChange={(e) => updateRemoteArea(i, "name", e.target.value)}
                                    />
                                    <span style={{ fontSize: 12, color: "var(--text-secondary)", minWidth: 40 }}>우편번호</span>
                                    <input
                                        type="text"
                                        style={{ width: 70 }}
                                        placeholder="63000"
                                        value={area.zipFrom}
                                        onChange={(e) => updateRemoteArea(i, "zipFrom", e.target.value)}
                                    />
                                    <span style={{ color: "var(--text-muted)" }}>~</span>
                                    <input
                                        type="text"
                                        style={{ width: 70 }}
                                        placeholder="63999"
                                        value={area.zipTo}
                                        onChange={(e) => updateRemoteArea(i, "zipTo", e.target.value)}
                                    />
                                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>비용</span>
                                    <input
                                        type="number"
                                        className="sm"
                                        placeholder="5000"
                                        value={area.cost}
                                        onChange={(e) => updateRemoteArea(i, "cost", e.target.value)}
                                    />
                                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>원</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <hr className="divider" />

                {/* ── Images ── */}
                <div className="form-section">
                    <div className="section-label">이미지</div>
                    <div className="form-row" style={{ marginBottom: 14 }}>
                        <label className="form-label">상품 이미지</label>
                        <div className="form-control">
                            <div className="image-upload-area">
                                {[...Array(4)].map((_, i) => (
                                    <div className="image-upload-box" key={i}>
                                        <span className="upload-icon">＋</span>
                                        <span>{i === 0 ? "대표" : `추가${i}`}</span>
                                    </div>
                                ))}
                            </div>
                            <span
                                style={{ fontSize: 11, color: "var(--text-muted)", alignSelf: "flex-end" }}
                            >
                대표 이미지 1개 필수
              </span>
                        </div>
                    </div>

                    <div className="form-row">
                        <label className="form-label">상세 페이지</label>
                        <div className="form-control">
                            <div className="image-upload-box" style={{ width: 120, height: 60 }}>
                                <span className="upload-icon" style={{ fontSize: 18 }}>＋</span>
                                <span>이미지 추가</span>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="divider" />

                {/* ── Platform margin tabs ── */}
                <div className="form-section">
                    <div className="section-label">플랫폼별 수익 계산</div>
                    <div className="platform-tabs">
                        {platformTabs.map((tab) => (
                            <button
                                key={tab}
                                className={`platform-tab-btn ${activeTab === tab ? "active" : ""}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <PlatformMarginPanel
                        platform={activeTab}
                        supplyPrice={supplyPrice}
                        salePrice={salePrice}
                    />
                </div>

                {/* ── Footer ── */}
                <div className="form-footer">
                    <button className="btn btn-secondary">취소</button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
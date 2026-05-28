import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { Store, ChevronLeft, Sparkles, TrendingUp, Megaphone, Users, Star, BadgeDollarSign, Settings2, FileUp, Keyboard, AlertTriangle } from "lucide-react";
import { NewResultReport } from "./NewResultReport";
import { ExistingResultReport } from "./ExistingResultReport";
import { DetailedStartupQuestionnaire } from "./DetailedStartupQuestionnaire";
import { SimpleResultReport } from "./SimpleResultReport";

/* ─────────────────────────────────────────
   데이터 정의
───────────────────────────────────────── */
const Q_WORK_ENV = [
    "손님들과 직접 대화하고 소통하며 생동감 있게 일하기 (접객 중심)",
    "대면은 적더라도 기술적인 완성도나 제품의 질에 집중하기 (제조/기술 중심)",
    "매장 시스템이 원활하게 돌아가도록 관리하고 유지하기 (운영/관리 중심)",
    "온라인 환경에서 비대면으로 소통하며 업무 처리하기 (온라인 중심)",
];

const Q_TIME_ENERGY = [
    "하루 12시간 이상 상주하며 모든 것을 직접 챙길 수 있습니다. (풀타임 올인)",
    "표준 근로 시간(8~10시간) 내에서 규칙적으로 일하고 싶습니다. (안정적 운영)",
    "본업이나 다른 일정이 있어 하루 몇 시간만 관리하고 싶습니다. (반자동/투잡)",
    "가끔씩 방문하여 점검하는 무인 형태를 희망합니다. (시스템 운영)",
];

const Q_BUDGET = [
    "3,000만 원 이하 (소자본/무점포 가능)",
    "3,000만 원 ~ 7,000만 원 (소규모 매장)",
    "7,000만 원 ~ 1억 5,000만 원 (일반적인 프랜차이즈/개인 매장)",
    "1억 5,000만 원 이상 (대형 매장/핵심 상권)",
];

const Q_PRIORITY = [
    "수익이 조금 적더라도 실패 확률이 낮은 검증된 아이템 (프랜차이즈/생필품)",
    "경쟁은 치열해도 내 브랜드만의 개성과 높은 수익을 목표 (개인 브랜드/트렌드 아이템)",
    "유행을 타지 않고 오랫동안 꾸준하게 운영 가능한 업종 (스테디셀러)",
];

const Q_AVOID = [
    "새벽이나 이른 아침 출근",
    "대면 스트레스 및 감정 노동",
    "뜨거운 불 앞이나 고된 육체 노동",
    "복잡한 식자재 발주 및 유통기한 관리",
    "필수적인 SNS 소통 및 트렌드 쫓기",
];

const BUSINESS_TYPES = [
    "음식점 (한식/양식/중식 등)",
    "카페/음료",
    "디저트/베이커리",
    "소매점 (편의점/의류 등)",
    "서비스업 (미용/피트니스 등)",
    "아직 모르겠어요",
];

const REGIONS = [
    "서울 강남구/서초구",
    "서울 마포구/용산구",
    "서울 성동구/광진구",
    "기타 서울 지역",
    "경기/인천 수도권",
    "그 외 지방",
];

const TARGET_CUSTOMERS_NEW = [
    "10대~20대 학생",
    "20대~30대 직장인",
    "40대~50대 중장년층",
    "가족 단위 고객",
    "특정 연령층 없음",
];

const AVG_PAYMENT = [
    "1만 원 미만 (가성비 중심)",
    "1만 원 ~ 2만 원 (평균적인 수준)",
    "2만 원 ~ 4만 원 (프리미엄 지향)",
    "4만 원 이상 (고급화 전략)",
];

// 기존 사장님 질문
const MONTHLY_REVENUE = [
    "500만 원 미만",
    "500만~1,000만 원",
    "1,000만~2,000만 원",
    "2,000만 원 이상",
];

const REVENUE_TRENDS = ["증가", "유지", "감소"];

const MENU_PRICE = [
    "1만 원 미만 (가성비 중심)",
    "1만 원 ~ 2만 원 (평균적인 수준)",
    "2만 원 ~ 4만 원 (프리미엄 지향)",
    "4만 원 이상 (고급화 전략)",
];

const SALES_CHANNEL = [
    "매장 판매 중심",
    "배달 비중이 더 큼",
    "매장판매와 배달이 균등",
    "온라인 판매 (스마트스토어 등)",
];

const WORKERS = ["1명", "2~3명", "4~5명", "6명 이상"];

const SEATS = ["10석 미만", "10~20석", "20~50석", "50석 이상"];

const RENT = ["100만 원 미만", "100~200만 원", "200~300만 원", "300만 원 이상"];

const PEAK_TIME = ["오전", "점심 시간", "저녁 시간", "늦은 밤"];

const PEAKTIME_WORK = ["어려움", "보통", "수월함"];

const REPEAT_RATE = [
    "거의 없음 (신규 고객 위주)",
    "30% 정도",
    "50% 이상",
    "단골 중심 매장",
];

const REPEAT_CYCLE = ["거의 없음", "가끔", "자주", "매우 자주"];

const CUSTOMER_POOL = ["학생", "가족", "혼합", "관광객"];

const MARKETING = [
    "거의 하지 않음",
    "SNS만 운영 (인스타그램, X 등)",
    "광고 진행 중 (배달앱/네이버 등)",
    "여러 채널 적극 활용",
];

const REVIEW_CONTROL = [
    "전혀 안함",
    "부정적 리뷰에만 대응",
    "긍정적/부정적 리뷰 모두 대응",
    "적극적으로 리뷰 관리 (리뷰 이벤트 등)",
];

const AVERAGE_ORDER_TREND = ["감소", "유지", "증가"];
const PROMOTION_FREQUENCY = ["거의 없음", "월1회", "주1회", "주2회 이상"];
const AD_EFFICIENCY = ["잘 모름", "낮음", "보통", "높음"];
const LOYALTY_PROGRAM = ["없음", "준비 중", "운영 중", "정기 캠페인 운영"];
const REVISIT_REASON_CLARITY = ["불명확", "보통", "명확", "매우 명확"];
const REVIEW_RESPONSE_SPEED = ["48시간 이상", "24~48시간", "12~24시간", "12시간 이내"];
const COMPLAINT_RESOLUTION = ["미흡", "보통", "신속", "매우 신속"];
const RATING_LEVEL = ["3.5 미만", "3.5~4.0", "4.0~4.5", "4.5 이상"];
const CS_MANUAL = ["없음", "기본 가이드 있음", "상황별 매뉴얼 있음", "주기적 업데이트"];
const PRICE_SATISFACTION = ["낮음", "보통", "높음", "매우 높음"];
const COMPETITOR_PRICE_POSITION = ["높음", "비슷함", "낮음", "차별화 가격전략"];
const BUNDLE_STRATEGY = ["없음", "단품위주", "세트운영", "상황별 번들 최적화"];
const COST_CONTROL = ["미흡", "보통", "양호", "매우 양호"];
const RENT_BURDEN = ["높음", "보통", "낮음", "매우 낮음"];
const OPERATION_STANDARDIZATION = ["없음", "일부만", "대부분", "체계적으로 운영"];
const COST_RATIO = ["30% 미만", "30~40%", "40~50%", "50% 이상"];
const LABOR_RATIO = ["15% 미만", "15~25%", "25~35%", "35% 이상"];
const TABLE_TURNOVER = ["낮음", "보통", "높음", "매우 높음"];
const DISCOUNT_DEPENDENCY = ["거의 없음", "낮음", "보통", "높음"];
const MENU_CONCENTRATION = ["분산형", "보통", "상위 3개 집중", "상위 1개 의존"];

const CURRENT_CHALLENGES = [
    "매출 정체",
    "마케팅/홍보",
    "인건비/재료비 관리",
    "배달/플랫폼 수수료",
    "직원 관리 문제",
    "경쟁 심화",
];

const EXISTING_CATEGORY_OPTIONS = [
    { label: "매출 성과", desc: "매출 흐름과 성장 모멘텀을 집중 진단합니다." },
    { label: "마케팅 역량", desc: "유입 채널, 홍보 효율, 전환 가능성을 분석합니다." },
    { label: "단골 확보", desc: "재방문율과 충성 고객 유지 전략을 점검합니다." },
    { label: "평판 관리", desc: "리뷰 대응과 고객 신뢰 관리 수준을 확인합니다." },
    { label: "가격 경쟁력", desc: "가격대 적합성과 객단가 경쟁력을 확인합니다." },
    { label: "운영 효율", desc: "인력/좌석/피크 대응 등 운영 효율을 진단합니다." },
];

type AnalysisMode = "light" | "deep";

type PosMetrics = {
    monthlyRevenue: string;
    monthlyOrders: string;
    averageTicket: string;
    peakSalesShare: string;
    dineInShare: string;
    deliveryShare: string;
    takeoutShare: string;
    topMenuShare: string;
    adBudget: string;
    conversionRate: string;
    repeatCustomerRate: string;
    reviewAverageScore: string;
    negativeReviewRatio: string;
    competitorPriceGap: string;
    bundleOrderRatio: string;
    laborCost: string;
    tableTurnoverRate: string;
};

const INITIAL_POS_METRICS: PosMetrics = {
    monthlyRevenue: "",
    monthlyOrders: "",
    averageTicket: "",
    peakSalesShare: "",
    dineInShare: "",
    deliveryShare: "",
    takeoutShare: "",
    topMenuShare: "",
    adBudget: "",
    conversionRate: "",
    repeatCustomerRate: "",
    reviewAverageScore: "",
    negativeReviewRatio: "",
    competitorPriceGap: "",
    bundleOrderRatio: "",
    laborCost: "",
    tableTurnoverRate: "",
};

const DEEP_CATEGORY_DATA_FIELDS: Record<string, Array<{ key: keyof PosMetrics; label: string }>> = {
    "매출 성과": [
        { key: "monthlyRevenue", label: "월 매출(원)" },
        { key: "monthlyOrders", label: "월 주문건수" },
        { key: "averageTicket", label: "객단가(원)" },
        { key: "peakSalesShare", label: "피크시간 매출 비중(%)" },
        { key: "dineInShare", label: "매장 비중(%)" },
        { key: "deliveryShare", label: "배달 비중(%)" },
        { key: "takeoutShare", label: "포장 비중(%)" },
        { key: "topMenuShare", label: "상위메뉴 매출 비중(%)" },
    ],
    "마케팅 역량": [
        { key: "adBudget", label: "월 광고비(원)" },
        { key: "conversionRate", label: "유입 대비 전환율(%)" },
    ],
    "단골 확보": [
        { key: "repeatCustomerRate", label: "재방문 고객 비중(%)" },
    ],
    "평판 관리": [
        { key: "reviewAverageScore", label: "평균 리뷰 평점" },
        { key: "negativeReviewRatio", label: "부정 리뷰 비중(%)" },
    ],
    "가격 경쟁력": [
        { key: "competitorPriceGap", label: "경쟁점 대비 가격 차이(%)" },
        { key: "bundleOrderRatio", label: "세트/번들 주문 비중(%)" },
    ],
    "운영 효율": [
        { key: "laborCost", label: "월 인건비(원)" },
        { key: "tableTurnoverRate", label: "평균 테이블 회전율(일)" },
    ],
};

const DEEP_CATEGORY_DUPLICATE_QUESTION_KEYS: Record<string, string[]> = {
    "매출 성과": ["revenue", "sales", "revenueTrend", "peak", "averageOrderTrend"],
    "마케팅 역량": ["marketing", "adEfficiency"],
    "단골 확보": ["repeat", "repeatCycle", "revisitReasonClarity"],
    "평판 관리": ["ratingLevel", "reviewResponseSpeed", "complaintResolution"],
    "가격 경쟁력": ["priceSatisfaction", "competitorPricePosition", "bundleStrategy"],
    "운영 효율": ["workers", "peakTimeWork"],
};

const EXISTING_CATEGORY_VISUALS: Record<string, { icon: React.ComponentType<{ style?: React.CSSProperties }>; tint: string }> = {
    "매출 성과": { icon: TrendingUp, tint: "rgba(16,185,129,0.22)" },
    "마케팅 역량": { icon: Megaphone, tint: "rgba(59,130,246,0.22)" },
    "단골 확보": { icon: Users, tint: "rgba(168,85,247,0.22)" },
    "평판 관리": { icon: Star, tint: "rgba(245,158,11,0.22)" },
    "가격 경쟁력": { icon: BadgeDollarSign, tint: "rgba(14,165,233,0.22)" },
    "운영 효율": { icon: Settings2, tint: "rgba(244,114,182,0.22)" },
};

const INITIAL_ADDRESS: AddressValue = {
    zonecode: "",
    addr: "",
    detail: "",
};

/* ─────────────────────────────────────────
   스타일 헬퍼
───────────────────────────────────────── */
const PAGE_BG: React.CSSProperties = {
    minHeight: "100vh",
    background: "#141720",
    color: "white",
    fontFamily: "'Noto Sans KR', sans-serif",
};

/* ─────────────────────────────────────────
   공통 헤더
───────────────────────────────────────── */
function TopBar({ onBack, label }: { onBack?: () => void; label?: string }) {
    return (
        <div className="flex items-center justify-between mb-6">
            {onBack ? (
                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 transition-all"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: "0.88rem" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                >
                    <ChevronLeft style={{ width: "16px", height: "16px" }} /> 이전으로
                </button>
            ) : <div />}
            {label && (
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.25)" }}>{label}</span>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────
   진행 바
───────────────────────────────────────── */
function ProgressBar({ current, total }: { current: number; total: number }) {
    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
                <div
                    className="h-1.5 rounded-full flex-1 mr-4 overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                >
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${(current / total) * 100}%`,
                            background: "linear-gradient(90deg,#10b981,#34d399)",
                        }}
                    />
                </div>
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>
          {current} / {total}
        </span>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   선택지 버튼
───────────────────────────────────────── */
function ChoiceButton({
                          label, selected, onClick,
                      }: { label: string; selected: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left transition-all active:scale-[0.98]"
            style={{
                padding: "18px 22px",
                borderRadius: "14px",
                border: selected
                    ? "1.5px solid #10b981"
                    : "1px solid rgba(255,255,255,0.1)",
                background: selected
                    ? "rgba(16,185,129,0.12)"
                    : "rgba(255,255,255,0.04)",
                color: selected ? "#34d399" : "rgba(255,255,255,0.65)",
                fontSize: "0.97rem",
                fontWeight: selected ? 600 : 400,
                cursor: "pointer",
                boxShadow: selected ? "0 0 0 1px rgba(16,185,129,0.3)" : "none",
            }}
            onMouseEnter={(e) => {
                if (!selected) {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                }
            }}
            onMouseLeave={(e) => {
                if (!selected) {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                }
            }}
        >
            {label}
        </button>
    );
}

/* ─────────────────────────────────────────
   설문 래퍼
───────────────────────────────────────── */
function QuestionStep({
                          step, total, question, options, selected, onSelect, onBack, onNext,
                      }: {
    step: number; total: number; question: string;
    options: string[]; selected: string;
    onSelect: (v: string) => void; onBack: () => void; onNext: () => void;
}) {
    return (
        <div style={{ ...PAGE_BG, padding: "32px 20px", maxWidth: "840px", margin: "0 auto" }}>
            <TopBar onBack={onBack} />
            <ProgressBar current={step} total={total} />

            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full mb-7"
                 style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", fontSize: "0.8rem", fontWeight: 600, color: "#34d399" }}>
                <Sparkles style={{ width: "14px", height: "14px" }} />
                AI 어시스턴트의 질문
            </div>

            <h2 className="mb-10" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.2 }}>
                {question}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {options.map((opt) => (
                    <ChoiceButton
                        key={opt} label={opt}
                        selected={selected === opt}
                        onClick={() => onSelect(opt)}
                    />
                ))}
            </div>

            <button
                onClick={onNext}
                disabled={!selected}
                className="w-full h-[56px] rounded-2xl transition-all active:scale-[0.99]"
                style={{
                    background: selected
                        ? "linear-gradient(135deg,#10b981,#34d399)"
                        : "rgba(255,255,255,0.06)",
                    color: selected ? "white" : "rgba(255,255,255,0.25)",
                    fontSize: "1.02rem", fontWeight: 700,
                    border: "none", cursor: selected ? "pointer" : "not-allowed",
                    boxShadow: selected ? "0 8px 28px rgba(16,185,129,0.4)" : "none",
                }}
            >
                다음으로
            </button>
        </div>
    );
}

/* ─────────────────────────────────────────
   주소 입력 스텝
───────────────────────────────────────── */
interface AddressValue {
    zonecode: string;
    addr: string;
    detail: string;
}

function AddressStep({
                         step, total, onBack, onNext, address, onAddressChange,
                     }: {
    step: number; total: number;
    onBack: () => void; onNext: () => void;
    address: AddressValue;
    onAddressChange: (v: AddressValue) => void;
}) {
    useEffect(() => {
        if ((window as any).daum?.Postcode) return;
        if (document.getElementById("daum-postcode-script")) return;
        const script = document.createElement("script");
        script.id = "daum-postcode-script";
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        document.head.appendChild(script);
    }, []);

    const openPostcode = () => {
        if (!(window as any).daum?.Postcode) return;
        new (window as any).daum.Postcode({
            oncomplete: (data: any) => {
                onAddressChange({
                    zonecode: data.zonecode,
                    addr: data.roadAddress || data.jibunAddress,
                    detail: "",
                });
            },
        }).open();
    };

    const isValid = !!address.addr;

    const baseInput: React.CSSProperties = {
        width: "100%", height: "52px", padding: "0 16px",
        borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.45)",
        fontSize: "0.95rem", outline: "none", cursor: "default",
        transition: "border-color 0.2s, box-shadow 0.2s",
    };

    return (
        <div style={{ ...PAGE_BG, padding: "32px 20px", maxWidth: "840px", margin: "0 auto" }}>
            <TopBar onBack={onBack} />
            <ProgressBar current={step} total={total} />

            <div
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full mb-7"
                style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", fontSize: "0.8rem", fontWeight: 600, color: "#34d399" }}
            >
                <Sparkles style={{ width: "14px", height: "14px" }} />
                AI 어시스턴트의 질문
            </div>

            <h2 className="mb-10" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.2 }}>
                현재 매장이 위치한 지역은 어디인가요?
            </h2>

            <div className="space-y-3 mb-10">
                <div className="flex gap-2">
                    <input
                        readOnly
                        value={address.zonecode}
                        placeholder="우편번호"
                        style={{ ...baseInput, width: "160px", flexShrink: 0 }}
                    />
                    <button
                        onClick={openPostcode}
                        style={{
                            height: "52px", padding: "0 22px", borderRadius: "12px",
                            background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)",
                            color: "#34d399", fontSize: "0.92rem", fontWeight: 600,
                            cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.28)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.15)")}
                    >
                        주소 검색
                    </button>
                </div>

                <input
                    readOnly
                    value={address.addr}
                    placeholder="주소 검색 버튼을 눌러 주소를 입력해 주세요"
                    style={baseInput}
                />

                <input
                    readOnly={!address.addr}
                    value={address.detail}
                    onChange={(e) => onAddressChange({ ...address, detail: e.target.value })}
                    placeholder={address.addr ? "상세주소를 입력하세요 (동, 호수 등)" : "주소 검색 후 입력 가능합니다"}
                    style={{
                        ...baseInput,
                        cursor: address.addr ? "text" : "default",
                        color: address.addr ? "white" : "rgba(255,255,255,0.25)",
                        border: address.addr ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.07)",
                        background: address.addr ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                    }}
                    onFocus={(e) => {
                        if (address.addr) {
                            e.currentTarget.style.borderColor = "rgba(16,185,129,0.55)";
                            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.1)";
                        }
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = address.addr ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                />
            </div>

            <button
                onClick={onNext}
                disabled={!isValid}
                className="w-full h-[56px] rounded-2xl transition-all active:scale-[0.99]"
                style={{
                    background: isValid ? "linear-gradient(135deg,#10b981,#34d399)" : "rgba(255,255,255,0.06)",
                    color: isValid ? "white" : "rgba(255,255,255,0.25)",
                    fontSize: "1.02rem", fontWeight: 700,
                    border: "none", cursor: isValid ? "pointer" : "not-allowed",
                    boxShadow: isValid ? "0 8px 28px rgba(16,185,129,0.4)" : "none",
                }}
            >
                다음으로
            </button>
        </div>
    );
}

/* ─────────────────────────────────────────
   로딩 화면
───────────────────────────────────────── */
function LoadingScreen() {
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setDots((d) => (d + 1) % 4), 400);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center" style={{ ...PAGE_BG, minHeight: "100vh" }}>
            <div
                className="mb-8 flex items-center justify-center"
                style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(16,185,129,0.18)", border: "1px solid rgba(16,185,129,0.35)" }}
            >
                <Sparkles style={{ width: "38px", height: "38px", color: "#34d399" }} className="animate-pulse" />
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "12px" }}>
                AI가 최적의 솔루션을 분석 중입니다
            </h2>
            <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.92rem" }}>
                <div
                    className="w-4 h-4 rounded-full border-2 animate-spin"
                    style={{ borderColor: "rgba(16,185,129,0.5)", borderTopColor: "#34d399" }}
                />
                입력하신 데이터를 기반으로 리포트를 생성하고 있어요{"...".slice(0, dots)}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   원형 게이지 (SVG) & Flow State
───────────────────────────────────────── */
type FlowState =
    | "analysisModeSelect"
    | "typeSelect"
    | "warningNew"
    | "existingNotice"
    | "exCategorySelect"
    | "existingQuestions"
    | "deepPosInput"
    | "deepCategorySelect"
    | "deepQuestions"
    | "q0new"
    | "detailedNew"
    | "q1" | "q2" | "q3" | "q4" | "q5"
    | "q1ex" | "q2ex" | "q3ex" | "q4ex" | "q5ex" | "q6ex" | "q7ex" | "q8ex" | "q9ex"
    | "q10ex" | "q11ex" | "q12ex" | "q13ex" | "q14ex" | "q15ex" | "q16ex" | "q17ex"
    | "loading"
    | "result";

type ChoiceFlowState = Exclude<FlowState, "analysisModeSelect" | "typeSelect" | "warningNew" | "existingNotice" | "exCategorySelect" | "existingQuestions" | "deepPosInput" | "deepCategorySelect" | "deepQuestions" | "q0new" | "detailedNew" | "q2ex" | "loading" | "result">;

const QUESTION_FLOW_CONFIG: Record<ChoiceFlowState, {
    step: number;
    total: number;
    question: string;
    options: string[];
    answerKey: string;
    back: FlowState;
    next: FlowState;
}> = {
    q1: {
        step: 1,
        total: 5,
        question: "가장 에너지를 얻는 업무 환경은 어떤 모습인가요?",
        options: Q_WORK_ENV,
        answerKey: "workEnv",
        back: "q0new",
        next: "q2",
    },
    q2: {
        step: 2,
        total: 5,
        question: "현실적으로 매장 운영에 쏟을 수 있는 시간과 체력은 어느 정도인가요?",
        options: Q_TIME_ENERGY,
        answerKey: "timeEnergy",
        back: "q1",
        next: "q3",
    },
    q3: {
        step: 3,
        total: 5,
        question: "준비하신 초기 투자금(보증금, 권리금, 인테리어 등 포함)의 최대치는 얼마인가요?",
        options: Q_BUDGET,
        answerKey: "budget",
        back: "q2",
        next: "q4",
    },
    q4: {
        step: 4,
        total: 5,
        question: "사업의 수익성과 안정성 중 어디에 더 무게를 두고 싶으신가요?",
        options: Q_PRIORITY,
        answerKey: "priority",
        back: "q3",
        next: "q5",
    },
    q5: {
        step: 5,
        total: 5,
        question: "창업을 하더라도, 이것만큼은 절대 피하고 싶은 상황은 무엇인가요?",
        options: Q_AVOID,
        answerKey: "avoid",
        back: "q4",
        next: "loading",
    },
    q1ex: {
        step: 1,
        total: 17,
        question: "운영 중이신 업종은 무엇인가요?",
        options: BUSINESS_TYPES,
        answerKey: "bizType",
        back: "typeSelect",
        next: "q2ex",
    },
    q3ex: {
        step: 3,
        total: 17,
        question: "근무 인원은 몇 명인가요?",
        options: WORKERS,
        answerKey: "workers",
        back: "q2ex",
        next: "q4ex",
    },
    q4ex: {
        step: 4,
        total: 17,
        question: "좌석 수는 몇 개인가요?",
        options: SEATS,
        answerKey: "seats",
        back: "q3ex",
        next: "q5ex",
    },
    q5ex: {
        step: 5,
        total: 17,
        question: "월 임대료는 얼마인가요?",
        options: RENT,
        answerKey: "rent",
        back: "q4ex",
        next: "q6ex",
    },
    q6ex: {
        step: 6,
        total: 17,
        question: "현재 월 평균 매출 규모는 어느 정도인가요?",
        options: MONTHLY_REVENUE,
        answerKey: "revenue",
        back: "q5ex",
        next: "q7ex",
    },
    q7ex: {
        step: 7,
        total: 17,
        question: "매출은 주로 어디서 발생하나요?",
        options: SALES_CHANNEL,
        answerKey: "sales",
        back: "q6ex",
        next: "q8ex",
    },
    q8ex: {
        step: 8,
        total: 17,
        question: "매출이 최근 3개월간 어떤 추세인가요?",
        options: REVENUE_TRENDS,
        answerKey: "revenueTrend",
        back: "q7ex",
        next: "q9ex",
    },
    q9ex: {
        step: 9,
        total: 17,
        question: "매출이 가장 많이 발생하는 시간대는 언제인가요?",
        options: PEAK_TIME,
        answerKey: "peak",
        back: "q8ex",
        next: "q10ex",
    },
    q10ex: {
        step: 10,
        total: 17,
        question: "객단가는 어느 정도인가요?",
        options: MENU_PRICE,
        answerKey: "menuPrice",
        back: "q9ex",
        next: "q11ex",
    },
    q11ex: {
        step: 11,
        total: 17,
        question: "마케팅은 어떻게 하고 계신가요?",
        options: MARKETING,
        answerKey: "marketing",
        back: "q10ex",
        next: "q12ex",
    },
    q12ex: {
        step: 12,
        total: 17,
        question: "고객층은 어떻게 되나요?",
        options: CUSTOMER_POOL,
        answerKey: "customerPool",
        back: "q11ex",
        next: "q13ex",
    },
    q13ex: {
        step: 13,
        total: 17,
        question: "재방문 고객 비율은 어느 정도인가요?",
        options: REPEAT_RATE,
        answerKey: "repeat",
        back: "q12ex",
        next: "q14ex",
    },
    q14ex: {
        step: 14,
        total: 17,
        question: "고객의 재방문 주기는 어떤가요?",
        options: REPEAT_CYCLE,
        answerKey: "repeatCycle",
        back: "q13ex",
        next: "q15ex",
    },
    q15ex: {
        step: 15,
        total: 17,
        question: "리뷰 관리는 하고 있나요?",
        options: REVIEW_CONTROL,
        answerKey: "reviewControl",
        back: "q14ex",
        next: "q16ex",
    },
    q16ex: {
        step: 16,
        total: 17,
        question: "피크 시간 대응이 가능한가요?",
        options: PEAKTIME_WORK,
        answerKey: "peakTimeWork",
        back: "q15ex",
        next: "q17ex",
    },
    q17ex: {
        step: 17,
        total: 17,
        question: "가장 큰 경영 고민은 무엇인가요?",
        options: CURRENT_CHALLENGES,
        answerKey: "challenge",
        back: "q16ex",
        next: "loading",
    },
};

type ExistingQuestion = {
    question: string;
    options?: string[];
    answerKey?: string;
    type: "choice" | "address";
    category?: string;
};

const EXISTING_COMMON_QUESTIONS: ExistingQuestion[] = [
    {
        type: "choice",
        question: "운영 중이신 업종은 무엇인가요?",
        options: BUSINESS_TYPES,
        answerKey: "bizType",
    },
    {
        type: "address",
        question: "현재 매장이 위치한 지역은 어디인가요?",
        answerKey: "region",
    },
];

const EXISTING_CATEGORY_QUESTION_MAP: Record<string, ExistingQuestion[]> = {
    "매출 성과": [
        {
            type: "choice",
            question: "현재 월 평균 매출 규모는 어느 정도인가요?",
            options: MONTHLY_REVENUE,
            answerKey: "revenue",
            category: "매출 성과",
        },
        {
            type: "choice",
            question: "매출은 주로 어디서 발생하나요?",
            options: SALES_CHANNEL,
            answerKey: "sales",
            category: "매출 성과",
        },
        {
            type: "choice",
            question: "매출이 최근 3개월간 어떤 추세인가요?",
            options: REVENUE_TRENDS,
            answerKey: "revenueTrend",
            category: "매출 성과",
        },
        {
            type: "choice",
            question: "매출이 가장 많이 발생하는 시간대는 언제인가요?",
            options: PEAK_TIME,
            answerKey: "peak",
            category: "매출 성과",
        },
        {
            type: "choice",
            question: "객단가는 어느 정도인가요?",
            options: AVERAGE_ORDER_TREND,
            answerKey: "averageOrderTrend",
            category: "매출 성과",
        },
    ],
    "마케팅 역량": [
        {
            type: "choice",
            question: "마케팅은 어떻게 하고 계신가요?",
            options: MARKETING,
            answerKey: "marketing",
            category: "마케팅 역량",
        },
        {
            type: "choice",
            question: "가장 큰 경영 고민은 무엇인가요?",
            options: CURRENT_CHALLENGES,
            answerKey: "challenge",
            category: "마케팅 역량",
        },
        {
            type: "choice",
            question: "프로모션 진행 빈도는 어느 정도인가요?",
            options: PROMOTION_FREQUENCY,
            answerKey: "promotionFrequency",
            category: "마케팅 역량",
        },
        {
            type: "choice",
            question: "광고/홍보 효율은 어느 수준인가요?",
            options: AD_EFFICIENCY,
            answerKey: "adEfficiency",
            category: "마케팅 역량",
        },
        {
            type: "choice",
            question: "리뷰 관리는 하고 있나요?",
            options: REVIEW_CONTROL,
            answerKey: "reviewControl",
            category: "마케팅 역량",
        },
    ],
    "단골 확보": [
        {
            type: "choice",
            question: "고객층은 어떻게 되나요?",
            options: CUSTOMER_POOL,
            answerKey: "customerPool",
            category: "단골 확보",
        },
        {
            type: "choice",
            question: "재방문 고객 비율은 어느 정도인가요?",
            options: REPEAT_RATE,
            answerKey: "repeat",
            category: "단골 확보",
        },
        {
            type: "choice",
            question: "고객의 재방문 주기는 어떤가요?",
            options: REPEAT_CYCLE,
            answerKey: "repeatCycle",
            category: "단골 확보",
        },
        {
            type: "choice",
            question: "단골 프로그램은 운영하고 있나요?",
            options: LOYALTY_PROGRAM,
            answerKey: "loyaltyProgram",
            category: "단골 확보",
        },
        {
            type: "choice",
            question: "고객이 재방문하는 이유를 명확히 알고 계신가요?",
            options: REVISIT_REASON_CLARITY,
            answerKey: "revisitReasonClarity",
            category: "단골 확보",
        },
    ],
    "평판 관리": [
        {
            type: "choice",
            question: "리뷰 관리는 하고 있나요?",
            options: REVIEW_CONTROL,
            answerKey: "reviewControl",
            category: "평판 관리",
        },
        {
            type: "choice",
            question: "리뷰 평균 평점 수준은 어느 정도인가요?",
            options: RATING_LEVEL,
            answerKey: "ratingLevel",
            category: "평판 관리",
        },
        {
            type: "choice",
            question: "부정 리뷰 대응 속도는 어느 정도인가요?",
            options: REVIEW_RESPONSE_SPEED,
            answerKey: "reviewResponseSpeed",
            category: "평판 관리",
        },
        {
            type: "choice",
            question: "클레임 해결 속도/완성도는 어떤가요?",
            options: COMPLAINT_RESOLUTION,
            answerKey: "complaintResolution",
            category: "평판 관리",
        },
        {
            type: "choice",
            question: "고객 응대 매뉴얼은 준비되어 있나요?",
            options: CS_MANUAL,
            answerKey: "csManual",
            category: "평판 관리",
        },
    ],
    "가격 경쟁력": [
        {
            type: "choice",
            question: "객단가는 어느 정도인가요?",
            options: MENU_PRICE,
            answerKey: "menuPrice",
            category: "가격 경쟁력",
        },
        {
            type: "choice",
            question: "고객의 가격 만족도는 어떤가요?",
            options: PRICE_SATISFACTION,
            answerKey: "priceSatisfaction",
            category: "가격 경쟁력",
        },
        {
            type: "choice",
            question: "경쟁 매장 대비 가격 포지션은 어떤가요?",
            options: COMPETITOR_PRICE_POSITION,
            answerKey: "competitorPricePosition",
            category: "가격 경쟁력",
        },
        {
            type: "choice",
            question: "세트/번들 가격 전략은 운영 중인가요?",
            options: BUNDLE_STRATEGY,
            answerKey: "bundleStrategy",
            category: "가격 경쟁력",
        },
        {
            type: "choice",
            question: "원가 통제 수준은 어느 정도인가요?",
            options: COST_CONTROL,
            answerKey: "costControl",
            category: "가격 경쟁력",
        },
    ],
    "운영 효율": [
        {
            type: "choice",
            question: "근무 인원은 몇 명인가요?",
            options: WORKERS,
            answerKey: "workers",
            category: "운영 효율",
        },
        {
            type: "choice",
            question: "좌석 수는 몇 개인가요?",
            options: SEATS,
            answerKey: "seats",
            category: "운영 효율",
        },
        {
            type: "choice",
            question: "피크 시간 대응이 가능한가요?",
            options: PEAKTIME_WORK,
            answerKey: "peakTimeWork",
            category: "운영 효율",
        },
        {
            type: "choice",
            question: "임대료 부담 수준은 어느 정도인가요?",
            options: RENT_BURDEN,
            answerKey: "rentBurden",
            category: "운영 효율",
        },
        {
            type: "choice",
            question: "운영 매뉴얼/체크리스트 표준화 정도는 어떤가요?",
            options: OPERATION_STANDARDIZATION,
            answerKey: "operationStandardization",
            category: "운영 효율",
        },
    ],
};

const DEEP_CATEGORY_QUESTION_MAP: Record<string, ExistingQuestion[]> = {
    ...EXISTING_CATEGORY_QUESTION_MAP,
    "매출 성과": [
        ...(EXISTING_CATEGORY_QUESTION_MAP["매출 성과"] ?? []),
        {
            type: "choice",
            question: "원가율 수준은 어느 정도인가요?",
            options: COST_RATIO,
            answerKey: "costRatio",
            category: "매출 성과",
        },
        {
            type: "choice",
            question: "상위 메뉴 매출 집중도는 어떤가요?",
            options: MENU_CONCENTRATION,
            answerKey: "menuConcentration",
            category: "매출 성과",
        },
    ],
    "마케팅 역량": [
        ...(EXISTING_CATEGORY_QUESTION_MAP["마케팅 역량"] ?? []),
        {
            type: "choice",
            question: "할인/쿠폰 의존도는 어느 정도인가요?",
            options: DISCOUNT_DEPENDENCY,
            answerKey: "discountDependency",
            category: "마케팅 역량",
        },
    ],
    "단골 확보": [
        ...(EXISTING_CATEGORY_QUESTION_MAP["단골 확보"] ?? []),
        {
            type: "choice",
            question: "재방문 유도 캠페인 성과는 어떤가요?",
            options: ["성과 없음", "초기 성과", "안정적 성과", "매우 우수"],
            answerKey: "retentionCampaignPerformance",
            category: "단골 확보",
        },
    ],
    "평판 관리": [
        ...(EXISTING_CATEGORY_QUESTION_MAP["평판 관리"] ?? []),
        {
            type: "choice",
            question: "리뷰 응대 템플릿/프로세스 표준화 수준은 어떤가요?",
            options: OPERATION_STANDARDIZATION,
            answerKey: "reviewProcessStandardization",
            category: "평판 관리",
        },
    ],
    "가격 경쟁력": [
        ...(EXISTING_CATEGORY_QUESTION_MAP["가격 경쟁력"] ?? []),
        {
            type: "choice",
            question: "가격 인상 시 고객 이탈 위험은 어느 정도라고 보시나요?",
            options: ["매우 높음", "높음", "보통", "낮음"],
            answerKey: "priceIncreaseRisk",
            category: "가격 경쟁력",
        },
    ],
    "운영 효율": [
        ...(EXISTING_CATEGORY_QUESTION_MAP["운영 효율"] ?? []),
        {
            type: "choice",
            question: "인건비율은 어느 정도인가요?",
            options: LABOR_RATIO,
            answerKey: "laborRatio",
            category: "운영 효율",
        },
        {
            type: "choice",
            question: "테이블 회전율은 어느 정도인가요?",
            options: TABLE_TURNOVER,
            answerKey: "tableTurnover",
            category: "운영 효율",
        },
    ],
};

export function AIAnalysisPage() {
    const [flow, setFlow] = useState<FlowState>("typeSelect");
    const [userPath, setUserPath] = useState<"simpleNew" | "detailedNew" | "existing">("simpleNew");
    const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("light");
    const [userType, setUserType] = useState<"new" | "existing">("new");
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [addrQ2ex, setAddrQ2ex] = useState<AddressValue>(INITIAL_ADDRESS);
    const [selectedExistingCategories, setSelectedExistingCategories] = useState<string[]>([]);
    const [selectedDeepCategories, setSelectedDeepCategories] = useState<string[]>([]);
    const [existingQuestionIndex, setExistingQuestionIndex] = useState(0);
    const [deepQuestionIndex, setDeepQuestionIndex] = useState(0);
    const [posInputMode, setPosInputMode] = useState<"manual" | "csv">("manual");
    const [posMetrics, setPosMetrics] = useState<PosMetrics>(INITIAL_POS_METRICS);
    const [posInputError, setPosInputError] = useState("");
    const [csvError, setCsvError] = useState("");

    const deepDataFields = useMemo(() => {
        const map = new Map<keyof PosMetrics, { key: keyof PosMetrics; label: string }>();
        selectedDeepCategories.forEach((category) => {
            (DEEP_CATEGORY_DATA_FIELDS[category] ?? []).forEach((field) => {
                map.set(field.key, field);
            });
        });
        return Array.from(map.values());
    }, [selectedDeepCategories]);

    const existingQuestionFlow = useMemo(() => {
        const selected = selectedExistingCategories.flatMap(
            (category) => EXISTING_CATEGORY_QUESTION_MAP[category] ?? [],
        );

        const seenKeys = new Set<string>();
        const deduped = selected.filter((q) => {
            if (!q.answerKey) return true;
            if (seenKeys.has(q.answerKey)) return false;
            seenKeys.add(q.answerKey);
            return true;
        });

        return [...EXISTING_COMMON_QUESTIONS, ...deduped];
    }, [selectedExistingCategories]);

    const deepQuestionFlow = useMemo(() => {
        const selected = selectedDeepCategories.flatMap(
            (category) => DEEP_CATEGORY_QUESTION_MAP[category] ?? [],
        );

        const seenKeys = new Set<string>();
        const deduped = selected.filter((q) => {
            if (!q.answerKey) return true;
            if (seenKeys.has(q.answerKey)) return false;
            seenKeys.add(q.answerKey);
            return true;
        });

        const excludedKeys = new Set(
            selectedDeepCategories.flatMap(
                (category) => DEEP_CATEGORY_DUPLICATE_QUESTION_KEYS[category] ?? [],
            ),
        );

        return [...EXISTING_COMMON_QUESTIONS, ...deduped].filter(
            (q) => !q.answerKey || !excludedKeys.has(q.answerKey),
        );
    }, [selectedDeepCategories]);

    /* 자동 로딩 → 결과 전환 */
    useEffect(() => {
        if (flow === "loading") {
            const t = setTimeout(() => setFlow("result"), 2800);
            return () => clearTimeout(t);
        }
    }, [flow]);

    const ans = (key: string): string => (answers[key] as string) || "";
    const set = (key: string, val: string) => setAnswers((prev) => ({ ...prev, [key]: val }));

    const resetAnswers = () => {
        setAnswers({});
        setAddrQ2ex(INITIAL_ADDRESS);
        setSelectedExistingCategories([]);
        setSelectedDeepCategories([]);
        setExistingQuestionIndex(0);
        setDeepQuestionIndex(0);
        setPosInputMode("manual");
        setPosMetrics(INITIAL_POS_METRICS);
        setPosInputError("");
        setCsvError("");
    };

    const startFlow = (type: "new" | "existing") => {
        resetAnswers();
        setUserType(type);
        if (type === "new") {
            setUserPath("simpleNew");
            setFlow("warningNew");
            return;
        }
        setUserPath("existing");
        setFlow("analysisModeSelect");
    };

    const parsePercent = (v: string) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : NaN;
    };

    const validatePosMetrics = (metrics: PosMetrics): string | null => {
        const requiredKeys = deepDataFields.map((field) => field.key);
        if (requiredKeys.length === 0) return "카테고리 선택 후 관련 데이터를 입력해주세요.";
        const hasEmpty = requiredKeys.some((k) => !metrics[k]?.toString().trim());
        if (hasEmpty) return "집중분석을 위해 POS 항목을 모두 입력해주세요.";

        const hasSalesCategory = selectedDeepCategories.includes("매출 성과");
        if (hasSalesCategory) {
            const dineIn = parsePercent(metrics.dineInShare);
            const delivery = parsePercent(metrics.deliveryShare);
            const takeout = parsePercent(metrics.takeoutShare);
            if ([dineIn, delivery, takeout].some((n) => Number.isNaN(n))) {
                return "채널별 매출 비중은 숫자로 입력해주세요.";
            }
            if (Math.round(dineIn + delivery + takeout) !== 100) {
                return "채널별 매출 비중 합계는 100이 되어야 합니다.";
            }
        }
        return null;
    };

    const handlePosCsvUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            const text = String(reader.result ?? "");
            const lines = text
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean);
            if (lines.length < 2) {
                setCsvError("CSV에 헤더와 데이터 행이 필요합니다.");
                return;
            }
            const headers = lines[0].split(",").map((v) => v.trim());
            const values = lines[1].split(",").map((v) => v.trim());
            const expectedHeaders = deepDataFields.map((field) => field.key);
            if (expectedHeaders.length === 0) {
                setCsvError("카테고리를 먼저 선택해주세요.");
                return;
            }
            const missing = expectedHeaders.filter((h) => !headers.includes(h));
            if (missing.length > 0) {
                setCsvError(`헤더가 누락되었습니다: ${missing.join(", ")}`);
                return;
            }
            const next = { ...INITIAL_POS_METRICS };
            expectedHeaders.forEach((h) => {
                const idx = headers.indexOf(h);
                next[h] = idx >= 0 ? (values[idx] ?? "") : "";
            });
            setPosMetrics(next);
            setCsvError("");
            setPosInputError("");
        };
        reader.onerror = () => setCsvError("CSV 파일을 읽지 못했습니다.");
        reader.readAsText(file);
    };

    if (flow === "analysisModeSelect") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ ...PAGE_BG, position: "relative" }}>
                <div className="w-full max-w-3xl">
                    <button
                        onClick={() => setFlow("typeSelect")}
                        className="flex items-center gap-1 text-sm font-medium mb-8"
                        style={{ color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer" }}
                    >
                        <ChevronLeft className="w-4 h-4" /> 이전
                    </button>
                    <div className="flex justify-center mb-5">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "0.8rem", fontWeight: 600, color: "#34d399" }}
                        >
                            <Sparkles style={{ width: "14px", height: "14px" }} />
                            분석 방식을 먼저 선택해주세요
                        </div>
                    </div>
                    <h1 className="text-center mb-3" style={{ fontSize: "clamp(1.9rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.04em" }}>
                        어떤 분석이 필요하신가요?
                    </h1>
                    <p className="text-center mb-12" style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)" }}>
                        빠른 진단용 가벼운 분석과, POS 기반의 정밀한 집중분석 중에서 고를 수 있습니다.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-5">
                        {[
                            {
                                key: "light" as AnalysisMode,
                                title: "가벼운 분석",
                                desc: "현재 운영 상태를 빠르게 진단해 핵심 개선 포인트를 제안합니다.",
                                icon: <Sparkles style={{ width: "22px", height: "22px" }} />,
                            },
                            {
                                key: "deep" as AnalysisMode,
                                title: "집중분석",
                                desc: "POS 매출 데이터와 세부 질문으로 실행 가능한 정밀 솔루션을 제공합니다. (데이터가 있으시다면 원활한 분석이 가능합니다)",
                                icon: <TrendingUp style={{ width: "22px", height: "22px" }} />,
                            },
                        ].map((card) => (
                            <button
                                key={card.key}
                                onClick={() => {
                                    setAnalysisMode(card.key);
                                    setAnswers((prev) => ({ ...prev, analysisMode: card.key }));
                                    setFlow("existingNotice");
                                }}
                                className="text-left rounded-2xl p-7 transition-all active:scale-[0.98]"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                                    {card.icon}
                                </div>
                                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "10px" }}>{card.title}</h3>
                                <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{card.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    /* ── 로딩 ── */
    if (flow === "loading") return <LoadingScreen />;

    /* ── 결과 ── */
    const handleReset = () => {
        resetAnswers();
        setUserType("new");
        setUserPath("simpleNew");
        setAnalysisMode("light");
        setFlow("typeSelect");
    };
    const handleSwitchToExisting = () => {
        setUserPath("existing");
        startFlow("existing");
    };

    if (flow === "result" && userType === "existing")
        return (
            <ExistingResultReport
                answers={answers}
                onReset={handleReset}
            />
        );
    if (flow === "result" && userPath === "simpleNew")
        return <SimpleResultReport answers={answers} onReset={handleReset} onDetailedAnalysis={() => { setUserPath("detailedNew"); setFlow("detailedNew"); }} />;
    if (flow === "result")
        return <NewResultReport answers={answers} onReset={handleReset} onSwitchToExisting={handleSwitchToExisting} />;

    /* ── 창업 전 주의사항 (신생 창업자 진입) ── */
    if (flow === "warningNew") return (
        <div style={PAGE_BG}>
            <div className="min-h-screen flex flex-col items-center justify-start pt-24 px-4">
                <div className="w-full max-w-xl">
                    <div className="flex items-center mb-12">
                        <button onClick={() => setFlow("typeSelect")} className="flex items-center gap-1 text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                            <ChevronLeft className="w-4 h-4" /> 이전
                        </button>
                    </div>
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                             style={{ background: "linear-gradient(135deg,#f97316,#fb923c)", boxShadow: "0 6px 20px rgba(249,115,22,0.4)" }}>
                            <Store className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-white leading-tight tracking-tight">소상광장</span>
                            <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>AI 맞춤 분석</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: "#f97316" }} />
                        <h2 className="text-xl font-black text-white">잠깐! 창업 전 꼭 체크해 보세요.</h2>
                    </div>
                    <div className="rounded-2xl p-6 mb-8" style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)" }}>
                        <p style={{ fontSize: "0.97rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.85 }}>
                            소상공인 창업 후,{" "}
                            <span style={{ color: "#fb923c", fontWeight: 700 }}>초기 자금이 바닥나는 3~6개월 구간</span>과{" "}
                            <span style={{ color: "#fb923c", fontWeight: 700 }}>매출이 고정비를 못 넘기는 1~3년 구간</span>은
                            수익보다 지출이 많을 수 있습니다.
                            <br /><br />
                            이 <span style={{ color: "#fb923c", fontWeight: 700 }}>'데스밸리'</span> 구간을 버틸
                            마음의 준비와 여유 운영 자금이 계획되어 있으신가요?
                        </p>
                    </div>
                    <button
                        onClick={() => setFlow("q0new")}
                        className="w-full h-14 rounded-2xl font-bold text-white transition-all"
                        style={{ background: "linear-gradient(135deg,#10b981,#34d399)", boxShadow: "0 8px 28px rgba(16,185,129,0.4)" }}
                    >
                        확인했습니다
                    </button>
                </div>
            </div>
        </div>
    );

    /* ── 설문 스텝 (신생 창업자) ── */
    if (flow === "q0new") return (
        <div style={PAGE_BG}>
            <div className="min-h-screen flex flex-col items-center justify-start pt-24 px-4">
                <div className="w-full max-w-xl">
                    <div className="flex items-center mb-12">
                        <button onClick={() => setFlow("warningNew")} className="flex items-center gap-1 text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                            <ChevronLeft className="w-4 h-4" /> 이전
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                             style={{ background: "linear-gradient(135deg,#f97316,#fb923c)", boxShadow: "0 6px 20px rgba(249,115,22,0.4)" }}>
                            <Store className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-white leading-tight tracking-tight">소상광장</span>
                            <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>AI 맞춤 분석</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-black text-white mb-10">구체적인 창업 계획이 있으신가요?</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "예", value: "예", desc: "업종·위치 등 어느 정도 구체적인 계획이 있어요" },
                            { label: "아니오", value: "아니오", desc: "아직 막막해도 괜찮아요! AI와 함께 나만의 업종을 찾아보세요." },
                        ].map((opt) => {
                            const selected = ans("hasPlan") === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => set("hasPlan", opt.value)}
                                    className="flex flex-col items-start p-6 rounded-2xl border-2 text-left transition-all"
                                    style={{
                                        background: selected ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
                                        borderColor: selected ? "#10b981" : "rgba(255,255,255,0.08)",
                                    }}
                                >
                                    <span className="text-2xl font-black text-white mb-2">{opt.label}</span>
                                    <span className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{opt.desc}</span>
                                </button>
                            );
                        })}
                    </div>
                    <button
                        disabled={!ans("hasPlan")}
                        onClick={() => {
                            const path = ans("hasPlan") === "예" ? "detailedNew" : "simpleNew";
                            setUserPath(path);
                            setFlow(ans("hasPlan") === "예" ? "detailedNew" : "q1");
                        }}
                        className="mt-8 w-full h-14 rounded-2xl font-bold text-white transition-all"
                        style={{
                            background: ans("hasPlan") ? "linear-gradient(135deg,#10b981,#34d399)" : "rgba(255,255,255,0.08)",
                            color: ans("hasPlan") ? "white" : "rgba(255,255,255,0.3)",
                            cursor: ans("hasPlan") ? "pointer" : "not-allowed",
                        }}
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );

    if (flow === "detailedNew") return (
        <DetailedStartupQuestionnaire
            onBack={() => setFlow("q0new")}
            onComplete={(detailedAnswers) => {
                setAnswers(prev => ({ ...prev, ...detailedAnswers }));
                setFlow("loading");
            }}
        />
    );

    if (flow in QUESTION_FLOW_CONFIG) {
        const config = QUESTION_FLOW_CONFIG[flow as ChoiceFlowState];
        return (
            <div style={PAGE_BG}>
                <QuestionStep
                    step={config.step}
                    total={config.total}
                    question={config.question}
                    options={config.options}
                    selected={ans(config.answerKey)}
                    onSelect={(value) => set(config.answerKey, value)}
                    onBack={() => setFlow(config.back)}
                    onNext={() => setFlow(config.next)}
                />
            </div>
        );
    }

    if (flow === "existingNotice") return (
        <div style={PAGE_BG}>
            <div className="min-h-screen flex flex-col items-center justify-start pt-20 px-4">
                <div className="w-full max-w-3xl">
                    <TopBar onBack={() => setFlow("analysisModeSelect")} />
                    <div
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full mb-6"
                        style={{
                            background: "rgba(249,115,22,0.15)",
                            border: "1px solid rgba(249,115,22,0.35)",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "#fb923c",
                        }}
                    >
                        <Sparkles style={{ width: "14px", height: "14px" }} />
                        기존 사장님 안내
                    </div>

                    <div
                        className="rounded-2xl p-7 mb-8"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                        }}
                    >
                        <h2
                            className="mb-4"
                            style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.35 }}
                        >
                            시작 전에 확인해주세요
                        </h2>
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.8 }}>
                            이 분석은 AI를 활용한 결과문입니다.
                            <br />
                            실제 효과가 미비하거나 없을 수 있으니 주의하시길 바랍니다.
                            {analysisMode === "deep" && (
                                <>
                                    <br />
                                    집중분석은 가벼운 분석보다 분석 및 결과 생성에 시간이 더 소요될 수 있습니다.
                                </>
                            )}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            onClick={() => setFlow("analysisModeSelect")}
                            className="h-[54px] rounded-2xl transition-all active:scale-[0.99]"
                            style={{
                                background: "rgba(255,255,255,0.06)",
                                color: "rgba(255,255,255,0.75)",
                                fontSize: "0.98rem",
                                fontWeight: 700,
                                border: "1px solid rgba(255,255,255,0.15)",
                                cursor: "pointer",
                            }}
                        >
                            돌아가기
                        </button>
                        <button
                            onClick={() => setFlow(analysisMode === "deep" ? "deepCategorySelect" : "exCategorySelect")}
                            className="h-[54px] rounded-2xl transition-all active:scale-[0.99]"
                            style={{
                                background: "linear-gradient(135deg,#10b981,#34d399)",
                                color: "white",
                                fontSize: "0.98rem",
                                fontWeight: 700,
                                border: "none",
                                cursor: "pointer",
                                boxShadow: "0 8px 28px rgba(16,185,129,0.4)",
                            }}
                        >
                            확인하고 계속하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (flow === "deepPosInput") return (
        <div style={PAGE_BG}>
            <div className="min-h-screen flex flex-col items-center justify-start pt-20 px-4">
                <div className="w-full max-w-3xl">
                    <TopBar onBack={() => setFlow("deepCategorySelect")} />
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full mb-6"
                         style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", fontSize: "0.8rem", fontWeight: 600, color: "#34d399" }}>
                        <Sparkles style={{ width: "14px", height: "14px" }} />
                        집중분석 POS 데이터 입력
                    </div>
                    <h2 className="mb-3" style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.25 }}>
                        POS 매출 데이터를 입력해주세요
                    </h2>
                    <p className="mb-6" style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.95rem" }}>
                        수기 입력 또는 CSV 업로드 중 편한 방식을 선택할 수 있습니다.
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            onClick={() => setPosInputMode("manual")}
                            className="h-[48px] rounded-xl flex items-center justify-center gap-2 transition-all"
                            style={{ background: posInputMode === "manual" ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.05)", border: posInputMode === "manual" ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.1)", color: posInputMode === "manual" ? "#34d399" : "rgba(255,255,255,0.6)" }}
                        >
                            <Keyboard style={{ width: "15px", height: "15px" }} />
                            수기 입력
                        </button>
                        <button
                            onClick={() => setPosInputMode("csv")}
                            className="h-[48px] rounded-xl flex items-center justify-center gap-2 transition-all"
                            style={{ background: posInputMode === "csv" ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.05)", border: posInputMode === "csv" ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.1)", color: posInputMode === "csv" ? "#34d399" : "rgba(255,255,255,0.6)" }}
                        >
                            <FileUp style={{ width: "15px", height: "15px" }} />
                            CSV 업로드
                        </button>
                    </div>

                    {posInputMode === "csv" && (
                        <div className="rounded-2xl p-5 mb-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <p className="mb-3" style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.45)" }}>
                                CSV 헤더는 선택한 카테고리 데이터 키를 사용해주세요. (예: monthlyRevenue,adBudget,reviewAverageScore)
                            </p>
                            <input
                                type="file"
                                accept=".csv,text/csv"
                                onChange={(e) => {
                                    const file = e.currentTarget.files?.[0];
                                    if (file) handlePosCsvUpload(file);
                                }}
                                style={{ width: "100%", color: "rgba(255,255,255,0.7)" }}
                            />
                            {csvError && <p className="mt-3" style={{ color: "#fda4af", fontSize: "0.82rem" }}>{csvError}</p>}
                        </div>
                    )}

                    {posInputMode === "manual" && (
                        <div className="space-y-4 mb-4">
                            {selectedDeepCategories.map((category) => {
                                const categoryFields = DEEP_CATEGORY_DATA_FIELDS[category] ?? [];
                                if (categoryFields.length === 0) return null;
                                return (
                                    <div
                                        key={category}
                                        className="rounded-2xl p-5"
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                                    >
                                        <h3
                                            style={{
                                                fontSize: "1rem",
                                                fontWeight: 800,
                                                color: "#34d399",
                                                marginBottom: "12px",
                                            }}
                                        >
                                            {category} 데이터
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {categoryFields.map((field) => (
                                                <div key={field.key}>
                                                    <label style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: "6px" }}>
                                                        {field.label}
                                                    </label>
                                                    <input
                                                        value={posMetrics[field.key as keyof PosMetrics]}
                                                        onChange={(e) => {
                                                            setPosMetrics((prev) => ({ ...prev, [field.key]: e.target.value }));
                                                            setPosInputError("");
                                                        }}
                                                        className="w-full h-[46px] rounded-xl px-3"
                                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {posInputError && (
                        <p className="mb-4" style={{ color: "#fda4af", fontSize: "0.84rem" }}>
                            {posInputError}
                        </p>
                    )}
                    <button
                        onClick={() => {
                            const err = validatePosMetrics(posMetrics);
                            if (err) {
                                setPosInputError(err);
                                return;
                            }
                            setAnswers((prev) => ({ ...prev, ...posMetrics, selectedCategories: selectedDeepCategories }));
                            setFlow("deepQuestions");
                        }}
                        className="w-full h-[56px] rounded-2xl transition-all active:scale-[0.99]"
                        style={{ background: "linear-gradient(135deg,#10b981,#34d399)", color: "white", fontSize: "1.02rem", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 8px 28px rgba(16,185,129,0.4)" }}
                    >
                        POS 데이터 저장 후 다음
                    </button>
                </div>
            </div>
        </div>
    );

    if (flow === "exCategorySelect") return (
        <div style={PAGE_BG}>
            <style>{`
        .existing-category-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(16,185,129,0.75) rgba(255,255,255,0.08);
        }
        .existing-category-scroll::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .existing-category-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.08);
          border-radius: 999px;
        }
        .existing-category-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(16,185,129,0.95), rgba(52,211,153,0.85));
          border-radius: 999px;
          border: 2px solid rgba(20,23,32,0.95);
        }
      `}</style>
            <div className="min-h-screen flex flex-col items-center justify-start pt-20 px-4">
                <div className="w-full max-w-3xl">
                    <TopBar onBack={() => setFlow("typeSelect")} />
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full mb-6"
                         style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", fontSize: "0.8rem", fontWeight: 600, color: "#34d399" }}>
                        <Sparkles style={{ width: "14px", height: "14px" }} />
                        기존 사장님 맞춤 카테고리 선택
                    </div>

                    <h2 className="mb-3" style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.25 }}>
                        어떤 항목을 집중 분석할까요?
                    </h2>
                    <p className="mb-8" style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.95rem" }}>
                        복수 선택 가능하며, 선택한 카테고리의 질문과 솔루션만 결과에 반영됩니다.
                    </p>

                    <div className="existing-category-scroll flex gap-3 mb-2 overflow-x-auto pb-3">
                        {EXISTING_CATEGORY_OPTIONS.map((item) => {
                            const selected = selectedExistingCategories.includes(item.label);
                            const visual = EXISTING_CATEGORY_VISUALS[item.label];
                            const Icon = visual?.icon ?? Sparkles;
                            return (
                                <button
                                    key={item.label}
                                    onClick={() =>
                                        setSelectedExistingCategories((prev) =>
                                            prev.includes(item.label)
                                                ? prev.filter((v) => v !== item.label)
                                                : [...prev, item.label],
                                        )
                                    }
                                    className="text-left rounded-2xl p-5 transition-all active:scale-[0.98] shrink-0"
                                    style={{
                                        width: "205px",
                                        minHeight: "240px",
                                        background: selected ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)",
                                        border: selected ? "1.5px solid #10b981" : "1px solid rgba(255,255,255,0.1)",
                                    }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                        style={{ background: visual?.tint ?? "rgba(16,185,129,0.2)" }}
                                    >
                                        <Icon style={{ width: "20px", height: "20px", color: selected ? "#34d399" : "rgba(255,255,255,0.8)" }} />
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: selected ? "#34d399" : "white" }}>
                      {item.label}
                    </span>
                                        <span style={{ fontSize: "0.78rem", color: selected ? "#34d399" : "rgba(255,255,255,0.35)" }}>
                      {selected ? "선택됨" : "선택"}
                    </span>
                                    </div>
                                    <p style={{ fontSize: "0.82rem", lineHeight: 1.6, color: "rgba(255,255,255,0.48)" }}>
                                        {item.desc}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                    <p className="mb-8" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem" }}>
                        좌우로 스크롤하여 모든 카테고리를 확인할 수 있습니다.
                    </p>

                    <button
                        onClick={() => {
                            setAnswers((prev) => ({
                                ...prev,
                                selectedCategories: selectedExistingCategories,
                            }));
                            setExistingQuestionIndex(0);
                            setFlow("existingQuestions");
                        }}
                        disabled={selectedExistingCategories.length === 0}
                        className="w-full h-[56px] rounded-2xl transition-all active:scale-[0.99]"
                        style={{
                            background: selectedExistingCategories.length
                                ? "linear-gradient(135deg,#10b981,#34d399)"
                                : "rgba(255,255,255,0.06)",
                            color: selectedExistingCategories.length ? "white" : "rgba(255,255,255,0.25)",
                            fontSize: "1.02rem",
                            fontWeight: 700,
                            border: "none",
                            cursor: selectedExistingCategories.length ? "pointer" : "not-allowed",
                            boxShadow: selectedExistingCategories.length
                                ? "0 8px 28px rgba(16,185,129,0.4)"
                                : "none",
                        }}
                    >
                        선택한 카테고리로 질문 시작하기
                    </button>
                </div>
            </div>
        </div>
    );

    if (flow === "deepCategorySelect") return (
        <div style={PAGE_BG}>
            <div className="min-h-screen flex flex-col items-center justify-start pt-20 px-4">
                <div className="w-full max-w-3xl">
                    <TopBar onBack={() => setFlow("existingNotice")} />
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full mb-6"
                         style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", fontSize: "0.8rem", fontWeight: 600, color: "#34d399" }}>
                        <Sparkles style={{ width: "14px", height: "14px" }} />
                        집중분석 카테고리 선택
                    </div>

                    <h2 className="mb-3" style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.25 }}>
                        어떤 항목을 깊이 분석할까요?
                    </h2>
                    <p className="mb-8" style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.95rem" }}>
                        선택한 카테고리에 대해 더 세부적인 질문과 실행 KPI를 제공합니다.
                    </p>

                    <div className="existing-category-scroll flex gap-3 mb-2 overflow-x-auto pb-3">
                        {EXISTING_CATEGORY_OPTIONS.map((item) => {
                            const selected = selectedDeepCategories.includes(item.label);
                            const visual = EXISTING_CATEGORY_VISUALS[item.label];
                            const Icon = visual?.icon ?? Sparkles;
                            return (
                                <button
                                    key={item.label}
                                    onClick={() =>
                                        setSelectedDeepCategories((prev) =>
                                            prev.includes(item.label) ? prev.filter((v) => v !== item.label) : [...prev, item.label],
                                        )
                                    }
                                    className="text-left rounded-2xl p-5 transition-all active:scale-[0.98] shrink-0"
                                    style={{
                                        width: "205px",
                                        minHeight: "240px",
                                        background: selected ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)",
                                        border: selected ? "1.5px solid #10b981" : "1px solid rgba(255,255,255,0.1)",
                                    }}
                                >
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: visual?.tint ?? "rgba(16,185,129,0.2)" }}>
                                        <Icon style={{ width: "20px", height: "20px", color: selected ? "#34d399" : "rgba(255,255,255,0.8)" }} />
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span style={{ fontSize: "1rem", fontWeight: 700, color: selected ? "#34d399" : "white" }}>{item.label}</span>
                                        <span style={{ fontSize: "0.78rem", color: selected ? "#34d399" : "rgba(255,255,255,0.35)" }}>{selected ? "선택됨" : "선택"}</span>
                                    </div>
                                    <p style={{ fontSize: "0.82rem", lineHeight: 1.6, color: "rgba(255,255,255,0.48)" }}>{item.desc}</p>
                                </button>
                            );
                        })}
                    </div>
                    <p className="mb-8" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem" }}>
                        좌우로 스크롤하여 모든 카테고리를 확인할 수 있습니다.
                    </p>

                    <button
                        onClick={() => {
                            setAnswers((prev) => ({ ...prev, selectedCategories: selectedDeepCategories }));
                            setPosInputError("");
                            setCsvError("");
                            setFlow("deepPosInput");
                        }}
                        disabled={selectedDeepCategories.length === 0}
                        className="w-full h-[56px] rounded-2xl transition-all active:scale-[0.99]"
                        style={{
                            background: selectedDeepCategories.length ? "linear-gradient(135deg,#10b981,#34d399)" : "rgba(255,255,255,0.06)",
                            color: selectedDeepCategories.length ? "white" : "rgba(255,255,255,0.25)",
                            fontSize: "1.02rem",
                            fontWeight: 700,
                            border: "none",
                            cursor: selectedDeepCategories.length ? "pointer" : "not-allowed",
                            boxShadow: selectedDeepCategories.length ? "0 8px 28px rgba(16,185,129,0.4)" : "none",
                        }}
                    >
                        선택한 카테고리 데이터 입력하기
                    </button>
                </div>
            </div>
        </div>
    );

    if (flow === "existingQuestions") {
        const total = existingQuestionFlow.length;
        const current = existingQuestionFlow[existingQuestionIndex];
        const isFirst = existingQuestionIndex === 0;
        const isLast = existingQuestionIndex === total - 1;

        if (!current) {
            setFlow("loading");
            return null;
        }

        const goBack = () => {
            if (isFirst) {
                setFlow("exCategorySelect");
                return;
            }
            setExistingQuestionIndex((prev) => Math.max(0, prev - 1));
        };

        const goNext = () => {
            if (isLast) {
                setFlow("loading");
                return;
            }
            setExistingQuestionIndex((prev) => Math.min(total - 1, prev + 1));
        };

        if (current.type === "address") {
            return (
                <div style={PAGE_BG}>
                    <AddressStep
                        step={existingQuestionIndex + 1}
                        total={total}
                        address={addrQ2ex}
                        onAddressChange={setAddrQ2ex}
                        onBack={goBack}
                        onNext={() => {
                            const regionStr = [addrQ2ex.addr, addrQ2ex.detail]
                                .filter(Boolean)
                                .join(" ") + (addrQ2ex.zonecode ? ` (${addrQ2ex.zonecode})` : "");
                            set("region", regionStr);
                            goNext();
                        }}
                    />
                </div>
            );
        }

        return (
            <div style={PAGE_BG}>
                <QuestionStep
                    step={existingQuestionIndex + 1}
                    total={total}
                    question={current.question}
                    options={current.options || []}
                    selected={ans(current.answerKey || "")}
                    onSelect={(value) => current.answerKey && set(current.answerKey, value)}
                    onBack={goBack}
                    onNext={goNext}
                />
            </div>
        );
    }

    if (flow === "deepQuestions") {
        const total = deepQuestionFlow.length;
        const current = deepQuestionFlow[deepQuestionIndex];
        const isFirst = deepQuestionIndex === 0;
        const isLast = deepQuestionIndex === total - 1;

        if (!current) {
            setFlow("loading");
            return null;
        }

        const goBack = () => {
            if (isFirst) {
                setFlow("deepPosInput");
                return;
            }
            setDeepQuestionIndex((prev) => Math.max(0, prev - 1));
        };

        const goNext = () => {
            if (isLast) {
                setFlow("loading");
                return;
            }
            setDeepQuestionIndex((prev) => Math.min(total - 1, prev + 1));
        };

        if (current.type === "address") {
            return (
                <div style={PAGE_BG}>
                    <AddressStep
                        step={deepQuestionIndex + 1}
                        total={total}
                        address={addrQ2ex}
                        onAddressChange={setAddrQ2ex}
                        onBack={goBack}
                        onNext={() => {
                            const regionStr = [addrQ2ex.addr, addrQ2ex.detail].filter(Boolean).join(" ") + (addrQ2ex.zonecode ? ` (${addrQ2ex.zonecode})` : "");
                            set("region", regionStr);
                            goNext();
                        }}
                    />
                </div>
            );
        }

        return (
            <div style={PAGE_BG}>
                <QuestionStep
                    step={deepQuestionIndex + 1}
                    total={total}
                    question={current.question}
                    options={current.options || []}
                    selected={ans(current.answerKey || "")}
                    onSelect={(value) => current.answerKey && set(current.answerKey, value)}
                    onBack={goBack}
                    onNext={goNext}
                />
            </div>
        );
    }

    /* ── 유형 선택 화면 ── */
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
            style={{ ...PAGE_BG, position: "relative" }}
        >
            {/* 상단 글로우 */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(16,185,129,0.07) 0%, transparent 60%)" }}
            />

            {/* 로고 */}
            <Link to="/" className="flex items-center gap-2.5 mb-14 relative">
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}
                >
                    <Store className="w-[18px] h-[18px] text-white" />
                </div>
                <span className="text-white" style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
          소상<span style={{ color: "#f97316" }}>광장</span>
          <span style={{ fontSize: "0.72rem", fontWeight: 500, color: "rgba(255,255,255,0.35)", marginLeft: "8px" }}>AI 맞춤 분석</span>
        </span>
            </Link>

            <div className="relative w-full" style={{ maxWidth: "740px" }}>
                {/* AI 뱃지 */}
                <div className="flex justify-center mb-5">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "0.8rem", fontWeight: 600, color: "#34d399" }}
                    >
                        <Sparkles style={{ width: "14px", height: "14px" }} />
                        맞춤형 AI 분석을 위해 가장 알맞은 유형을 알려주세요
                    </div>
                </div>

                <h1
                    className="text-center mb-3"
                    style={{ fontSize: "clamp(1.9rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.04em" }}
                >
                    현재 상황을 선택해주세요
                </h1>
                <p
                    className="text-center mb-12"
                    style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)" }}
                >
                    맞춤형 AI 분석을 위해 가장 알맞은 유형을 알려주세요
                </p>

                <div className="grid sm:grid-cols-2 gap-5">
                    {/* 신생 창업자 카드 */}
                    {[
                        {
                            key: "new" as const,
                            icon: (
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                                    <path d="M19 8h2m-1-1v2" />
                                </svg>
                            ),
                            title: "신생 창업자",
                            desc: "처음 가게를 시작하려고 준비 중입니다. 업종, 위치, 비용 등 전반적인 가이드가 필요해요.",
                        },
                        {
                            key: "existing" as const,
                            icon: (
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    <polyline points="9,22 9,12 15,12 15,22" />
                                </svg>
                            ),
                            title: "기존 사장님",
                            desc: "이미 가게를 운영 중입니다. 매출 상승, 마케팅, 트렌드 분석 등 운영 전략이 필요해요.",
                        },
                    ].map((card) => {
                        return (
                            <button
                                key={card.key}
                                onClick={() => startFlow(card.key)}
                                className="text-left rounded-2xl p-7 transition-all active:scale-[0.98] relative"
                                style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.border = "1px solid rgba(16,185,129,0.4)";
                                    e.currentTarget.style.background = "rgba(16,185,129,0.06)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
                                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                                }}
                            >
                                {/* 우상단 라디오 */}
                                <div
                                    className="absolute top-5 right-5 w-5 h-5 rounded-full"
                                    style={{
                                        border: "1.5px solid rgba(255,255,255,0.2)",
                                        background: "rgba(255,255,255,0.06)",
                                    }}
                                />

                                {/* 아이콘 */}
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                    style={{ background: "rgba(255,255,255,0.1)" }}
                                >
                                    {card.icon}
                                </div>

                                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "10px" }}>
                                    {card.title}
                                </h3>
                                <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                                    {card.desc}
                                </p>
                            </button>
                        );
                    })}
                </div>

                <p className="text-center mt-8" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.2)" }}>
                    입력하신 정보는 분석 목적으로만 활용되며 저장되지 않습니다.
                </p>
            </div>
        </div>
    );
}
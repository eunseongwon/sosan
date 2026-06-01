import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import {
  Store,
  ChevronLeft,
  Sparkles,
  TrendingUp,
  Megaphone,
  Users,
  Star,
  BadgeDollarSign,
  Settings2,
  AlertTriangle,
} from "lucide-react";
import { NewResultReport } from "./NewResultReport";
import { type AiAnalysisResult } from "../utils/openai";
import { type BizinfoContext } from "../utils/budongsan";
import { ExistingResultReport } from "./ExistingResultReport";
import { DetailedStartupQuestionnaire } from "./DetailedStartupQuestionnaire";
import {
  ExistingOwnerAnalysisModeSelectView,
  ExistingOwnerEntryView,
  ExistingOwnerFlowViews,
} from "./ExistingOwner";
import { ExistingOwnerMainPage } from "./ExistingOwnerMainPage";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────
   데이터 정의
───────────────────────────────────────── */
const BUSINESS_TYPES = [
  "음식점 (한식/양식/중식 등)",
  "카페 (음료/디저트 등)",
  "제과점/베이커리",
  "소매점 (편의점/의류 등)",
  "서비스업 (미용/피트니스 등)",
  "기타 업종",
];

const INDUSTRY_OPTIONS = [
  {
    id: "restaurant",
    label: "음식점 (한식/양식/중식 등)",
    subOptions: ["한식", "중식", "일식", "양식", "분식", "기타 음식점"],
  },
  {
    id: "cafe",
    label: "카페 (음료/디저트 등)",
    subOptions: ["테이크아웃", "음료", "디저트", "대형", "기타 카페"],
  },
  {
    id: "dessert",
    label: "제과점/베이커리",
    subOptions: [
      "개인 빵집",
      "프랜차이즈 베이커리",
      "수제 디저트",
      "샌드위치/샐러드",
      "기타 제과점",
    ],
  },
  {
    id: "retail",
    label: "소매점 (편의점/의류 등)",
    subOptions: [
      "편의점/마트",
      "의류/잡화",
      "식음료/농수산물",
      "화장품/뷰티",
      "기타 소매점",
    ],
  },
  {
    id: "service",
    label: "서비스업 (미용/피트니스 등)",
    subOptions: [
      "미용/헤어/네일",
      "피트니스/요가",
      "세탁/수선",
      "학원/교육",
      "기타 서비스업",
    ],
  },
  {
    id: "other",
    label: "기타 업종",

    subOptions: ["숙박업", "여가/오락", "부동산업", "기타"],
  },
];

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
  {
    label: "마케팅 역량",
    desc: "유입 채널, 홍보 효율, 전환 가능성을 분석합니다.",
  },
  { label: "단골 확보", desc: "재방문율과 충성 고객 유지 전략을 점검합니다." },
  { label: "평판 관리", desc: "리뷰 대응과 고객 신뢰 관리 수준을 확인합니다." },
  { label: "가격 경쟁력", desc: "가격대 적합성과 객단가 경쟁력을 확인합니다." },
  {
    label: "운영 효율",
    desc: "인력/좌석/피크 대응 등 운영 효율을 진단합니다.",
  },
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

const DEEP_CATEGORY_DATA_FIELDS: Record<
  string,
  Array<{ key: keyof PosMetrics; label: string }>
> = {
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
  "단골 확보": [{ key: "repeatCustomerRate", label: "재방문 고객 비중(%)" }],
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
  "매출 성과": [
    "revenue",
    "sales",
    "revenueTrend",
    "peak",
    "averageOrderTrend",
  ],
  "마케팅 역량": ["marketing", "adEfficiency"],
  "단골 확보": ["repeat", "repeatCycle", "revisitReasonClarity"],
  "평판 관리": ["ratingLevel", "reviewResponseSpeed", "complaintResolution"],
  "가격 경쟁력": [
    "priceSatisfaction",
    "competitorPricePosition",
    "bundleStrategy",
  ],
  "운영 효율": ["workers", "peakTimeWork"],
};

const EXISTING_CATEGORY_VISUALS: Record<
  string,
  { icon: React.ComponentType<{ style?: React.CSSProperties }>; tint: string }
> = {
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
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.35)",
            fontSize: "0.88rem",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.35)")
          }
        >
          <ChevronLeft style={{ width: "16px", height: "16px" }} /> 이전으로
        </button>
      ) : (
        <div />
      )}
      {label && (
        <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.25)" }}>
          {label}
        </span>
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
        <span
          style={{
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.35)",
            whiteSpace: "nowrap",
          }}
        >
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
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
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
  step,
  total,
  question,
  options,
  selected,
  onSelect,
  onBack,
  onNext,
}: {
  step: number;
  total: number;
  question: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const isBizType = question.includes("업종");
  const [openAccordion, setOpenAccordion] = useState<string>("");
  return (
    <div
      style={{
        ...PAGE_BG,
        padding: "32px 20px",
        maxWidth: "840px",
        margin: "0 auto",
      }}
    >
      <TopBar onBack={onBack} />
      <ProgressBar current={step} total={total} />

      {/* AI badge */}
      <div
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full mb-7"
        style={{
          background: "rgba(16,185,129,0.15)",
          border: "1px solid rgba(16,185,129,0.35)",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#34d399",
        }}
      >
        <Sparkles style={{ width: "14px", height: "14px" }} />
        AI 어시스턴트의 질문
      </div>

      <h2
        className="mb-10"
        style={{
          fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.2,
        }}
      >
        {question}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {isBizType
          ? // 업종 질문일 때: 아코디언 UI 렌더링
            INDUSTRY_OPTIONS.map((option) => {
              const isOpen = openAccordion === option.id;
              const isSelected =
                selected === option.label ||
                (option.subOptions &&
                  option.subOptions.some((sub) => selected.includes(sub)));

              return (
                <div key={option.id} className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      if (option.subOptions) {
                        if (isOpen) {
                          setOpenAccordion(""); // 이미 열려있으면 닫기
                        } else {
                          setOpenAccordion(option.id); // 새로 열기
                          onSelect(""); //  아코디언을 열면 기존 선택값을 초기화
                        }
                      } else {
                        onSelect(option.label); // 세부 메뉴가 없으면 바로 선택
                        setOpenAccordion(""); // 다른 열려있던 아코디언은 닫아줌
                      }
                    }}
                    className="w-full text-left transition-all active:scale-[0.98]"
                    style={{
                      padding: "18px 22px",
                      borderRadius: "14px",
                      border:
                        isSelected || isOpen
                          ? "1.5px solid #10b981"
                          : "1px solid rgba(255,255,255,0.1)",
                      background:
                        isSelected || isOpen
                          ? "rgba(16,185,129,0.12)"
                          : "rgba(255,255,255,0.04)",
                      color:
                        isSelected || isOpen
                          ? "#34d399"
                          : "rgba(255,255,255,0.65)",
                      fontSize: "0.97rem",
                      fontWeight: isSelected || isOpen ? 600 : 400,
                    }}
                  >
                    {option.label}
                  </button>

                  <AnimatePresence>
                    {isOpen && option.subOptions && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: -5 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 0 }}
                        exit={{ height: 0, opacity: 0, marginTop: -5 }}
                        className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-2 overflow-hidden"
                      >
                        {option.subOptions.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => onSelect(sub)}
                            className="py-2.5 px-3 rounded-xl text-[0.85rem] transition-all"
                            style={{
                              border:
                                selected === sub
                                  ? "1px solid #34d399"
                                  : "1px solid rgba(255,255,255,0.1)",
                              background:
                                selected === sub ? "#34d399" : "transparent",
                              color:
                                selected === sub
                                  ? "#141720"
                                  : "rgba(255,255,255,0.5)",
                              fontWeight: selected === sub ? 700 : 400,
                            }}
                          >
                            {sub}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          : // 일반 질문일 때: 기존의 기본 버튼 렌더링
            options.map((opt) => (
              <ChoiceButton
                key={opt}
                label={opt}
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
          fontSize: "1.02rem",
          fontWeight: 700,
          border: "none",
          cursor: selected ? "pointer" : "not-allowed",
          boxShadow: selected ? "0 8px 28px rgba(16,185,129,0.4)" : "none",
        }}
      >
        다음으로
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   주소 입력 스텝 (Daum Postcode API)
───────────────────────────────────────── */
interface AddressValue {
  zonecode: string;
  addr: string;
  detail: string;
}

function AddressStep({
  step,
  total,
  onBack,
  onNext,
  address,
  onAddressChange,
}: {
  step: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  address: AddressValue;
  onAddressChange: (v: AddressValue) => void;
}) {
  // 스크립트 로딩 완료 여부 — onload 콜백으로 정확하게 추적
  const [scriptReady, setScriptReady] = useState(
    !!(window as any).daum?.Postcode
  );

  useEffect(() => {
    if ((window as any).daum?.Postcode) {
      setScriptReady(true);
      return;
    }
    const existing = document.getElementById("kakao-postcode-script");
    if (existing) {
      // 이미 태그가 있으면 load 이벤트만 연결
      existing.addEventListener("load", () => setScriptReady(true));
      return;
    }
    const script = document.createElement("script");
    script.id = "kakao-postcode-script";
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => setScriptReady(true);
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
      theme: {
        bgColor: "#1a1d27",
        searchBgColor: "#222533",
        contentBgColor: "#1a1d27",
        pageBgColor: "#1a1d27",
        textColor: "#e2e8f0",
        queryTextColor: "#ffffff",
        postcodeTextColor: "#34d399",
        emphTextColor: "#34d399",
        outlineColor: "#2d3148",
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

      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full mb-7"
        style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", fontSize: "0.8rem", fontWeight: 600, color: "#34d399" }}>
        <Sparkles style={{ width: "14px", height: "14px" }} />
        AI 어시스턴트의 질문
      </div>

      <h2 className="mb-10"
        style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.2 }}>
        현재 매장이 위치한 지역은 어디인가요?
      </h2>

      <div className="space-y-3 mb-10">
        <div className="flex gap-2">
          <input readOnly value={address.zonecode} placeholder="우편번호"
            style={{ ...baseInput, width: "160px", flexShrink: 0 }} />
          <button
            onClick={openPostcode}
            disabled={!scriptReady}
            style={{
              height: "52px", padding: "0 22px", borderRadius: "12px", flexShrink: 0,
              background: scriptReady ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${scriptReady ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.1)"}`,
              color: scriptReady ? "#34d399" : "rgba(255,255,255,0.3)",
              fontSize: "0.92rem", fontWeight: 600,
              cursor: scriptReady ? "pointer" : "wait",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => scriptReady && (e.currentTarget.style.background = "rgba(16,185,129,0.28)")}
            onMouseLeave={(e) => scriptReady && (e.currentTarget.style.background = "rgba(16,185,129,0.15)")}
          >
            {scriptReady ? "주소 검색" : "로딩 중..."}
          </button>
        </div>

        <input readOnly value={address.addr}
          placeholder="주소 검색 버튼을 눌러 주소를 입력해 주세요"
          style={baseInput} />

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
          onFocus={(e) => { if (address.addr) { e.currentTarget.style.borderColor = "rgba(16,185,129,0.55)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.1)"; }}}
          onBlur={(e) => { e.currentTarget.style.borderColor = address.addr ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = "none"; }}
        />
      </div>

      <button onClick={onNext} disabled={!isValid}
        className="w-full h-[56px] rounded-2xl transition-all active:scale-[0.99]"
        style={{
          background: isValid ? "linear-gradient(135deg,#10b981,#34d399)" : "rgba(255,255,255,0.06)",
          color: isValid ? "white" : "rgba(255,255,255,0.25)",
          fontSize: "1.02rem", fontWeight: 700,
          border: "none", cursor: isValid ? "pointer" : "not-allowed",
          boxShadow: isValid ? "0 8px 28px rgba(16,185,129,0.4)" : "none",
        }}>
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
    <div
      className="flex flex-col items-center justify-center"
      style={{ ...PAGE_BG, minHeight: "100vh" }}
    >
      <div
        className="mb-8 flex items-center justify-center"
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(16,185,129,0.18)",
          border: "1px solid rgba(16,185,129,0.35)",
        }}
      >
        <Sparkles
          style={{ width: "38px", height: "38px", color: "#34d399" }}
          className="animate-pulse"
        />
      </div>
      <h2
        style={{
          fontSize: "1.6rem",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          marginBottom: "12px",
        }}
      >
        AI가 최적의 솔루션을 분석 중입니다
      </h2>
      <div
        className="flex items-center gap-2"
        style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.92rem" }}
      >
        <div
          className="w-4 h-4 rounded-full border-2 animate-spin"
          style={{
            borderColor: "rgba(16,185,129,0.5)",
            borderTopColor: "#34d399",
          }}
        />
        입력하신 데이터를 기반으로 리포트를 생성하고 있어요
        {"...".slice(0, dots)}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   원형 게이지 (SVG)
───────────────────────────────────────── */

type FlowState =
  | "analysisModeSelect"
  | "typeSelect"
  | "existingEntry"
  | "existingNotice"
  | "exCategorySelect"
  | "existingQuestions"
  | "deepPosInput"
  | "deepCategorySelect"
  | "deepQuestions"
  | "warningNew"
  | "detailedNew"
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q1ex"
  | "q2ex"
  | "q3ex"
  | "q4ex"
  | "q5ex"
  | "q6ex"
  | "q7ex"
  | "q8ex"
  | "q9ex"
  | "q10ex"
  | "q11ex"
  | "q12ex"
  | "q13ex"
  | "q14ex"
  | "q15ex"
  | "q16ex"
  | "q17ex"
  | "evaluating"
  | "dynamicQ"
  | "loading"
  | "result"
  | "ownerMain";

type ChoiceFlowState = Exclude<
  FlowState,
  | "analysisModeSelect"
  | "typeSelect"
  | "existingEntry"
  | "existingNotice"
  | "exCategorySelect"
  | "existingQuestions"
  | "deepPosInput"
  | "deepCategorySelect"
  | "deepQuestions"
  | "warningNew"
  | "detailedNew"
  | "q2ex"
  | "evaluating"
  | "dynamicQ"
  | "loading"
  | "result"
  | "ownerMain"
>;

type ExistingQuestion = {
  question: string;
  options?: string[];
  answerKey?: string;
  type: "choice" | "address";
  category?: string;
};

/** AI가 동적으로 생성하는 추가 질문 형식 */
type GeneratedQuestion = {
  key: string;
  category: string;
  question: string;
  options: string[];
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
  {
    type: "choice",
    question: "가장 큰 경영 고민은 무엇인가요?",
    options: CURRENT_CHALLENGES,
    answerKey: "challenge",
  },
];

const EXISTING_CATEGORY_QUESTION_MAP: Record<string, ExistingQuestion[]> = {
  "매출 성과": [],
  "마케팅 역량": [],
  "단골 확보": [],
  "평판 관리": [],
  "가격 경쟁력": [],
  "운영 효율": [],
};

const DEEP_CATEGORY_QUESTION_MAP: Record<string, ExistingQuestion[]> = {
  "매출 성과": [],
  "마케팅 역량": [],
  "단골 확보": [],
  "평판 관리": [],
  "가격 경쟁력": [],
  "운영 효율": [],
};

export function AIAnalysisPage() {
  const [flow, setFlow] = useState<FlowState>("typeSelect");
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("light");
  const [userType, setUserType] = useState<"new" | "existing">("new");
  const [existingEntryExpanded, setExistingEntryExpanded] = useState<string[]>(
    [],
  );
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [addrQ2ex, setAddrQ2ex] = useState<AddressValue>(INITIAL_ADDRESS);
  const [selectedExistingCategories, setSelectedExistingCategories] = useState<
    string[]
  >([]);
  const [selectedDeepCategories, setSelectedDeepCategories] = useState<
    string[]
  >([]);
  const [existingQuestionIndex, setExistingQuestionIndex] = useState(0);
  const [deepQuestionIndex, setDeepQuestionIndex] = useState(0);
  const [posInputMode, setPosInputMode] = useState<"manual" | "csv">("manual");
  const [posMetrics, setPosMetrics] = useState<PosMetrics>(INITIAL_POS_METRICS);
  const [posInputError, setPosInputError] = useState("");
  const [csvError, setCsvError] = useState("");
  const [aiResult, setAiResult] = useState<AiAnalysisResult | null>(null);
  const [aiError, setAiError] = useState(false);
  const [bizinfoData, setBizinfoData] = useState<BizinfoContext | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [dynamicQIndex, setDynamicQIndex] = useState(0);
  const [dynamicQRound, setDynamicQRound] = useState(0); // 최대 2라운드
  const MAX_DYNAMIC_ROUNDS = 2;

  const deepDataFields = useMemo(() => {
    const map = new Map<
      keyof PosMetrics,
      { key: keyof PosMetrics; label: string }
    >();
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

  const [selectedMain, setSelectedMain] = useState<string>("");
  const [selectedSub, setSelectedSub] = useState<string>("");

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

  /* evaluating: 6개 고정 답변 충분성 판단 → 충분하면 loading, 부족하면 dynamicQ */
  useEffect(() => {
    if (flow !== "evaluating") return;

    // 최대 2라운드 초과 시 추가 질문 없이 바로 분석 진행
    if (dynamicQRound >= MAX_DYNAMIC_ROUNDS) {
      setFlow("loading");
      return;
    }

    let cancelled = false;

    fetch("http://localhost:8080/api/analysis/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...answers, _userType: userType }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.status === "needs_more" && Array.isArray(data.questions) && data.questions.length > 0) {
          setGeneratedQuestions(data.questions as GeneratedQuestion[]);
          setDynamicQIndex(0);
          setFlow("dynamicQ");
        } else {
          setFlow("loading");
        }
      })
      .catch(() => {
        if (!cancelled) setFlow("loading"); // 오류 시 그냥 분석 진행
      });

    return () => { cancelled = true; };
  }, [flow]);

  /* 자동 로딩 → 결과 전환 */
  useEffect(() => {
    if (flow !== "loading") return;
    let cancelled = false;

    const minDelay = new Promise<void>((res) => setTimeout(res, 2800));

    const apiCall = userType === "new"
      ? fetch("http://localhost:8080/api/analysis/new", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(answers),
        })
          .then((r) => r.json())
          .then((data) => {
            if (cancelled) return;
            if (data.report) {
              try {
                setAiResult(JSON.parse(data.report) as AiAnalysisResult);
              } catch {
                setAiError(true);
              }
            } else if (data.error) {
              setAiError(true);
            }
          })
          .catch(() => { if (!cancelled) setAiError(true); })
      : Promise.resolve();

    // 신생 창업자 - SMES 정부 지원사업 병렬 로딩
    const smesCall = userType === "new"
      ? fetch(`http://localhost:8080/api/support/programs?bizType=${encodeURIComponent((answers["bizType"] as string) || "")}`)
          .then((r) => r.json())
          .then((data) => {
            if (!cancelled && Array.isArray(data.programs) && data.programs.length > 0) {
              setBizinfoData({ items: data.programs, total: data.total ?? data.programs.length });
            }
          })
          .catch(() => {})
      : Promise.resolve();

    Promise.all([minDelay, apiCall, smesCall]).then(() => {
      if (!cancelled) setFlow("result");
    });

    return () => { cancelled = true; };
  }, [flow]);

  const ans = (key: string): string => (answers[key] as string) || "";
  const set = (key: string, val: string) =>
    setAnswers((prev) => ({ ...prev, [key]: val }));
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
    setGeneratedQuestions([]);
    setDynamicQIndex(0);
    setDynamicQRound(0);
    setBizinfoData(null);
  };
  const startFlow = (type: "new" | "existing") => {
    resetAnswers();
    setUserType(type);
    if (type === "new") {
      setFlow("warningNew");
      return;
    }
    setFlow("existingEntry");
  };

  const parsePercent = (v: string) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
  };

  const validatePosMetrics = (metrics: PosMetrics): string | null => {
    const requiredKeys = deepDataFields.map((field) => field.key);
    if (requiredKeys.length === 0)
      return "카테고리 선택 후 관련 데이터를 입력해주세요.";
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

  if (flow === "existingEntry") {
    return (
      <ExistingOwnerEntryView
        onBack={() => setFlow("typeSelect")}
        onStartAnalysis={() => setFlow("analysisModeSelect")}
        expanded={existingEntryExpanded}
        onToggleExpanded={(title) =>
          setExistingEntryExpanded((prev) =>
            prev.includes(title)
              ? prev.filter((v) => v !== title)
              : [...prev, title],
          )
        }
        pageBgStyle={PAGE_BG}
      />
    );
  }

  if (flow === "analysisModeSelect") {
    return (
      <ExistingOwnerAnalysisModeSelectView
        onBack={() =>
          setFlow(userType === "existing" ? "existingEntry" : "typeSelect")
        }
        onSelectMode={(mode) => {
          setAnalysisMode(mode);
          setAnswers((prev) => ({ ...prev, analysisMode: mode }));
          setFlow("existingNotice");
        }}
        pageBgStyle={PAGE_BG}
      />
    );
  }

  /* ── 충분성 판단 중 ── */
  if (flow === "evaluating") return (
    <div className="flex flex-col items-center justify-center" style={{ background: "#141720", minHeight: "100vh", color: "white" }}>
      <div className="mb-6 flex items-center justify-center"
        style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
        <Sparkles style={{ width: "32px", height: "32px", color: "#34d399" }} className="animate-pulse" />
      </div>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "10px" }}>
        AI가 입력 정보를 검토하고 있어요
      </h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
        분석에 필요한 정보가 충분한지 확인 중이에요
      </p>
    </div>
  );

  /* ── AI 동적 추가 질문 ── */
  if (flow === "dynamicQ") {
    const currentQ = generatedQuestions[dynamicQIndex];
    if (!currentQ) {
      setFlow("evaluating");
      return null;
    }
    return (
      <div style={{ background: "#141720", minHeight: "100vh" }}>
        {/* 라운드 표시 배지 */}
        <div style={{ textAlign: "center", paddingTop: "20px" }}>
          <span style={{
            display: "inline-block", padding: "4px 14px", borderRadius: "999px",
            background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
            fontSize: "0.75rem", fontWeight: 600, color: "#34d399",
          }}>
            AI 추가 질문 {dynamicQRound + 1} / {MAX_DYNAMIC_ROUNDS} 라운드
          </span>
        </div>
        <QuestionStep
          step={dynamicQIndex + 1}
          total={generatedQuestions.length}
          question={currentQ.question}
          options={currentQ.options}
          selected={(answers[currentQ.key] as string) || ""}
          onSelect={(val) => setAnswers((prev) => ({ ...prev, [currentQ.key]: val }))}
          onBack={() => {
            if (dynamicQIndex === 0) {
              setFlow("detailedNew");
            } else {
              setDynamicQIndex((i) => i - 1);
            }
          }}
          onNext={() => {
            if (dynamicQIndex < generatedQuestions.length - 1) {
              setDynamicQIndex((i) => i + 1);
            } else {
              setDynamicQRound((r) => r + 1); // 라운드 증가
              setFlow("evaluating"); // 마지막 질문 완료 → 재평가
            }
          }}
        />
      </div>
    );
  }

  /* ── 로딩 ── */
  if (flow === "loading") return <LoadingScreen />;

  /* ── 결과 ── */
  const handleReset = () => {
    resetAnswers();
    setUserType("new");
    setAnalysisMode("light");
    setAiResult(null);
    setAiError(false);
    setBizinfoData(null);
    setFlow("typeSelect");
  };
  const handleExistingMain = () => {
    resetAnswers();
    setUserType("existing");
    setAnalysisMode("light");
    setAiResult(null);
    setAiError(false);
    setFlow("existingEntry");
  };
  const handleSwitchToExisting = () => startFlow("existing");
  if (flow === "ownerMain") {
    return <ExistingOwnerMainPage />;
  }
  if (flow === "result" && userType === "existing")
    return (
      <ExistingResultReport
        answers={answers}
        onReset={handleExistingMain}
        onGoMain={() => setFlow("ownerMain")}
        selectedCategories={
          analysisMode === "deep"
            ? selectedDeepCategories
            : selectedExistingCategories
        }
      />
    );
  if (flow === "result")
    return (
      <NewResultReport
        answers={answers}
        aiResult={aiResult}
        aiError={aiError}
        bizinfoData={bizinfoData}
        onReset={handleReset}
        onSwitchToExisting={handleSwitchToExisting}
      />
    );

  /* ── 설문 스텝 (신생 창업자) ── */
  if (flow === "warningNew")
    return (
      <div style={PAGE_BG}>
        <div className="min-h-screen flex flex-col items-center justify-start pt-24 px-4">
          <div className="w-full max-w-xl">
            <div className="flex items-center mb-12">
              <button
                onClick={() => setFlow("typeSelect")}
                className="flex items-center gap-1 text-sm font-medium"
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)" }}
              >
                <ChevronLeft className="w-4 h-4" /> 이전
              </button>
            </div>

            {/* 브랜드 */}
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

            {/* 경고 제목 */}
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: "#f97316" }} />
              <h2 className="text-xl font-black text-white">잠깐! 창업 전 꼭 체크해 보세요.</h2>
            </div>

            {/* 경고 박스 */}
            <div className="rounded-2xl p-6 mb-8"
              style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)" }}>
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
              onClick={() => setFlow("detailedNew")}
              className="w-full h-14 rounded-2xl font-bold text-white transition-all"
              style={{
                background: "linear-gradient(135deg,#10b981,#34d399)",
                boxShadow: "0 8px 28px rgba(16,185,129,0.4)",
                border: "none", cursor: "pointer",
              }}
            >
              확인했습니다
            </button>
          </div>
        </div>
      </div>
    );

  if (flow === "detailedNew")
    return (
      <DetailedStartupQuestionnaire
        onBack={() => setFlow("warningNew")}
        onComplete={(detailedAnswers) => {
          setAnswers((prev) => ({ ...prev, ...detailedAnswers }));
          setFlow("evaluating"); // 고정 질문 완료 → 충분성 판단
        }}
      />
    );

  const existingOwnerFlowView = ExistingOwnerFlowViews({
    flow,
    analysisMode,
    PAGE_BG,
    TopBar,
    QuestionStep,
    AddressStep,
    EXISTING_CATEGORY_OPTIONS,
    EXISTING_CATEGORY_VISUALS,
    DEEP_CATEGORY_DATA_FIELDS: DEEP_CATEGORY_DATA_FIELDS as any,
    selectedExistingCategories,
    setSelectedExistingCategories,
    selectedDeepCategories,
    setSelectedDeepCategories,
    setFlow,
    setAnswers,
    setExistingQuestionIndex,
    existingQuestionFlow,
    existingQuestionIndex,
    ans,
    set,
    addrQ2ex,
    setAddrQ2ex,
    setDeepQuestionIndex,
    deepQuestionFlow,
    deepQuestionIndex,
    posInputMode,
    setPosInputMode,
    csvError,
    posInputError,
    posMetrics: posMetrics as any,
    setPosMetrics: setPosMetrics as any,
    setPosInputError,
    setCsvError,
    handlePosCsvUpload,
    validatePosMetrics: validatePosMetrics as any,
  });
  if (existingOwnerFlowView) return existingOwnerFlowView;

  /* ── 유형 선택 화면 ── */
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ ...PAGE_BG, position: "relative" }}
    >
      {/* 상단 글로우 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(16,185,129,0.07) 0%, transparent 60%)",
        }}
      />

      {/* 로고 */}
      <Link to="/" className="flex items-center gap-2.5 mb-14 relative">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}
        >
          <Store className="w-[18px] h-[18px] text-white" />
        </div>
        <span
          className="text-white"
          style={{
            fontSize: "1.1rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          소상<span style={{ color: "#f97316" }}>광장</span>
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 500,
              color: "rgba(255,255,255,0.35)",
              marginLeft: "8px",
            }}
          >
            AI 맞춤 분석
          </span>
        </span>
      </Link>

      <div className="relative w-full" style={{ maxWidth: "740px" }}>
        {/* AI 뱃지 */}
        <div className="flex justify-center mb-5">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.3)",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#34d399",
            }}
          >
            <Sparkles style={{ width: "14px", height: "14px" }} />
            맞춤형 AI 분석을 위해 가장 알맞은 유형을 알려주세요
          </div>
        </div>

        <h1
          className="text-center mb-3"
          style={{
            fontSize: "clamp(1.9rem, 5vw, 3rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
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
                <svg
                  viewBox="0 0 24 24"
                  width="28"
                  height="28"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  <path d="M19 8h2m-1-1v2" />
                </svg>
              ),
              title: "신생 창업자",
              desc: "처음 가게를 시작하려고 준비 중입니다. 업종, 위치, 비용 등 전반적인 가이드가 필요해요.",
              nextFlow: "warningNew" as FlowState,
            },
            {
              key: "existing" as const,
              icon: (
                <svg
                  viewBox="0 0 24 24"
                  width="28"
                  height="28"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
              ),
              title: "기존 사장님",
              desc: "이미 가게를 운영 중입니다. 매출 상승, 마케팅, 트렌드 분석 등 운영 전략이 필요해요.",
              nextFlow: "q1ex" as FlowState,
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
                  e.currentTarget.style.border =
                    "1px solid rgba(16,185,129,0.4)";
                  e.currentTarget.style.background = "rgba(16,185,129,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border =
                    "1px solid rgba(255,255,255,0.1)";
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

                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    marginBottom: "10px",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.7,
                  }}
                >
                  {card.desc}
                </p>
              </button>
            );
          })}
        </div>

        <p
          className="text-center mt-8"
          style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.2)" }}
        >
          입력하신 정보는 분석 목적으로만 활용되며 저장되지 않습니다.
        </p>
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { ChevronLeft, Sparkles, ChevronDown } from "lucide-react";
import sigunguData from "./sigungu.json";

/* ── 스타일 상수 ── */
const PAGE_BG: React.CSSProperties = {
  minHeight: "100vh",
  background: "#141720",
  color: "white",
  fontFamily: "'Noto Sans KR', sans-serif",
};

/* ── 질문 데이터 ── */
const QUESTIONS = [
  {
    key: "readyStage",
    category: "현재 준비 단계",
    question: "현재 어느 정도까지 준비되셨나요?",
    options: [
      "아이디어만 있어요",
      "업종은 정했어요",
      "상권을 찾는 중이에요",
      "자금 계획을 세우는 중이에요",
      "오픈 준비 직전이에요",
    ],
    multi: false,
    type: "choice",
  },
  {
    key: "bizType",
    category: "업종",
    question: "어떤 업종을 생각하고 계신가요?",
    options: [
      "음식점",
      "카페",
      "디저트",
      "배달전문",
      "소매/판매",
      "서비스업",
      "온라인 판매",
      "아직 고민 중이에요",
    ],
    multi: false,
    type: "choice",
  },
  {
    key: "opType",
    category: "운영 형태",
    question: "어떤 방식으로 운영하고 싶으신가요?",
    options: [
      "오프라인 매장",
      "배달전문",
      "포장전문",
      "온라인 중심",
      "매장+배달 혼합형",
      "아직 미정이에요",
    ],
    multi: false,
    type: "choice",
  },
  {
    key: "region",
    category: "지역",
    question: "어느 지역을 고려하고 계신가요?",
    options: [],
    multi: false,
    type: "address",
  },
  {
    key: "areaType",
    category: "상권 유형",
    question: "어떤 상권을 생각하고 계신가요?",
    options: [
      "대학가",
      "오피스 상권",
      "주거지역",
      "역세권",
      "관광지",
      "복합상권",
      "아직 미정이에요",
    ],
    multi: false,
    type: "choice",
  },
  {
    key: "target",
    category: "주요 고객층",
    question: "주요 고객층은 어떻게 생각하고 계신가요?",
    options: [
      "10~20대",
      "20~30대 직장인",
      "1인 가구",
      "가족 단위",
      "관광객",
      "시니어층",
      "아직 미정이에요",
    ],
    multi: false,
    type: "choice",
  },
  {
    key: "priceRange",
    category: "가격대",
    question: "판매 가격대는 어느 정도로 생각하고 계신가요?",
    options: ["저가", "중저가", "중가", "중고가", "고가", "아직 미정이에요"],
    multi: false,
    type: "choice",
  },
  {
    key: "budget",
    category: "창업 예산",
    question: "예상 창업 예산은 어느 정도인가요?",
    options: [
      "1천만 원 이하",
      "1천만~3천만 원",
      "3천만~7천만 원",
      "7천만~1억 원",
      "1억 원 이상",
      "아직 미정이에요",
    ],
    multi: false,
    type: "choice",
  },
  {
    key: "experience",
    category: "경험 여부",
    question: "관련 업종 경험이 있으신가요?",
    options: [
      "경험이 없어요",
      "아르바이트 경험이 있어요",
      "유사업종 근무 경험이 있어요",
      "직접 운영해본 적 있어요",
    ],
    multi: false,
    type: "choice",
  },
  {
    key: "headcount",
    category: "운영 인원",
    question: "몇 명이 함께 운영할 계획이신가요?",
    options: [
      "1인 운영",
      "가족 운영",
      "2~3인 운영",
      "직원 채용 예정",
      "아직 미정이에요",
    ],
    multi: false,
    type: "choice",
  },
  {
    key: "opHours",
    category: "운영 시간대",
    question: "주로 어떤 시간대에 운영할 계획이신가요?",
    options: [
      "아침 중심",
      "점심 중심",
      "저녁 중심",
      "야간 중심",
      "종일 운영",
      "아직 미정이에요",
    ],
    multi: false,
    type: "choice",
  },
  {
    key: "priority",
    category: "우선순위",
    question: "창업에서 가장 중요하게 생각하는 것은 무엇인가요?",
    options: [
      "수익성",
      "안정성",
      "운영 편의성",
      "성장 가능성",
      "초기 비용 절감",
      "워라밸",
      "브랜드성",
    ],
    multi: true,
    type: "choice",
  },
  {
    key: "purpose",
    category: "창업 목적",
    question: "창업 목적은 어떤 쪽에 가까우신가요?",
    options: [
      "생계형 창업",
      "부수입 창출",
      "장기 운영 목적",
      "빠른 시장 진입",
      "브랜드 확장 목표",
      "아직 잘 모르겠어요",
    ],
    multi: false,
    type: "choice",
  },
  {
    key: "storeSize",
    category: "점포 규모/형태",
    question: "점포는 어떤 형태를 생각하고 계신가요?",
    options: [
      "무점포",
      "소형 매장",
      "중형 매장",
      "대형 매장",
      "아직 미정이에요",
    ],
    multi: false,
    type: "choice",
  },
  {
    key: "marketing",
    category: "홍보 가능 수준",
    question: "초기 홍보는 어느 정도 가능하신가요?",
    options: [
      "SNS 운영 가능",
      "블로그/리뷰 관리 가능",
      "광고 집행 가능",
      "오프라인 홍보 가능",
      "자신 없어요",
    ],
    multi: false,
    type: "choice",
  },
  {
    key: "diff",
    category: "차별화 요소",
    question: "차별화 포인트는 어떤 쪽을 생각하고 계신가요?",
    options: [
      "가격 경쟁력",
      "메뉴/상품 차별화",
      "인테리어 감성",
      "빠른 서비스",
      "배달 편의성",
      "아직 없어요",
    ],
    multi: false,
    type: "choice",
  },
] as const;

const TOTAL = QUESTIONS.length;

/* ── 주소 타입 ── */
interface AddressValue {
  sido: string;
  sigungu: string;
}

/* ── props ── */
interface Props {
  onBack: () => void;
  onComplete: (answers: Record<string, string | string[]>) => void;
}

export function DetailedStartupQuestionnaire({ onBack, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [address, setAddress] = useState<AddressValue>({ sido: "", sigungu: "" });

  const q = QUESTIONS[step];
  const stepNum = step + 1;

  const setVal = (key: string, val: string | string[]) => setAnswers(prev => ({ ...prev, [key]: val }));

  const toggleMulti = (key: string, opt: string) => {
    const cur = (answers[key] as string[]) ?? [];
    const next = cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt];
    setVal(key, next);
  };

  const isValid = () => {
    if (q.type === "address") return !!address.sido;
    if (q.multi) return ((answers[q.key] as string[]) ?? []).length > 0;
    return !!(answers[q.key] as string);
  };

  const handleNext = () => {
    if (q.type === "address") {
      setVal("region", address.sigungu ? `${address.sido} ${address.sigungu}` : address.sido);
    }
    if (step < TOTAL - 1) {
      setStep(s => s + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (step === 0) onBack();
    else setStep(s => s - 1);
  };

  return (
    <div style={PAGE_BG}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px" }}>
        {/* 상단 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 transition-all"
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: "0.88rem" }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          >
            <ChevronLeft style={{ width: 16, height: 16 }} /> 이전으로
          </button>
          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>
            {stepNum} / {TOTAL}
          </span>
        </div>

        {/* 프로그레스 바 */}
        <div className="mb-10">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(stepNum / TOTAL) * 100}%`, background: "linear-gradient(90deg,#10b981,#34d399)" }}
            />
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full mb-4"
          style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", fontSize: "0.8rem", fontWeight: 600, color: "#34d399" }}
        >
          <Sparkles style={{ width: 14, height: 14 }} />
          AI 어시스턴트의 질문
        </div>
        {q.category && (
          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
            {q.category}
          </p>
        )}
        <h2 className="mb-8" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.3 }}>
          {q.question}
        </h2>
        {q.multi && (
          <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", marginBottom: "16px" }}>복수 선택 가능</p>
        )}
        {q.type === "address" ? (
          <AddressInput address={address} onChange={setAddress} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {q.options.map(opt => {
              const selected = q.multi
                ? ((answers[q.key] as string[]) ?? []).includes(opt)
                : answers[q.key] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => q.multi ? toggleMulti(q.key, opt) : setVal(q.key, opt)}
                  className="w-full text-left transition-all active:scale-[0.98]"
                  style={{
                    padding: "16px 20px",
                    borderRadius: "14px",
                    border: selected ? "1.5px solid #10b981" : "1px solid rgba(255,255,255,0.1)",
                    background: selected ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)",
                    color: selected ? "#34d399" : "rgba(255,255,255,0.65)",
                    fontSize: "0.95rem",
                    fontWeight: selected ? 600 : 400,
                    cursor: "pointer",
                    boxShadow: selected ? "0 0 0 1px rgba(16,185,129,0.3)" : "none",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          disabled={!isValid()}
          className="w-full h-14 rounded-2xl transition-all active:scale-[0.99] mt-6"
          style={{
            background: isValid() ? "linear-gradient(135deg,#10b981,#34d399)" : "rgba(255,255,255,0.06)",
            color: isValid() ? "white" : "rgba(255,255,255,0.25)",
            fontSize: "1rem",
            fontWeight: 700,
            border: "none",
            cursor: isValid() ? "pointer" : "not-allowed",
            boxShadow: isValid() ? "0 8px 28px rgba(16,185,129,0.4)" : "none",
          }}
        >
          {step < TOTAL - 1 ? "다음으로" : "분석 시작"}
        </button>
      </div>
    </div>
  );
}

/* ── 주소 드롭다운 컴포넌트 ── */
function AddressInput({ address, onChange }: { address: AddressValue; onChange: (v: AddressValue) => void }) {
  const keys = Object.keys(sigunguData) as (keyof typeof sigunguData)[];

  const sidoList = useMemo(() => [...new Set(keys.map(k => k.split("/")[0]))].sort(), []);
  const sigunguList = useMemo(
    () => address.sido ? keys.filter(k => k.startsWith(address.sido + "/")).map(k => k.split("/")[1]).sort() : [],
    [address.sido]
  );

  const selectStyle: React.CSSProperties = {
    width: "100%", height: 52, padding: "0 16px",
    borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)", color: "white",
    fontSize: "0.95rem", outline: "none", cursor: "pointer",
    appearance: "none", WebkitAppearance: "none",
  };

  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* 시/도 */}
      <div className="relative">
        <select
          value={address.sido}
          onChange={e => onChange({ sido: e.target.value, sigungu: "" })}
          style={{ ...selectStyle, color: address.sido ? "white" : "rgba(255,255,255,0.4)", colorScheme: "dark" }}
        >
          <option value="" disabled style={{ background: "#1e2330" }}>시/도 선택</option>
          {sidoList.map(s => (
            <option key={s} value={s} style={{ background: "#1e2330", color: "white" }}>{s}</option>
          ))}
        </select>
        <ChevronDown style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
      </div>

      {/* 시/군/구 */}
      <div className="relative">
        <select
          value={address.sigungu}
          onChange={e => onChange({ ...address, sigungu: e.target.value })}
          disabled={!address.sido}
          style={{ ...selectStyle, color: address.sigungu ? "white" : "rgba(255,255,255,0.4)", opacity: address.sido ? 1 : 0.4, colorScheme: "dark" }}
        >
          <option value="" disabled style={{ background: "#1e2330" }}>시/군/구 선택</option>
          {sigunguList.map(s => (
            <option key={s} value={s} style={{ background: "#1e2330", color: "white" }}>{s}</option>
          ))}
        </select>
        <ChevronDown style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

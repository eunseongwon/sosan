import { useState, useMemo } from "react";
import { ChevronLeft, Sparkles, ChevronDown } from "lucide-react";
import sigunguData from "./sigungu.json";
import question1Data from "./Question1.json";

const PAGE_BG: React.CSSProperties = {
  minHeight: "100vh",
  background: "#141720",
  color: "white",
  fontFamily: "'Noto Sans KR', sans-serif",
};

const QUESTIONS = [
  {
    key: "bizType",
    category: "업종",
    question: "",
    options: [] as string[],
    multi: false,
    type: "bizTypeSelect" as const,
  },
  {
    key: "opType",
    category: "운영 형태",
    question: "어떤 방식으로 운영하고 싶으신가요?",
    options: ["매장전문", "배달전문", "포장전문", "매장+배달 혼합형", "아직 미정이에요"],
    multi: false,
    type: "choice" as const,
  },
  {
    key: "region",
    category: "지역",
    question: "어느 지역을 고려하고 계신가요?",
    options: [] as string[],
    multi: false,
    type: "address" as const,
  },
  {
    key: "areaType",
    category: "상권 유형",
    question: "어떤 상권을 생각하고 계신가요?",
    options: ["대학가", "오피스 상권", "주거지역", "역세권", "관광지", "복합상권", "아직 미정이에요"],
    multi: false,
    type: "choice" as const,
  },
  {
    key: "budget",
    category: "창업 예산",
    question: "예상 창업 예산은 어느 정도인가요?",
    options: ["1천만 원 이하", "1천만~3천만 원", "3천만~7천만 원", "7천만~1억 원", "1억 원 이상", "아직 미정이에요"],
    multi: false,
    type: "choice" as const,
  },
  {
    key: "storeSize",
    category: "점포 규모/형태",
    question: "점포는 어떤 형태를 생각하고 계신가요?",
    options: ["무점포", "소형 매장", "중형 매장", "대형 매장", "아직 미정이에요"],
    multi: false,
    type: "choice" as const,
  },
];

const TOTAL = QUESTIONS.length;

interface AddressValue {
  sido: string;
  sigungu: string;
}

interface Props {
  onBack: () => void;
  onComplete: (answers: Record<string, string | string[]>) => void;
}

const Q1 = question1Data as Record<string, { question: string; options: string[] }>;

export function DetailedStartupQuestionnaire({ onBack, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [address, setAddress] = useState<AddressValue>({ sido: "", sigungu: "" });

  const [bizStep, setBizStep] = useState<0 | 1>(0);
  const [bizCategory, setBizCategory] = useState("");
  const [bizCustom, setBizCustom] = useState("");
  const [bizSubCustom, setBizSubCustom] = useState("");

  const q = QUESTIONS[step];
  const stepNum = step + 1;

  const setVal = (key: string, val: string | string[]) =>
    setAnswers(prev => ({ ...prev, [key]: val }));

  const isBizValid = () => {
    if (bizStep === 0) {
      if (!bizCategory) return false;
      if (bizCategory === "기타") return bizCustom.trim().length > 0;
      return true;
    }
    const sub = answers["bizSubType"] as string;
    if (!sub) return false;
    const isSubEtc = sub === "기타" || sub.startsWith("기타");
    if (isSubEtc) return bizSubCustom.trim().length > 0;
    return true;
  };

  const isValid = () => {
    if (q.type === "bizTypeSelect") return isBizValid();
    if (q.type === "address") return !!address.sido;
    return !!(answers[q.key] as string);
  };

  const handleBizNext = () => {
    if (bizStep === 0) {
      if (bizCategory === "기타") {
        setVal("bizType", bizCustom.trim());
        setStep(s => s + 1);
        return;
      }
      if (Q1[bizCategory]) {
        setBizStep(1);
      } else {
        setVal("bizType", bizCategory);
        setStep(s => s + 1);
      }
    } else {
      const sub = answers["bizSubType"] as string;
      const isSubEtc = sub === "기타" || sub.startsWith("기타");
      const finalSub = isSubEtc ? bizSubCustom.trim() : sub;
      setVal("bizType", `${bizCategory} > ${finalSub}`);
      setStep(s => s + 1);
    }
  };

  const handleBizBack = () => {
    if (bizStep === 1) {
      setBizStep(0);
      setVal("bizSubType", "");
      setBizSubCustom("");
    } else {
      setStep(s => s - 1);
    }
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

  /* ── 업종 2단계 선택 ── */
  if (q.type === "bizTypeSelect") {
    const rootQ = Q1["root"];
    const subQ = bizStep === 1 ? Q1[bizCategory] : null;
    const currentQ = subQ ?? rootQ;
    const isEtcSelected =
      bizStep === 0
        ? bizCategory === "기타"
        : (answers["bizSubType"] as string)?.startsWith("기타") || answers["bizSubType"] === "기타";

    return (
      <div style={PAGE_BG}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px" }}>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={bizStep === 1 ? handleBizBack : handleBack}
              className="flex items-center gap-1.5 transition-all"
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: "0.88rem" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
            >
              <ChevronLeft style={{ width: 16, height: 16 }} /> 이전으로
            </button>
            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>{stepNum} / {TOTAL}</span>
          </div>
          <div className="mb-10">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(stepNum / TOTAL) * 100}%`, background: "linear-gradient(90deg,#10b981,#34d399)" }}
              />
            </div>
          </div>
          <div
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full mb-4"
            style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", fontSize: "0.8rem", fontWeight: 600, color: "#34d399" }}
          >
            <Sparkles style={{ width: 14, height: 14 }} /> AI 어시스턴트의 질문
          </div>
          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
            업종
          </p>
          <h2 className="mb-8" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.3 }}>
            {currentQ.question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {currentQ.options.map(opt => {
              const isSelected = bizStep === 0 ? bizCategory === opt : answers["bizSubType"] === opt;
              const isEtcOpt = opt === "기타" || opt.startsWith("기타");
              return (
                <button
                  key={opt}
                  onClick={() => {
                    if (bizStep === 0) { setBizCategory(opt); setBizCustom(""); }
                    else { setVal("bizSubType", opt); setBizSubCustom(""); }
                  }}
                  className="w-full text-left transition-all active:scale-[0.98]"
                  style={{
                    padding: "16px 20px", borderRadius: "14px",
                    border: isSelected ? "1.5px solid #10b981" : "1px solid rgba(255,255,255,0.1)",
                    background: isSelected ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)",
                    color: isSelected ? "#34d399" : "rgba(255,255,255,0.65)",
                    fontSize: "0.95rem", fontWeight: isSelected ? 600 : 400, cursor: "pointer",
                    boxShadow: isSelected ? "0 0 0 1px rgba(16,185,129,0.3)" : "none",
                  }}
                >
                  {opt}{isEtcOpt ? " (직접 입력)" : ""}
                </button>
              );
            })}
          </div>

          {isEtcSelected && (
            <input
              autoFocus
              value={bizStep === 0 ? bizCustom : bizSubCustom}
              onChange={e => bizStep === 0 ? setBizCustom(e.target.value) : setBizSubCustom(e.target.value)}
              placeholder="업종을 직접 입력해주세요"
              className="w-full mb-4"
              style={{
                height: 52, padding: "0 16px", borderRadius: 12,
                border: "1.5px solid rgba(16,185,129,0.4)",
                background: "rgba(16,185,129,0.06)", color: "white",
                fontSize: "0.95rem", outline: "none",
              }}
            />
          )}

          <button
            onClick={handleBizNext}
            disabled={!isBizValid()}
            className="w-full h-14 rounded-2xl transition-all active:scale-[0.99] mt-2"
            style={{
              background: isBizValid() ? "linear-gradient(135deg,#10b981,#34d399)" : "rgba(255,255,255,0.06)",
              color: isBizValid() ? "white" : "rgba(255,255,255,0.25)",
              fontSize: "1rem", fontWeight: 700, border: "none",
              cursor: isBizValid() ? "pointer" : "not-allowed",
              boxShadow: isBizValid() ? "0 8px 28px rgba(16,185,129,0.4)" : "none",
            }}
          >
            {bizStep === 0 && bizCategory && bizCategory !== "기타" ? "세부 업종 선택하기" : "다음으로"}
          </button>
        </div>
      </div>
    );
  }

  /* ── 일반 질문 ── */
  return (
    <div style={PAGE_BG}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px" }}>
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
          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>{stepNum} / {TOTAL}</span>
        </div>

        <div className="mb-10">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(stepNum / TOTAL) * 100}%`, background: "linear-gradient(90deg,#10b981,#34d399)" }}
            />
          </div>
        </div>

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

        {q.type === "address" ? (
          <AddressInput address={address} onChange={setAddress} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {q.options.map(opt => {
              const selected = answers[q.key] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setVal(q.key, opt)}
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

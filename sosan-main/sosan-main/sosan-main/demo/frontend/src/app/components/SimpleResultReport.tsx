import { useState } from "react";
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, TrendingUp, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";

/* ── 타입 ── */
interface Props {
  answers: Record<string, string | string[]>;
  onReset: () => void;
  onDetailedAnalysis: () => void;
}

/* ── 더미 추천 데이터 ── */
const DUMMY_RECOMMENDATIONS = [
  {
    rank: 1,
    category: "무인 카페 / 스터디 카페",
    emoji: "☕",
    matchScore: 92,
    tags: ["저감정 노동", "시스템 운영 가능", "안정적 수익"],
    summary: "운영 관리 중심의 성향과 시스템 운영 희망에 최적화된 업종입니다. 한번 세팅 이후 무인 운영이 가능하며 감정 노동 부담이 낮습니다.",
    pros: [
      "감정 노동 거의 없음",
      "한 번 세팅 후 무인 운영 가능",
      "안정적인 월 고정 수익 기대",
      "24시간 운영으로 매출 극대화",
    ],
    cons: [
      "초기 인테리어 및 기기 비용 높음",
      "상권 선정이 수익에 결정적 영향",
      "음료 품질 경쟁력 확보 필요",
    ],
    budgetRange: "5,000만 ~ 1억 2,000만 원",
    roi: "월 순수익 300~600만 원 (예상)",
    difficulty: "중",
  },
  {
    rank: 2,
    category: "배달 전문 도시락 / 밀키트",
    emoji: "🍱",
    matchScore: 85,
    tags: ["소자본 가능", "비대면 중심", "온라인 확장성"],
    summary: "비대면 선호 성향과 소자본 창업 조건에 맞는 업종입니다. 배달 플랫폼을 통한 온라인 판매로 초기 임대료 부담을 크게 줄일 수 있습니다.",
    pros: [
      "오프라인 매장 없이 시작 가능",
      "초기 투자비용 낮음",
      "SNS 마케팅과 시너지 높음",
      "레시피 개발 시 차별화 용이",
    ],
    cons: [
      "배달 플랫폼 수수료 부담 (15~25%)",
      "식자재 관리 및 위생 철저 필요",
      "경쟁 업체 진입 장벽 낮음",
    ],
    budgetRange: "1,500만 ~ 4,000만 원",
    roi: "월 순수익 200~450만 원 (예상)",
    difficulty: "중하",
  },
  {
    rank: 3,
    category: "소형 편의점 / 무인 판매점",
    emoji: "🏪",
    matchScore: 78,
    tags: ["스테디셀러", "검증된 모델", "프랜차이즈 가능"],
    summary: "안정성을 최우선으로 하는 성향에 맞는 검증된 모델입니다. 프랜차이즈 본사의 지원을 받아 초기 운영 리스크를 낮출 수 있습니다.",
    pros: [
      "프랜차이즈 시스템으로 운영 체계화",
      "생필품 중심으로 경기 변동 영향 적음",
      "무인화 전환 가능",
      "본사 마케팅 지원",
    ],
    cons: [
      "본사 로열티 및 수수료 발생",
      "마진율이 낮아 매출 규모 확보 필요",
      "재고 및 유통기한 관리 필수",
    ],
    budgetRange: "4,000만 ~ 8,000만 원",
    roi: "월 순수익 250~500만 원 (예상)",
    difficulty: "중",
  },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  "하": "#10b981",
  "중하": "#34d399",
  "중": "#f59e0b",
  "중상": "#f97316",
  "상": "#ef4444",
};

/* ── 카드 컴포넌트 ── */
function RecommendCard({ rec, defaultOpen }: { rec: typeof DUMMY_RECOMMENDATIONS[0]; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="rounded-3xl overflow-hidden transition-all"
      style={{ background: "rgba(255,255,255,0.04)", border: rec.rank === 1 ? "1.5px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* 카드 헤더 */}
      <button className="w-full text-left p-6 flex items-start gap-4" onClick={() => setOpen(o => !o)}>
        <div className="text-4xl mt-1 flex-shrink-0">{rec.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {rec.rank === 1 && (
              <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{ background: "rgba(16,185,129,0.2)", color: "#34d399" }}>
                AI 1순위 추천
              </span>
            )}
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}>
              매칭 {rec.matchScore}%
            </span>
          </div>
          <h3 className="text-lg font-black text-white mb-2">{rec.category}</h3>
          <div className="flex flex-wrap gap-1.5">
            {rec.tags.map(t => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.1)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.2)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* 카드 상세 */}
      {open && (
        <div className="px-6 pb-6 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {/* 요약 */}
          <div className="flex gap-3 mt-5 mb-5 p-4 rounded-2xl" style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.15)" }}>
            <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#34d399" }} />
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{rec.summary}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            {/* 장점 */}
            <div>
              <p className="text-xs font-black mb-3 flex items-center gap-1.5" style={{ color: "#34d399" }}>
                <CheckCircle2 className="w-3.5 h-3.5" /> 이런 점이 좋아요
              </p>
              <ul className="space-y-2">
                {rec.pros.map((p, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: "rgba(255,255,255,0.65)" }}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#10b981" }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            {/* 단점 */}
            <div>
              <p className="text-xs font-black mb-3 flex items-center gap-1.5" style={{ color: "#f97316" }}>
                <AlertTriangle className="w-3.5 h-3.5" /> 이런 점은 주의하세요
              </p>
              <ul className="space-y-2">
                {rec.cons.map((c, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: "rgba(255,255,255,0.65)" }}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#f97316" }} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 예산 / 수익 / 난이도 */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "예상 초기 투자", value: rec.budgetRange, icon: "💰" },
              { label: "예상 월 수익", value: rec.roi, icon: "📈" },
              { label: "운영 난이도", value: rec.difficulty, icon: "⚡", color: DIFFICULTY_COLOR[rec.difficulty] },
            ].map(item => (
              <div key={item.label} className="rounded-2xl p-4 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-xl mb-1">{item.icon}</div>
                <p className="text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.35)", fontWeight: 700 }}>{item.label}</p>
                <p className="text-xs font-black leading-tight" style={{ color: item.color ?? "white" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export function SimpleResultReport({ onReset, onDetailedAnalysis }: Props) {
  return (
    <div style={{ minHeight: "100vh", background: "#141720", color: "white", fontFamily: "'Noto Sans KR', sans-serif" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* 헤더 */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#10b981,#34d399)" }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold" style={{ color: "#34d399" }}>AI 업종 추천 결과</span>
        </div>
        <h1 className="mb-2" style={{ fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.2 }}>
          회원님께 맞는 업종을<br />분석했습니다
        </h1>
        <p className="mb-10" style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
          응답하신 5가지 항목을 바탕으로 AI가 최적 업종 3가지를 추천드립니다.<br />
          실제 창업 전 전문가 상담을 병행하시길 권장합니다.
        </p>

        {/* 매칭 요약 바 */}
        <div className="rounded-2xl p-5 mb-8 flex items-center gap-5" style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <div className="text-center flex-shrink-0">
            <p className="text-4xl font-black" style={{ color: "#34d399" }}>92<span className="text-xl">%</span></p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>최고 매칭도</p>
          </div>
          <div className="w-px self-stretch" style={{ background: "rgba(255,255,255,0.08)" }} />
          <div>
            <p className="text-sm font-bold text-white mb-1">운영 관리 중심 · 시스템 자동화 선호</p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              응답 패턴 분석 결과, 감정 노동이 적고 시스템화가 가능한 업종에서 높은 성공 가능성이 예측됩니다.
            </p>
          </div>
        </div>

        {/* 추천 카드 목록 */}
        <div className="flex flex-col gap-4 mb-10">
          {DUMMY_RECOMMENDATIONS.map((rec, i) => (
            <RecommendCard key={rec.rank} rec={rec} defaultOpen={i === 0} />
          ))}
        </div>

        {/* 추가 인사이트 */}
        <div className="rounded-3xl p-6 mb-8" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5" style={{ color: "#f59e0b" }} />
            <p className="font-black text-white">창업 전 꼭 확인하세요</p>
          </div>
          <ul className="space-y-3">
            {[
              "선택하신 예산 범위 내에서 권리금이 없는 신규 상가 위주로 알아보시는 것을 추천드립니다.",
              "무인 운영 업종은 CCTV·키오스크·재고 관리 시스템 등 초기 세팅 비용을 충분히 고려하세요.",
              "배달 전문 업종은 플랫폼 입점 전 소규모 테스트 운영으로 레시피 검증을 먼저 하세요.",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                <span className="flex-shrink-0 font-black mt-0.5" style={{ color: "#f59e0b" }}>{i + 1}.</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* 하단 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 h-14 rounded-2xl flex-1 font-bold transition-all"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: "0.95rem" }}
          >
            <RotateCcw className="w-4 h-4" /> 처음부터 다시
          </button>
          <button
            onClick={onDetailedAnalysis}
            className="flex items-center justify-center gap-2 h-14 rounded-2xl flex-1 font-bold text-white transition-all"
            style={{ background: "linear-gradient(135deg,#10b981,#34d399)", boxShadow: "0 8px 24px rgba(16,185,129,0.35)", fontSize: "0.95rem" }}
          >
            <Sparkles className="w-4 h-4" /> 상세 분석 시작하기
          </button>
        </div>
        <p className="text-center mt-4 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          본 추천 결과는 AI 더미 데이터 기반이며, 실제 창업 결과를 보장하지 않습니다.
        </p>
      </div>
    </div>
  );
}

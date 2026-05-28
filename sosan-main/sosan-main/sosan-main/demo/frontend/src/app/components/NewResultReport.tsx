import { useState } from "react";
import { Link } from "react-router";
import {
  Download, RefreshCw, MapPin, TrendingUp as TrendUp,
  CheckCircle2, AlertTriangle, Flame, ChevronRight, Clock,
  LayoutGrid, FileText, Hammer, Rocket, Circle,
} from "lucide-react";

/* ── 공통 헤더 ── */
function ReportHeader({ onReset }: { onReset: () => void }) {
  return (
    <div className="mb-8">
      {/* 뒤로가기 */}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 mb-6 transition-all"
        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", padding: 0 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
      >
        <ChevronRight style={{ width: "14px", height: "14px", transform: "rotate(180deg)" }} />
        유형 선택으로 돌아가기
      </button>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full"
              style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "0.75rem", fontWeight: 600, color: "#34d399" }}
            >
              분석 완료
            </span>
            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>2026년 3월 30일 기준 데이터 반영</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.04em" }}>
            신생 창업자 맞춤형 리포트
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-4 h-10 rounded-xl transition-all"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: "0.84rem", fontWeight: 500, cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          >
            <Download style={{ width: "15px", height: "15px" }} /> PDF 저장
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 h-10 rounded-xl transition-all"
            style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.15)")}
          >
            <RefreshCw style={{ width: "15px", height: "15px" }} /> 새로운 분석
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 하단 링크 ── */
function ReportFooter() {
  return (
    <div className="mt-8 pt-6 flex flex-wrap gap-3 justify-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.3)", textAlign: "center", width: "100%", marginBottom: "12px" }}>
        리포트를 바탕으로 소상광장 서비스를 활용해 보세요
      </p>
      {[
        { label: "정부 지원사업 보기", path: "/support", color: "#10b981" },
        { label: "사장님 커뮤니티", path: "/community", color: "#34d399" },
        { label: "식자재 시세 확인", path: "/market-price", color: "#6ee7b7" },
      ].map((item) => (
        <Link
          key={item.path} to={item.path}
          className="px-5 h-10 rounded-xl flex items-center gap-1.5 transition-all"
          style={{ background: `${item.color}15`, border: `1px solid ${item.color}30`, color: item.color, fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = `${item.color}25`)}
          onMouseLeave={(e) => (e.currentTarget.style.background = `${item.color}15`)}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   신생 창업자 리포트 (메인 export)
───────────────────────────────────────── */
export function NewResultReport({
  answers, onReset, onSwitchToExisting,
}: {
  answers: Record<string, string | string[]>; onReset: () => void; onSwitchToExisting?: () => void;
}) {
  return (
    <div style={{ background: "#141720", minHeight: "100vh", color: "white", padding: "32px 20px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <ReportHeader onReset={onReset} />
        <LocationAnalysisSection answers={answers} onSwitchToExisting={onSwitchToExisting} />
        <ReportFooter />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   창업 단계 사이드바 + 상권 분석 섹션
───────────────────────────────────────── */
const STAGES = [
  { num: 1, label: "창업 방향 설정" },
  { num: 2, label: "자금 조달 계획" },
  { num: 3, label: "상권 분석" },
  { num: 4, label: "입지 선정" },
  { num: 5, label: "사업 계획 수립" },
  { num: 6, label: "점포 확보" },
  { num: 7, label: "인허가 및 등록" },
  { num: 8, label: "인테리어 및 설비" },
  { num: 9, label: "시험 운영 (피드백)" },
];

function LocationAnalysisSection({ answers, onSwitchToExisting }: { answers: Record<string, string | string[]>; onSwitchToExisting?: () => void }) {
  const [currentStep, setCurrentStep] = useState(2);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set([0, 1]));
  const [showCompletion, setShowCompletion] = useState(false);

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const bizType = answers.bizType || "카페/음료";
  const region  = answers.region  || "서울 마포구/용산구";
  const target  = answers.target  || "20대~30대 직장인";

  const progressPct = Math.round(((currentStep - 1) / STAGES.length) * 100);

  /* ── 상권 비교 데이터 (region 기반) ── */
  const isSeoul   = region.includes("서울");
  const isGangnam = region.includes("강남");

  const areaA = isGangnam ? "강남역 상권" : isSeoul ? "홍대 상권" : "수원역 상권";
  const areaB = isGangnam ? "역삼동 이면도로" : isSeoul ? "서신동 이면도로" : "권선동 이면도로";

  const compareRows = [
    {
      label: "유동인구",
      aLabel: `${areaA} 압승`,
      aHot: true,
      bLabel: `${areaB} 보통`,
      bHot: false,
    },
    {
      label: "평균 임대료",
      aLabel: `${areaA}가 40% 높음`,
      aHot: true,
      bLabel: `${areaB} 저렴`,
      bHot: false,
    },
  ];

  const aiRec = `${areaB} (초기 자본 절약 & 경쟁도 낮음)`;

  /* ── 상권 DNA 태그 (bizType + target 기반) ── */
  const dnaTags = bizType.includes("카페")
    ? ["20대 비율 65%", "카페 밀집 지역", "트렌드 민감도 최상", "주말 저녁 피크", "데이트 코스 중심"]
    : bizType.includes("음식")
    ? ["점심 수요 최상", "직장인 밀집", "배달 주문 높음", "회전율 중심", "가성비 선호"]
    : ["소비력 중상", "유동인구 안정", "주거 밀집", "단골 중심", "지역 커뮤니티 활성"];

  const dnaDesc = bizType.includes("카페")
    ? "SNS 감성의 트렌디한 인테리어가 필수적이며, 객단가보다 회전율을 높이는 전략이 유리합니다."
    : bizType.includes("음식")
    ? "점심 피크 타임 공략과 배달 채널 병행 운영이 핵심입니다. 메뉴 단순화로 회전율을 높이세요."
    : "단골 고객 확보와 지역 커뮤니티 마케팅을 중심으로 안정적인 매출 기반을 만드세요.";

  /* ── 위험 요소 (bizType 기반) ── */
  const risks = bizType.includes("카페")
    ? [
        { color: "#ef4444", title: "동일 업종 과다", desc: `반경 500m 내 유사 업종 카페 42개로 경쟁이 매우 심화되어 있습니다.` },
        { color: "#f59e0b", title: "상가 공실률 증가", desc: "최근 3개월간 메인 거리 이면도로의 공실률이 5% 상승했습니다." },
      ]
    : bizType.includes("음식")
    ? [
        { color: "#ef4444", title: "배달 수수료 부담", desc: "해당 상권 평균 배달앱 수수료율이 18%로 수익성에 영향을 줄 수 있습니다." },
        { color: "#f59e0b", title: "원재료 가격 상승", desc: "최근 6개월간 주요 식자재 가격이 평균 12% 상승하는 추세입니다." },
      ]
    : [
        { color: "#ef4444", title: "대형 프랜차이즈 진입", desc: "해당 상권에 대형 체인 2곳이 최근 오픈하여 경쟁 심화가 예상됩니다." },
        { color: "#f59e0b", title: "임대료 상승세", desc: "해당 지역 상가 임대료가 분기 대비 7% 상승하는 추세입니다." },
      ];

  const isLastStep = currentStep === STAGES.length;

  return (
    <div className="mt-8">
      {/* 섹션 구분선 */}
      <div className="flex items-center gap-4 mb-6">
        <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.07)" }} />
        <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>창업 단계별 가이드</span>
        <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.07)" }} />
      </div>

      {/* 메인 패널 */}
      <div
        className="flex gap-0 overflow-hidden"
        style={{ borderRadius: "20px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
      >
        {/* ── 좌측 사이드바 ── */}
        <div
          className="flex flex-col shrink-0"
          style={{ width: "220px", background: "rgba(0,0,0,0.25)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "28px 20px" }}
        >
          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>창업 준비 진행도</p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#10b981", marginBottom: "10px", letterSpacing: "-0.03em" }}>
            {progressPct}%
          </p>
          {/* 프로그레스 바 */}
          <div className="rounded-full mb-6 overflow-hidden" style={{ height: "5px", background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%`, background: "linear-gradient(90deg,#10b981,#34d399)" }}
            />
          </div>

          {/* 단계 목록 */}
          <div className="flex flex-col gap-0">
            {STAGES.map((stage, idx) => {
              const done    = stage.num < currentStep;
              const current = stage.num === currentStep;
              const future  = stage.num > currentStep;
              return (
                <div key={stage.num} className="flex items-start gap-3" style={{ paddingBottom: idx < STAGES.length - 1 ? "0" : "0" }}>
                  {/* 아이콘 + 연결선 */}
                  <div className="flex flex-col items-center shrink-0" style={{ width: "20px" }}>
                    <div
                      className="flex items-center justify-center rounded-full shrink-0"
                      style={{
                        width: "20px", height: "20px",
                        background: done ? "#10b981" : current ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)",
                        border: current ? "2px solid #10b981" : done ? "none" : "1.5px solid rgba(255,255,255,0.12)",
                        marginTop: "12px",
                      }}
                    >
                      {done && <CheckCircle2 style={{ width: "12px", height: "12px", color: "white" }} />}
                      {current && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />}
                    </div>
                    {idx < STAGES.length - 1 && (
                      <div style={{ width: "1.5px", flex: 1, minHeight: "24px", background: done ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.07)", marginTop: "2px" }} />
                    )}
                  </div>
                  {/* 텍스트 */}
                  <div style={{ paddingTop: "10px", paddingBottom: idx < STAGES.length - 1 ? "14px" : "0" }}>
                    <p style={{ fontSize: "0.68rem", color: current ? "#34d399" : done ? "rgba(16,185,129,0.7)" : "rgba(255,255,255,0.25)", fontWeight: current ? 700 : 500, marginBottom: "1px" }}>
                      단계 {stage.num}
                    </p>
                    <p style={{ fontSize: "0.78rem", color: current ? "white" : done ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", fontWeight: current ? 700 : 400, lineHeight: 1.3 }}>
                      {stage.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 우측 메인 콘텐츠 ── */}
        <div className="flex-1 min-w-0 flex flex-col" style={{ padding: "28px 28px 24px" }}>

          {/* ══ 단계 2: 자금 조달 계획 ══ */}
          {currentStep === 2 && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "0.75rem", fontWeight: 600, color: "#34d399" }}>
                  <TrendUp style={{ width: "11px", height: "11px" }} /> 현재 단계
                </div>
                <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>자금 조달 계획</h2>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)" }}>창업 자금을 어떻게 마련할지 계획해요</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* 자금 조달 방법 비교 */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "22px" }}>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "3px" }}>자금 조달 방법 비교</p>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>AI 추천 비율 기준</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                      <TrendUp style={{ width: "15px", height: "15px", color: "#34d399" }} />
                    </div>
                  </div>
                  {[
                    { label: "자기 자본", pct: 40, color: "#10b981", desc: "리스크 최소, 이자 부담 없음" },
                    { label: "정부 지원 대출", pct: 35, color: "#3b82f6", desc: "저금리 1~2%, 소진공 추천" },
                    { label: "은행 대출", pct: 25, color: "#8b5cf6", desc: "일반 신용·담보 대출" },
                  ].map((row) => (
                    <div key={row.label} className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span style={{ fontSize: "0.82rem", color: "white", fontWeight: 600 }}>{row.label}</span>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: row.color }}>{row.pct}%</span>
                      </div>
                      <div className="rounded-full overflow-hidden mb-1" style={{ height: "8px", background: "rgba(255,255,255,0.07)" }}>
                        <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: `linear-gradient(90deg,${row.color},${row.color}aa)` }} />
                      </div>
                      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{row.desc}</p>
                    </div>
                  ))}
                </div>

                {/* 추천 지원 프로그램 */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "22px" }}>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "3px" }}>추천 지원 프로그램</p>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>지금 신청 가능한 제도</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)" }}>
                      <FileText style={{ width: "15px", height: "15px", color: "#fbbf24" }} />
                    </div>
                  </div>
                  {[
                    { name: "소공인 특화 자금", agency: "소상공인진흥공단", limit: "최대 7천만원 / 연 2%", tag: "추천" },
                    { name: "청년 창업 사관학교", agency: "중소벤처기업부", limit: "최대 1억 / 무이자", tag: "청년" },
                    { name: "신용보증기금 창업대출", agency: "신용보증기금", limit: "최대 5천만원 / 연 3%", tag: "보증" },
                  ].map((prog) => (
                    <div key={prog.name} className="flex items-start gap-3 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <span className="px-2 py-0.5 rounded-full shrink-0 mt-0.5" style={{ fontSize: "0.62rem", fontWeight: 700, background: "rgba(16,185,129,0.2)", color: "#34d399" }}>{prog.tag}</span>
                      <div>
                        <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "white", marginBottom: "2px" }}>{prog.name}</p>
                        <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: "2px" }}>{prog.agency}</p>
                        <p style={{ fontSize: "0.75rem", color: "#fbbf24", fontWeight: 600 }}>{prog.limit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "24px" }} />
            </>
          )}

          {/* ══ 단계 3: 상권 분석 ══ */}
          {currentStep === 3 && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "0.75rem", fontWeight: 600, color: "#34d399" }}>
                  <MapPin style={{ width: "11px", height: "11px" }} /> 현재 단계
                </div>
                <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>상권 분석</h2>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)" }}>목표 상권의 특성을 파악해요</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* 상권 DNA 분석 */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "22px" }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "3px" }}>상권 DNA 분석</p>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>{region} 핵심 요약</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(59,130,246,0.18)" }}>
                      <TrendUp style={{ width: "15px", height: "15px", color: "#60a5fa" }} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dnaTags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-full" style={{ fontSize: "0.72rem", fontWeight: 500, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{dnaDesc}</p>
                </div>

                {/* 위험 요소 알림 */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "22px" }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "3px" }}>위험 요소 알림</p>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>창업 경고 시그널</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)" }}>
                      <AlertTriangle style={{ width: "15px", height: "15px", color: "#f87171" }} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {risks.map((risk) => (
                      <div key={risk.title} className="rounded-xl p-4" style={{ background: `${risk.color}12`, border: `1px solid ${risk.color}30` }}>
                        <div className="flex items-center gap-2 mb-2">
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: risk.color, flexShrink: 0 }} />
                          <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "white" }}>{risk.title}</p>
                        </div>
                        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.55 }}>{risk.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }} />
            </>
          )}

          {/* ══ 단계 4: 입지 선정 ══ */}
          {currentStep === 4 && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "0.75rem", fontWeight: 600, color: "#34d399" }}>
                  <MapPin style={{ width: "11px", height: "11px" }} /> 현재 단계
                </div>
                <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>입지 선정</h2>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)" }}>최적의 가게 위치를 골라봐요</p>
              </div>

              {/* 상권 비교 분석 (풀 너비) */}
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "22px", marginBottom: "24px" }}>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "3px" }}>상권 비교 분석</p>
                    <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>{areaA} vs {areaB}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                    <MapPin style={{ width: "15px", height: "15px", color: "#34d399" }} />
                  </div>
                </div>
                <div className="flex flex-col gap-3 mb-5">
                  {compareRows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>{row.label}</span>
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ fontSize: "0.78rem", fontWeight: 600, background: row.aHot ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)", color: row.aHot ? "#f87171" : "rgba(255,255,255,0.5)" }}>
                        {row.aLabel} {row.aHot && <Flame style={{ width: "10px", height: "10px" }} />}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: "10px", padding: "14px 16px" }}>
                  <p style={{ fontSize: "0.72rem", color: "#34d399", fontWeight: 600, marginBottom: "4px" }}>AI의 최종 추천</p>
                  <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "white" }}>{aiRec}</p>
                </div>
              </div>
            </>
          )}

          {/* ══ 단계 5: 사업 계획 수립 ══ */}
          {currentStep === 5 && (
            <>
              <div className="mb-6">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
                  style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "0.75rem", fontWeight: 600, color: "#34d399" }}
                >
                  <Clock style={{ width: "11px", height: "11px" }} /> 현재 단계
                </div>
                <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>
                  사업 계획 수립
                </h2>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)" }}>예산과 수익 구조를 계획해요</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4" style={{ flex: 1 }}>
                {/* 업종별 수익성 비교 */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "22px" }}>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "3px" }}>업종별 수익성 비교</p>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>월 평균 순수익 기준</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                      <TrendUp style={{ width: "15px", height: "15px", color: "#34d399" }} />
                    </div>
                  </div>

                  {/* 바 차트 */}
                  {[
                    {
                      label: "카페/음료",
                      value: bizType.includes("카페") ? 320 : 280,
                      max: 500,
                      color: "#10b981",
                      isMe: bizType.includes("카페"),
                      display: bizType.includes("카페") ? "약 320만원" : "약 280만원",
                    },
                    {
                      label: "음식점",
                      value: bizType.includes("음식") ? 450 : 420,
                      max: 500,
                      color: "#3b82f6",
                      isMe: bizType.includes("음식"),
                      display: bizType.includes("음식") ? "약 450만원" : "약 420만원",
                    },
                    {
                      label: "기타 업종",
                      value: 260,
                      max: 500,
                      color: "#8b5cf6",
                      isMe: !bizType.includes("카페") && !bizType.includes("음식"),
                      display: "약 260만원",
                    },
                  ].map((bar) => (
                    <div key={bar.label} className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: "0.82rem", color: bar.isMe ? "white" : "rgba(255,255,255,0.5)", fontWeight: bar.isMe ? 700 : 400 }}>
                            {bar.label}
                          </span>
                          {bar.isMe && (
                            <span
                              className="px-1.5 py-0.5 rounded"
                              style={{ fontSize: "0.62rem", fontWeight: 700, background: `${bar.color}25`, color: bar.color }}
                            >
                              내 업종
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: bar.isMe ? bar.color : "rgba(255,255,255,0.4)" }}>
                          {bar.display}
                        </span>
                      </div>
                      <div className="rounded-full overflow-hidden" style={{ height: "8px", background: "rgba(255,255,255,0.07)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(bar.value / bar.max) * 100}%`, background: bar.isMe ? `linear-gradient(90deg,${bar.color},${bar.color}aa)` : "rgba(255,255,255,0.15)" }}
                        />
                      </div>
                    </div>
                  ))}

                  <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: "10px", padding: "12px 14px", marginTop: "8px" }}>
                    <p style={{ fontSize: "0.72rem", color: "#34d399", fontWeight: 600, marginBottom: "4px" }}>AI 제안</p>
                    <p style={{ fontSize: "0.83rem", color: "white", lineHeight: 1.5 }}>
                      {bizType.includes("카페")
                        ? "카페는 객단가를 높이는 시그니처 메뉴 개발과 굿즈 판매로 수익성을 개선할 수 있습니다."
                        : bizType.includes("음식")
                        ? "음식점은 점심 세트 메뉴와 배달 채널 병행으로 안정적인 수익 구조를 만드세요."
                        : "단골 고객 기반의 정기 구독 모델 도입으로 예측 가능한 매출을 확보하세요."}
                    </p>
                  </div>
                </div>

                {/* 초기 투자 예산 시뮬레이터 */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "22px" }}>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "3px" }}>초기 투자 예산 시뮬레이터</p>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>예상 창업 비용 분석</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)" }}>
                      <AlertTriangle style={{ width: "15px", height: "15px", color: "#fbbf24" }} />
                    </div>
                  </div>

                  {/* 항목별 비용 */}
                  {[
                    {
                      label: "보증금",
                      value: isGangnam ? "8,000만원" : isSeoul ? "5,000만원" : "3,000만원",
                      note: "통상 월세 10~15개월 치",
                    },
                    {
                      label: "인테리어 (평수 기준)",
                      value: bizType.includes("카페") ? "3,500만원" : "2,500만원",
                      note: "15평 기준 / 업종 특화 디자인 포함",
                    },
                    {
                      label: "초기 물대 및 비품",
                      value: bizType.includes("카페") ? "900만원" : "700만원",
                      note: "장비·재고 첫 발주 기준",
                    },
                    {
                      label: "홍보 및 예비 자금",
                      value: "600만원",
                      note: "오픈 마케팅 + 3개월 운영 여유금",
                    },
                  ].map((item, i) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-3"
                      style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                    >
                      <div>
                        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{item.label}</p>
                        <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{item.note}</p>
                      </div>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{item.value}</p>
                    </div>
                  ))}

                  {/* 총 합계 */}
                  <div
                    className="rounded-xl mt-4 px-4 py-3 flex items-center justify-between"
                    style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}
                  >
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "#fbbf24", fontWeight: 600, marginBottom: "2px" }}>총 필요 자본금</p>
                      <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>보증금 포함 최소 권장 금액</p>
                    </div>
                    <p style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fbbf24", letterSpacing: "-0.02em" }}>
                      {isGangnam
                        ? bizType.includes("카페") ? "1억 3,000만원" : "1억 1,800만원"
                        : isSeoul
                        ? bizType.includes("카페") ? "1억 원" : "8,800만원"
                        : bizType.includes("카페") ? "8,000만원" : "6,800만원"}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }} />
            </>
          )}

          {/* ══ 단계 6: 점포 확보 ══ */}
          {currentStep === 6 && (() => {
            const stores = isGangnam
              ? [
                  { badge: "추천 1순위", badgeColor: "#10b981", loc: "강남역 대로변", floor: "1층 30평 상가", deposit: "보증금 1억/월 400", key: "권리금 없음 (신축)", keyColor: "#10b981" },
                  { badge: "가성비", badgeColor: "#3b82f6", loc: "역삼동 이면도로", floor: "1층 22평 상가", deposit: "보증금 5천/월 250", key: "권리금 2천 (시설 포함)", keyColor: "#34d399" },
                  { badge: "유동인구", badgeColor: "#8b5cf6", loc: "선릉역 메인거리", floor: "2층 35평 상가", deposit: "보증금 8천/월 380", key: "권리금 5천", keyColor: "#f87171" },
                ]
              : isSeoul
              ? [
                  { badge: "추천 1순위", badgeColor: "#10b981", loc: "홍대 대로변", floor: "1층 25평 상가", deposit: "보증금 5천/월 200", key: "권리금 없음 (신축)", keyColor: "#10b981" },
                  { badge: "가성비", badgeColor: "#3b82f6", loc: "서신동 이면도로", floor: "1층 18평 상가", deposit: "보증금 2천/월 120", key: "권리금 1천 (시설 포함)", keyColor: "#34d399" },
                  { badge: "유동인구", badgeColor: "#8b5cf6", loc: "마포 메인거리", floor: "2층 30평 상가", deposit: "보증금 4천/월 200", key: "권리금 3천", keyColor: "#f87171" },
                ]
              : [
                  { badge: "추천 1순위", badgeColor: "#10b981", loc: "서신동 대로변", floor: "1층 25평 상가", deposit: "보증금 3천/월 150", key: "권리금 없음 (신축)", keyColor: "#10b981" },
                  { badge: "가성비", badgeColor: "#3b82f6", loc: "서신동 이면도로", floor: "1층 18평 상가", deposit: "보증금 2천/월 120", key: "권리금 1천 (시설 포함)", keyColor: "#34d399" },
                  { badge: "유동인구", badgeColor: "#8b5cf6", loc: "객사 메인거리", floor: "2층 30평 상가", deposit: "보증금 5천/월 250", key: "권리금 3천", keyColor: "#f87171" },
                ];
            return (
              <>
                <div className="mb-6">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
                    style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "0.75rem", fontWeight: 600, color: "#34d399" }}
                  >
                    <LayoutGrid style={{ width: "11px", height: "11px" }} /> 현재 단계
                  </div>
                  <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>점포 확보</h2>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)" }}>실제 계약할 매장을 찾아요</p>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "22px", marginBottom: "24px" }}>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "3px" }}>AI 매물 추천 리스트</p>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>예산에 맞는 매장을 찾았어요</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(59,130,246,0.18)" }}>
                      <LayoutGrid style={{ width: "15px", height: "15px", color: "#60a5fa" }} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    {stores.map((store) => (
                      <div
                        key={store.badge}
                        className="rounded-xl p-4 flex flex-col gap-2"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="px-2 py-0.5 rounded-full"
                            style={{ fontSize: "0.65rem", fontWeight: 700, background: `${store.badgeColor}25`, color: store.badgeColor }}
                          >
                            {store.badge}
                          </span>
                          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>{store.loc}</span>
                        </div>
                        <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "white", lineHeight: 1.2 }}>{store.floor}</p>
                        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>{store.deposit}</p>
                        <p style={{ fontSize: "0.78rem", fontWeight: 600, color: store.keyColor }}>{store.key}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}

          {/* ══ 단계 7: 인허가 및 등록 ══ */}
          {currentStep === 7 && (() => {
            const checkItems = bizType.includes("카페") || bizType.includes("음식")
              ? [
                  "보건증 발급 (가까운 보건소 방문)",
                  "위생 교육 수료 (한국외식업중앙회 온라인)",
                  "영업신고증 발급 (관할 구청 위생과)",
                  "사업자 등록증 발급 (관할 세무서)",
                  "사업용 계좌 개설 및 카드 단말기 신청",
                ]
              : [
                  "사업자 등록증 발급 (관할 세무서)",
                  "영업신고증 발급 (관할 구청)",
                  "소방 안전 점검 완료",
                  "보건증 발급 (가까운 보건소 방문)",
                  "사업용 계좌 개설 및 카드 단말기 신청",
                ];
            return (
              <>
                <div className="mb-6">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
                    style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "0.75rem", fontWeight: 600, color: "#34d399" }}
                  >
                    <FileText style={{ width: "11px", height: "11px" }} /> 현재 단계
                  </div>
                  <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>인허가 및 등록</h2>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)" }}>필요한 서류를 챙겨보아요</p>
                </div>

                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "22px", marginBottom: "24px" }}>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "3px" }}>필수 체크리스트</p>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>관공서 방문 전 꼭 챙기세요</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                      <FileText style={{ width: "15px", height: "15px", color: "#34d399" }} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {checkItems.map((item, idx) => {
                      const done = checkedItems.has(idx);
                      return (
                        <button
                          key={item}
                          onClick={() => toggleCheck(idx)}
                          className="flex items-center gap-3 w-full rounded-xl px-4 py-3.5 text-left transition-all"
                          style={{
                            background: done ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)",
                            border: done ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.07)",
                            cursor: "pointer",
                          }}
                        >
                          {done
                            ? <CheckCircle2 style={{ width: "18px", height: "18px", color: "#10b981", flexShrink: 0 }} />
                            : <Circle style={{ width: "18px", height: "18px", color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                          }
                          <span style={{
                            fontSize: "0.88rem",
                            color: done ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.85)",
                            textDecoration: done ? "line-through" : "none",
                          }}>
                            {item}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}

          {/* ══ 단계 8~9: AI 컨설팅 준비 중 ══ */}
          {currentStep >= 8 && (() => {
            const meta: Record<number, { title: string; sub: string; icon: React.ReactNode }> = {
              8: { title: "인테리어 및 설비", sub: "매장을 멋지게 꾸며요", icon: <Hammer style={{ width: "11px", height: "11px" }} /> },
              9: { title: "시험 운영 (피드백)", sub: "고객 피드백으로 완성해요", icon: <Rocket style={{ width: "11px", height: "11px" }} /> },
            };
            const m = meta[currentStep] ?? meta[8];
            return (
              <>
                <div className="mb-6">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
                    style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "0.75rem", fontWeight: 600, color: "#34d399" }}
                  >
                    {m.icon} 현재 단계
                  </div>
                  <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>{m.title}</h2>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)" }}>{m.sub}</p>
                </div>

                <div
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "22px", marginBottom: "24px", minHeight: "200px" }}
                  className="flex flex-col"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "3px" }}>AI 컨설팅 진행 중</p>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>데이터를 수집하고 있어요</p>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ border: "1.5px solid rgba(255,255,255,0.15)" }}>
                      <Clock style={{ width: "14px", height: "14px", color: "rgba(255,255,255,0.3)" }} />
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
                      해당 단계에 맞는 리포트가 준비중입니다.
                    </p>
                  </div>
                </div>
              </>
            );
          })()}

          {/* 단계 이동 버튼 */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => currentStep > 2 && setCurrentStep((s) => s - 1)}
              disabled={currentStep <= 2}
              className="flex items-center gap-2 px-5 h-11 rounded-2xl transition-all active:scale-[0.98]"
              style={{
                background: currentStep <= 2 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.07)",
                color: currentStep <= 2 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)",
                fontSize: "0.88rem", fontWeight: 600,
                border: currentStep <= 2 ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(255,255,255,0.12)",
                cursor: currentStep <= 2 ? "default" : "pointer",
              }}
            >
              <ChevronRight style={{ width: "15px", height: "15px", transform: "rotate(180deg)" }} />
              이전 단계로
            </button>

            <button
              onClick={() => isLastStep ? setShowCompletion(true) : setCurrentStep((s) => s + 1)}
              className="flex items-center gap-2 px-6 h-12 rounded-2xl transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg,#10b981,#34d399)",
                color: "white",
                fontSize: "0.92rem", fontWeight: 700,
                border: "none", cursor: "pointer",
                boxShadow: "0 6px 24px rgba(16,185,129,0.35)",
              }}
            >
              {isLastStep ? "모든 단계 완료" : "다음 단계로 진행하기"}
              <ChevronRight style={{ width: "16px", height: "16px" }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 완료 모달 ── */}
      {showCompletion && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)", zIndex: 50 }}
          onClick={() => setShowCompletion(false)}
        >
          <div
            className="flex flex-col items-center text-center"
            style={{
              background: "linear-gradient(160deg,#1a2236,#141c2e)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: "24px",
              padding: "48px 40px",
              maxWidth: "420px",
              width: "90%",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 아이콘 */}
            <div
              className="flex items-center justify-center mb-6"
              style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}
            >
              <span style={{ fontSize: "2rem" }}>🎉</span>
            </div>

            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, lineHeight: 1.3, marginBottom: "16px", letterSpacing: "-0.03em" }}>
              이제 사장님이 되실<br />준비가 완료되었습니다!
            </h2>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "32px" }}>
              그동안 정말 고생 많으셨어요.<br />가게 운영을 본격적으로 시작해볼까요?
            </p>

            <button
              onClick={() => { setShowCompletion(false); onSwitchToExisting?.(); }}
              className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg,#10b981,#34d399)",
                color: "white", fontSize: "1rem", fontWeight: 700,
                border: "none", cursor: "pointer",
                boxShadow: "0 8px 28px rgba(16,185,129,0.4)",
              }}
            >
              기존 사장님 모드로 전환하기
              <ChevronRight style={{ width: "18px", height: "18px" }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

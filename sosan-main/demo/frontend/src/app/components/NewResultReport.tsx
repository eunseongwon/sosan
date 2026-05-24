import { useState } from "react";
import { Link } from "react-router";
import {
  Download, RefreshCw, MapPin, TrendingUp as TrendUp,
  CheckCircle2, AlertTriangle, ChevronRight, Clock,
  LayoutGrid, FileText, Circle,
} from "lucide-react";
import type { AiAnalysisResult } from "../utils/openai";
import type { SbizStoreData, CommercialContext, RoneRentContext, BizinfoContext } from "../utils/budongsan";

/* ── 공통 헤더 ── */
function ReportHeader({ onReset }: { onReset: () => void }) {
  return (
    <div className="mb-8">
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

const RISK_COLOR: Record<string, string> = { "높음": "#ef4444", "중간": "#f59e0b", "낮음": "#10b981" };
const RISK_BG: Record<string, string>    = { "높음": "rgba(239,68,68,0.1)", "중간": "rgba(245,158,11,0.1)", "낮음": "rgba(16,185,129,0.1)" };

/* ─────────────────────────────────────────
   신생 창업자 리포트 (메인 export)
───────────────────────────────────────── */
export function NewResultReport({
  answers, aiResult, aiError, sbizData, commercialCtx, roneData, bizinfoData, onReset, onSwitchToExisting,
}: {
  answers: Record<string, string | string[]>;
  aiResult: AiAnalysisResult | null;
  aiError: boolean;
  sbizData: SbizStoreData | null;
  commercialCtx: CommercialContext | null;
  roneData: RoneRentContext | null;
  bizinfoData: BizinfoContext | null;
  onReset: () => void;
  onSwitchToExisting?: () => void;
}) {
  return (
    <div style={{ background: "#141720", minHeight: "100vh", color: "white", padding: "32px 20px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <ReportHeader onReset={onReset} />
        {aiError && (
          <div className="rounded-2xl p-4 mb-8 flex items-center gap-3"
            style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)" }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "#f97316" }} />
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>AI 분석 중 오류가 발생했습니다. 기본 리포트를 표시합니다.</p>
          </div>
        )}
        <LocationAnalysisSection
          answers={answers}
          aiResult={aiResult}
          sbizData={sbizData}
          commercialCtx={commercialCtx}
          roneData={roneData}
          bizinfoData={bizinfoData}
          onSwitchToExisting={onSwitchToExisting}
        />
        <ReportFooter />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   창업 단계 사이드바 + 콘텐츠
───────────────────────────────────────── */
const STAGES = [
  { num: 1, label: "창업 방향 설정" },
  { num: 2, label: "자금 조달 계획" },
  { num: 3, label: "상권 분석" },
  { num: 4, label: "입지 선정" },
  { num: 5, label: "사업 계획 수립" },
  { num: 6, label: "임대료 추정" },
  { num: 7, label: "인허가 및 등록" },
];

function LocationAnalysisSection({
  answers, aiResult, sbizData, commercialCtx, roneData, bizinfoData, onSwitchToExisting,
}: {
  answers: Record<string, string | string[]>;
  aiResult: AiAnalysisResult | null;
  sbizData: SbizStoreData | null;
  commercialCtx: CommercialContext | null;
  roneData: RoneRentContext | null;
  bizinfoData: BizinfoContext | null;
  onSwitchToExisting?: () => void;
}) {
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

  const progressPct = Math.round(((currentStep - 1) / STAGES.length) * 100);
  const isLastStep = currentStep === STAGES.length;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-4 mb-6">
        <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.07)" }} />
        <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>창업 단계별 가이드</span>
        <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.07)" }} />
      </div>

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
          <div className="rounded-full mb-6 overflow-hidden" style={{ height: "5px", background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%`, background: "linear-gradient(90deg,#10b981,#34d399)" }}
            />
          </div>

          <div className="flex flex-col gap-0">
            {STAGES.map((stage, idx) => {
              const done    = stage.num < currentStep;
              const current = stage.num === currentStep;
              return (
                <div key={stage.num} className="flex items-start gap-3">
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

              {/* AI 자금 조달 비교 */}
              <div className="flex flex-col gap-3 mb-6">
                {(aiResult?.fundingComparison ?? []).map((f, i) => (
                  <div key={i} style={{ background: f.recommended ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)", border: f.recommended ? "1.5px solid rgba(16,185,129,0.35)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "18px 20px" }}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {f.recommended && <span style={{ fontSize: "0.65rem", fontWeight: 700, background: "rgba(16,185,129,0.2)", color: "#34d399", padding: "2px 8px", borderRadius: "99px" }}>AI 추천</span>}
                        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "white" }}>{f.method}</span>
                      </div>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#34d399", flexShrink: 0 }}>{f.amount}</span>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", marginBottom: "10px" }}>{f.suitability}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>{f.pros.map((p, j) => <p key={j} style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", display: "flex", gap: "6px", marginBottom: "4px" }}><span style={{ marginTop: "5px", width: "5px", height: "5px", borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />{p}</p>)}</div>
                      <div>{f.cons.map((c, j) => <p key={j} style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", display: "flex", gap: "6px", marginBottom: "4px" }}><span style={{ marginTop: "5px", width: "5px", height: "5px", borderRadius: "50%", background: "#f97316", flexShrink: 0 }} />{c}</p>)}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 중소벤처24 정부 지원사업 공고 */}
              {bizinfoData && bizinfoData.items.length > 0 && (
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "white", marginBottom: "2px" }}>현재 접수 중인 정부 지원사업</p>
                      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>중소벤처24 · 총 {bizinfoData.totalCount.toLocaleString()}개 공고 중 업종 관련 상위</p>
                    </div>
                    <a
                      href="https://www.bizinfo.go.kr"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "0.7rem", color: "#34d399", textDecoration: "none", padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)", flexShrink: 0 }}
                    >
                      전체보기 →
                    </a>
                  </div>
                  <div className="flex flex-col gap-0">
                    {bizinfoData.items.map((item, i) => (
                      <a
                        key={item.pblancId || i}
                        href={item.detailUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start justify-between py-3 group"
                        style={{ borderBottom: i < bizinfoData.items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", textDecoration: "none" }}
                      >
                        <div style={{ flex: 1, minWidth: 0, paddingRight: "12px" }}>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {item.bizAreaNm && (
                              <span style={{ fontSize: "0.62rem", padding: "1px 6px", borderRadius: "99px", background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)", flexShrink: 0 }}>
                                {item.bizAreaNm}
                              </span>
                            )}
                            <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}
                              className="group-hover:text-white transition-colors">
                              {item.pblancNm}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                            {item.institution && <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)" }}>{item.institution}</p>}
                            {item.period && <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>접수 {item.period}</p>}
                          </div>
                        </div>
                        <span style={{ fontSize: "0.7rem", color: "#34d399", flexShrink: 0, marginTop: "2px" }}>신청 →</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
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
                {/* 상권 업종 분포 */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "22px" }}>
                  <div className="flex items-center justify-between mb-4">
                    <p style={{ fontSize: "1rem", fontWeight: 700 }}>상권 업종 분포</p>
                    {sbizData && (
                      <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "99px", background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }}>
                        소상공인 API
                      </span>
                    )}
                  </div>

                  {aiResult?.sbizAnalysis && (
                    <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "12px", padding: "12px 14px", marginBottom: "14px" }}>
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#34d399" }}>상권 적합도</span>
                        <span style={{ fontSize: "1rem", fontWeight: 800, color: "#34d399" }}>{aiResult.sbizAnalysis.overallScore}점</span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{aiResult.sbizAnalysis.summary}</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2.5">
                    {(() => {
                      const breakdown = sbizData
                        ? (() => {
                            const catMap = new Map<string, number>();
                            sbizData.stores.forEach((s) => {
                              const cat = s.indsMclsNm || s.indsSclsNm || "기타";
                              catMap.set(cat, (catMap.get(cat) ?? 0) + 1);
                            });
                            return [...catMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([cat, cnt]) => ({
                              category: cat,
                              count: cnt,
                              competition: (cnt >= 8 ? "높음" : cnt >= 4 ? "중간" : "낮음") as "높음" | "중간" | "낮음",
                            }));
                          })()
                        : (aiResult?.sbizAnalysis?.storeBreakdown ?? []);
                      const maxCount = Math.max(...breakdown.map((b) => b.count), 1);
                      return breakdown.map((b, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.75)" }}>{b.category}</span>
                            <div className="flex items-center gap-2">
                              <span style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: "99px", background: RISK_BG[b.competition] ?? "rgba(255,255,255,0.06)", color: RISK_COLOR[b.competition] ?? "white" }}>{b.competition}</span>
                              <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>{b.count}개</span>
                            </div>
                          </div>
                          <div className="rounded-full overflow-hidden" style={{ height: "5px", background: "rgba(255,255,255,0.07)" }}>
                            <div className="h-full rounded-full" style={{ width: `${(b.count / maxCount) * 100}%`, background: b.competition === "높음" ? "#ef4444" : b.competition === "중간" ? "#f59e0b" : "#10b981" }} />
                          </div>
                        </div>
                      ));
                    })()}
                  </div>

                  {aiResult?.sbizAnalysis?.competitionLevel && (
                    <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: "12px", lineHeight: 1.5 }}>
                      💡 {aiResult.sbizAnalysis.competitionLevel}
                    </p>
                  )}
                </div>

                {/* 위험 요소 분석 */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "22px" }}>
                  <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>위험 요소 분석</p>
                  <div className="flex flex-col gap-3">
                    {(aiResult?.riskFactors ?? []).map((r, i) => (
                      <div key={i} style={{ background: RISK_BG[r.level] ?? "rgba(255,255,255,0.04)", border: `1px solid ${RISK_COLOR[r.level] ?? "#fff"}22`, borderRadius: "12px", padding: "14px 16px" }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "99px", background: RISK_BG[r.level], color: RISK_COLOR[r.level] }}>{r.level}</span>
                          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "white" }}>{r.category}</span>
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: "6px" }}>{r.description}</p>
                        <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", display: "flex", gap: "5px", alignItems: "flex-start" }}>
                          <CheckCircle2 style={{ width: "12px", height: "12px", color: "#10b981", flexShrink: 0, marginTop: "1px" }} />{r.mitigation}
                        </p>
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

              {/* AI 입지 추천 */}
              <div className="flex flex-col gap-3 mb-4">
                {(aiResult?.sbizAnalysis?.locationRecommendations ?? []).map((loc) => (
                  <div key={loc.rank} style={{ background: loc.rank === 1 ? "rgba(16,185,129,0.07)" : "rgba(255,255,255,0.04)", border: loc.rank === 1 ? "1.5px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "18px 20px" }}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {loc.rank === 1 && (
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "99px", background: "rgba(16,185,129,0.2)", color: "#34d399" }}>AI 1순위</span>
                        )}
                        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "white" }}>{loc.area}</span>
                      </div>
                      <span style={{ fontSize: "0.9rem", fontWeight: 800, color: loc.score >= 80 ? "#34d399" : loc.score >= 65 ? "#f59e0b" : "#f87171", flexShrink: 0 }}>{loc.score}점</span>
                    </div>
                    <div className="rounded-full overflow-hidden mb-3" style={{ height: "5px", background: "rgba(255,255,255,0.07)" }}>
                      <div className="h-full rounded-full" style={{ width: `${loc.score}%`, background: loc.score >= 80 ? "linear-gradient(90deg,#10b981,#34d399)" : loc.score >= 65 ? "#f59e0b" : "#ef4444" }} />
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: "10px" }}>💡 {loc.reason}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>{loc.pros.map((p, j) => <p key={j} style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", display: "flex", gap: "5px", marginBottom: "3px" }}><span style={{ marginTop: "4px", width: "4px", height: "4px", borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />{p}</p>)}</div>
                      <div>{loc.cons.map((c, j) => <p key={j} style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", display: "flex", gap: "5px", marginBottom: "3px" }}><span style={{ marginTop: "4px", width: "4px", height: "4px", borderRadius: "50%", background: "#f97316", flexShrink: 0 }} />{c}</p>)}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 상가 밀집 건물 현황 (소상공인 API) */}
              {sbizData && sbizData.buildingGroups.length > 0 && (
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin style={{ width: "14px", height: "14px", color: "#34d399" }} />
                    <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "white" }}>상가 밀집 건물 현황</p>
                    <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "99px", background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }}>소상공인 API</span>
                  </div>
                  <div className="flex flex-col gap-0">
                    {sbizData.buildingGroups.slice(0, 5).map((bld, i) => (
                      <div key={i} className="flex items-start justify-between py-2.5" style={{ borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "white", marginBottom: "2px" }}>{bld.bldNm || "건물명 미상"}</p>
                          <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>📍 {bld.address}</p>
                          <div className="flex flex-wrap gap-1">
                            {bld.bizTypes.slice(0, 4).map((t, j) => (
                              <span key={j} style={{ fontSize: "0.62rem", padding: "1px 6px", borderRadius: "99px", background: "rgba(16,185,129,0.1)", color: "#6ee7b7" }}>{t}</span>
                            ))}
                          </div>
                        </div>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#34d399", flexShrink: 0, marginLeft: "8px" }}>{bld.count}개</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ══ 단계 5: 사업 계획 수립 ══ */}
          {currentStep === 5 && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "0.75rem", fontWeight: 600, color: "#34d399" }}>
                  <Clock style={{ width: "11px", height: "11px" }} /> 현재 단계
                </div>
                <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>사업 계획 수립</h2>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)" }}>예산과 수익 구조를 계획해요</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* 업종별 수익성 비교 */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "22px" }}>
                  <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>업종별 수익성 비교</p>
                  {(aiResult?.profitability ?? []).map((bar) => {
                    const maxVal = Math.max(...(aiResult?.profitability ?? []).map((b) => b.profitValue), 600);
                    return (
                      <div key={bar.bizType} className="mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: "0.82rem", color: bar.isTarget ? "white" : "rgba(255,255,255,0.5)", fontWeight: bar.isTarget ? 700 : 400 }}>{bar.bizType}</span>
                            {bar.isTarget && <span style={{ fontSize: "0.62rem", fontWeight: 700, background: "rgba(16,185,129,0.2)", color: "#34d399", padding: "2px 6px", borderRadius: "4px" }}>내 업종</span>}
                          </div>
                          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: bar.isTarget ? "#34d399" : "rgba(255,255,255,0.4)" }}>{bar.monthlyProfit}</span>
                        </div>
                        <div className="rounded-full overflow-hidden" style={{ height: "8px", background: "rgba(255,255,255,0.07)" }}>
                          <div className="h-full rounded-full" style={{ width: `${(bar.profitValue / maxVal) * 100}%`, background: bar.isTarget ? "linear-gradient(90deg,#10b981,#34d399)" : "rgba(255,255,255,0.15)" }} />
                        </div>
                        {bar.isTarget && bar.aiTip && (
                          <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: "10px", padding: "10px 12px", marginTop: "10px" }}>
                            <p style={{ fontSize: "0.72rem", color: "#34d399", fontWeight: 600, marginBottom: "3px" }}>AI 제안</p>
                            <p style={{ fontSize: "0.78rem", color: "white", lineHeight: 1.5 }}>{bar.aiTip}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 초기 투자 예산 */}
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "22px" }}>
                  <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>초기 투자 예산 분석</p>
                  {(aiResult?.budgetBreakdown ?? []).map((item, i, arr) => (
                    <div key={item.label} className="flex items-center justify-between py-3" style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                      <div>
                        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{item.label}</p>
                        <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{item.note}</p>
                      </div>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{item.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: "24px" }} />
            </>
          )}

          {/* ══ 단계 6: 임대료 추정 ══ */}
          {currentStep === 6 && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "0.75rem", fontWeight: 600, color: "#34d399" }}>
                  <LayoutGrid style={{ width: "11px", height: "11px" }} /> 현재 단계
                </div>
                <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>임대료 추정</h2>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)" }}>실제 계약된 부동산 거래 내역을 기반으로 임대료를 추정해요</p>
              </div>

              {/* 데이터 출처 배너 */}
              <div className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl" style={{ background: commercialCtx ? "rgba(16,185,129,0.07)" : "rgba(59,130,246,0.07)", border: commercialCtx ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(59,130,246,0.2)" }}>
                <MapPin style={{ width: "13px", height: "13px", color: commercialCtx ? "#34d399" : "#60a5fa", flexShrink: 0 }} />
                <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>
                  {commercialCtx
                    ? `국토교통부 실거래가 API · ${commercialCtx.latestYearMonth} 기준 · ${commercialCtx.sampleCount}건 분석`
                    : "지역 시세 기반 AI 추정"}
                </p>
              </div>

              {aiResult?.rentEstimation ? (
                <>
                  {/* 종합 추정 카드 */}
                  <div style={{ background: "rgba(16,185,129,0.07)", border: "1.5px solid rgba(16,185,129,0.3)", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#34d399", marginBottom: "10px" }}>AI 임대료 종합 추정</p>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", marginBottom: "4px" }}>보증금 범위</p>
                        <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "white" }}>{aiResult.rentEstimation.estimatedDeposit}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", marginBottom: "4px" }}>월 임대료 범위</p>
                        <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#34d399" }}>{aiResult.rentEstimation.estimatedMonthlyRent}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>📊 {aiResult.rentEstimation.basis}</p>
                  </div>

                  {/* 평형별 임대료 테이블 */}
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
                    <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "white", marginBottom: "12px" }}>평형별 임대료 추정</p>
                    <div className="flex flex-col gap-0">
                      {aiResult.rentEstimation.bySize.map((item, i, arr) => (
                        <div key={i} className="py-3" style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                          <div className="grid grid-cols-3 gap-3 mb-1">
                            <div>
                              <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginBottom: "3px" }}>면적</p>
                              <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "white" }}>{item.size}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginBottom: "3px" }}>보증금</p>
                              <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{item.deposit}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginBottom: "3px" }}>월세</p>
                              <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#34d399" }}>{item.monthlyRent}</p>
                            </div>
                          </div>
                          <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>{item.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 협상 팁 */}
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "16px 18px", marginBottom: "16px" }}>
                    <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#34d399", marginBottom: "10px" }}>💡 임대료 절감·협상 팁</p>
                    {aiResult.rentEstimation.tips.map((tip, i) => (
                      <p key={i} className="flex items-start gap-2 mb-2" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>
                        <span style={{ fontWeight: 700, color: "#34d399", flexShrink: 0 }}>{i + 1}.</span>{tip}
                      </p>
                    ))}
                  </div>

                  {/* 국토교통부 실거래 내역 */}
                  {commercialCtx && commercialCtx.trades.length > 0 && (
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "18px 20px" }}>
                      <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "white", marginBottom: "12px" }}>
                        국토교통부 실거래 내역 ({commercialCtx.latestYearMonth})
                      </p>
                      <div className="flex flex-col gap-0">
                        {commercialCtx.trades.slice(0, 10).map((t, i) => (
                          <div key={i} className="flex items-start justify-between py-2.5" style={{ borderBottom: i < 9 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "white", marginBottom: "2px" }}>{t.buildingName || "건물명 미상"}</p>
                              <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)" }}>{t.dong} · {t.floor}층 · {t.area}㎡ · {t.use}</p>
                            </div>
                            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#34d399", flexShrink: 0, marginLeft: "8px" }}>{t.amount}만원</span>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)", marginTop: "10px" }}>
                        평당 평균 거래금액: 약 {commercialCtx.avgAmountPerPyeong.toLocaleString()}만원/평 (총 {commercialCtx.sampleCount}건)
                      </p>
                    </div>
                  )}

                  {/* 한국부동산원 R-ONE 임대동향 */}
                  {roneData && roneData.items.length > 0 && (
                    <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "16px", padding: "18px 20px" }}>
                      <div className="flex items-center justify-between mb-3">
                        <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "white" }}>
                          한국부동산원 상업용부동산 임대동향
                        </p>
                        <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "99px", background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}>
                          {roneData.period}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0">
                        {roneData.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-2.5" style={{ borderBottom: i < roneData.items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                            <div>
                              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "white" }}>{item.region} · {item.type}</p>
                              {item.vacancyRate > 0 && (
                                <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                                  공실률 {item.vacancyRate.toFixed(1)}%
                                </p>
                              )}
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginBottom: "2px" }}>임대가격지수</p>
                              <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#a5b4fc" }}>
                                {item.rentIndex > 0 ? item.rentIndex.toFixed(1) : "-"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", marginTop: "10px" }}>
                        {roneData.source} · 기준시점 2021년 4분기=100
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "16px", padding: "40px", textAlign: "center" }}>
                  <p style={{ color: "rgba(255,255,255,0.25)" }}>AI 분석 결과를 불러오는 중입니다.</p>
                </div>
              )}
            </>
          )}

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
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "0.75rem", fontWeight: 600, color: "#34d399" }}>
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
                          <span style={{ fontSize: "0.88rem", color: done ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.85)", textDecoration: done ? "line-through" : "none" }}>
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
                color: "white", fontSize: "0.92rem", fontWeight: 700,
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

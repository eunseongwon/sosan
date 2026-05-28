import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Store,
  Search,
  TrendingUp,
  Wrench,
  ArrowRight,
  LineChart,
  ChevronLeft,
  Home,
  Bell,
  ListChecks,
  Clock3,
  Boxes,
  Calculator,
  CheckSquare,
  Star,
} from "lucide-react";
import { MarketPrice } from "./MarketPrice";
import { DxTools } from "./DxTools";

const PAGE_BG = {
  background:
    "radial-gradient(900px 420px at 62% 10%, rgba(16,185,129,0.15), transparent 62%), radial-gradient(700px 360px at 22% 26%, rgba(56,189,248,0.08), transparent 62%), linear-gradient(180deg, #060b14 0%, #0a101b 100%)",
};

export function ExistingOwnerMainPage() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"dashboard" | "market-price" | "tools">("dashboard");
  const ownerName = "검색수 사장님";

  const serviceCards = [
    {
      title: "월간 운영 분석",
      desc: "POS 데이터와 운영 기록으로 성장 지표를 한눈에 확인하세요.",
      icon: LineChart,
      button: "월간 분석 보기",
      path: "/ai-analysis",
      tint: "rgba(34,197,94,0.2)",
      progressColor: "bg-emerald-400",
    },
    {
      title: "실시간 식자재 시세",
      desc: "품목 가격 변동과 위험 구간을 빠르게 파악할 수 있습니다.",
      icon: TrendingUp,
      button: "시세 확인하기",
      path: "/market-price",
      tint: "rgba(59,130,246,0.2)",
      progressColor: "bg-blue-400",
    },
    {
      title: "운영 관리 서비스",
      desc: "체크리스트와 운영 도구로 반복 업무를 효율화하세요.",
      icon: Wrench,
      button: "운영 도구 바로가기",
      path: "/tools",
      tint: "rgba(249,115,22,0.2)",
      progressColor: "bg-violet-400",
    },
  ];

  return (
    <div className="min-h-screen text-white flex" style={PAGE_BG}>
      <aside className="hidden lg:flex w-[250px] border-r border-white/10 bg-[#0a1220]/88 backdrop-blur-xl flex-col">
        <div className="h-[66px] px-5 flex items-center border-b border-white/10">
          <button onClick={() => navigate("/community")} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_18px_rgba(16,185,129,0.35)]">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-zinc-100">
              소상<span className="text-emerald-400">광장으로 이동</span>
            </span>
          </button>
        </div>

        <div className="p-4 space-y-5">
          <div>
            <button
              onClick={() => setActiveView("dashboard")}
              className={`w-full text-left rounded-xl px-3.5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 ${
                activeView === "dashboard" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "text-zinc-300 hover:bg-white/5"
              }`}
            >
              <Home className="w-4 h-4" /> 대시보드
            </button>
          </div>

          <div>
            <div className="text-xs text-zinc-500 mb-2 px-1">분석</div>
            <div className="space-y-1">
              <button onClick={() => navigate("/ai-analysis")} className="w-full text-left rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 inline-flex items-center gap-2">
                <LineChart className="w-4 h-4 text-emerald-300" /> 월간 운영 분석
              </button>
              <button onClick={() => setActiveView("market-price")} className="w-full text-left rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 inline-flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-300" /> 실시간 식자재 시세
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs text-zinc-500 mb-2 px-1">운영 관리</div>
            <button onClick={() => setActiveView("tools")} className="w-full text-left rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 inline-flex items-center gap-2">
              <Wrench className="w-4 h-4 text-violet-300" /> 운영 관리 서비스
            </button>
          </div>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/20 to-blue-500/10 p-4">
            <div className="text-sm font-bold text-zinc-100 mb-1">데이터로 성장하는 사장님</div>
            <p className="text-xs text-zinc-300 leading-5">정확한 분석과 관리로 매출 상승을 경험하세요.</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="h-[66px] border-b border-white/10 bg-[#0b1220]/88 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-7 text-sm">
            <button onClick={() => setActiveView("dashboard")} className={`relative ${activeView === "dashboard" ? "text-emerald-300 font-semibold" : "text-white/70 hover:text-white"}`}>
              분석
              {activeView === "dashboard" && <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-emerald-400 rounded-full" />}
            </button>
            <button onClick={() => setActiveView("market-price")} className={`relative ${activeView === "market-price" ? "text-emerald-300 font-semibold" : "text-white/70 hover:text-white"}`}>
              시세
              {activeView === "market-price" && <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-emerald-400 rounded-full" />}
            </button>
            <button onClick={() => setActiveView("tools")} className={`relative ${activeView === "tools" ? "text-emerald-300 font-semibold" : "text-white/70 hover:text-white"}`}>
              운영 관리 서비스
              {activeView === "tools" && <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-emerald-400 rounded-full" />}
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <button className="h-9 px-3 rounded-lg border border-white/15 bg-white/5 text-sm text-zinc-200 inline-flex items-center gap-1.5">
              <Bell className="w-4 h-4" /> 알림
            </button>
            <button onClick={() => navigate("/community")} className="h-9 px-3 rounded-lg border border-white/15 bg-white/5 text-sm text-zinc-200 inline-flex items-center gap-1.5">
              <Search className="w-4 h-4" /> 검색
            </button>
            <button onClick={() => navigate("/community")} className="h-9 px-3 rounded-lg border border-white/15 bg-white/5 text-sm text-zinc-100">
              {ownerName}
            </button>
          </div>
        </header>

      {activeView === "market-price" && (
        <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
          <div className="mb-4">
            <button
              onClick={() => setActiveView("dashboard")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border border-white/15 bg-white/10 hover:bg-white/20"
            >
              <ChevronLeft className="w-4 h-4" /> 전용 메인으로 돌아가기
            </button>
          </div>
          <MarketPrice />
        </main>
      )}

      {activeView === "tools" && (
        <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
          <div className="mb-4">
            <button
              onClick={() => setActiveView("dashboard")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border border-white/15 bg-white/10 hover:bg-white/20"
            >
              <ChevronLeft className="w-4 h-4" /> 전용 메인으로 돌아가기
            </button>
          </div>
          <DxTools />
        </main>
      )}

      {activeView === "dashboard" && (
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-2 text-zinc-100">
          안녕하세요, <span className="text-emerald-300">{ownerName}</span>! 
        </h1>
        <p className="text-xl text-zinc-300 mb-8">오늘도 성공적인 하루 되세요.</p>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {serviceCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-[0_12px_35px_rgba(0,0,0,0.35)]">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-4 text-sm font-bold" style={{ background: card.tint, border: "1px solid rgba(255,255,255,0.12)" }}>
                  <Icon className="w-4 h-4" /> {card.title}
                </div>
                <p className="text-sm text-white/75 leading-6 min-h-[52px]">{card.desc}</p>
                <div className="h-14 rounded-xl mb-4 border border-white/10 bg-[#0a1220]/80 px-3 py-2">
                  <div className="h-2 rounded-full bg-white/10 mt-3">
                    <div className={`h-full w-[42%] rounded-full ${card.progressColor}`} />
                  </div>
                  <div className="text-right text-[13px] text-emerald-300 font-semibold mt-2">+3%</div>
                </div>
                <button
                  onClick={() => {
                    if (card.path === "/market-price") {
                      setActiveView("market-price");
                      return;
                    }
                    if (card.path === "/tools") {
                      setActiveView("tools");
                      return;
                    }
                    navigate(card.path);
                  }}
                  className="mt-5 w-full h-10 rounded-xl border border-white/15 bg-white/10 text-sm font-semibold hover:bg-white/20 transition-all inline-flex items-center justify-center gap-1.5"
                >
                  {card.button} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-[0_12px_35px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sky-300 text-sm font-bold inline-flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> 실시간 시세 현황
              </div>
              <span className="text-xs text-zinc-400">업데이트 10:30</span>
            </div>
            <div className="h-36 rounded-xl border border-white/10 bg-[#0e1828] px-3 py-3 mb-3 relative overflow-hidden">
              <div className="absolute left-0 right-0 top-8 h-[1px] bg-white/10" />
              <div className="absolute left-0 right-0 top-16 h-[1px] bg-white/10" />
              <div className="absolute left-0 right-0 top-24 h-[1px] bg-white/10" />
              <svg viewBox="0 0 500 120" className="w-full h-full">
                <path d="M0 70 L55 62 L110 78 L165 72 L220 68 L275 55 L330 64 L385 45 L440 36 L500 58" fill="none" stroke="#60a5fa" strokeWidth="3" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-zinc-400">품목 수</div>
                <div className="text-2xl font-bold text-zinc-100">30개</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-zinc-400">위험 품목</div>
                <div className="text-2xl font-bold text-rose-300">3개</div>
              </div>
            </div>
            <button onClick={() => setActiveView("market-price")} className="mt-4 w-full h-10 rounded-xl border border-white/15 bg-white/10 text-sm font-semibold hover:bg-white/20 transition-all">
              시세 전체 보기
            </button>
          </div>

          <div className="rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-[0_12px_35px_rgba(0,0,0,0.35)]">
            <div className="text-amber-300 text-sm font-bold mb-3 inline-flex items-center gap-2">
              <ListChecks className="w-4 h-4" /> 운영 관리 요약
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[
                { label: "재고 관리", icon: Boxes },
                { label: "체크리스트", icon: CheckSquare },
                { label: "업무 일정", icon: Clock3 },
                { label: "마진 계산", icon: Calculator },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={`${item.label}-${idx}`} className="rounded-xl border border-white/10 bg-[#0e1828] px-3 py-3 text-center">
                    <Icon className="w-4 h-4 mx-auto mb-2 text-violet-300" />
                    <div className="text-xs text-zinc-200">{item.label}</div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setActiveView("tools")} className="mt-4 w-full h-10 rounded-xl border border-white/15 bg-white/10 text-sm font-semibold hover:bg-white/20 transition-all">
              운영 관리 도구 열기
            </button>
          </div>
        </section>

        <div className="rounded-xl border border-white/10 bg-[#0e1828] px-4 py-3 flex items-center justify-between gap-2">
          <div className="text-sm text-zinc-300 inline-flex items-center gap-2">
            <Star className="w-4 h-4 text-emerald-300" /> 오늘의 인사이트: 전월 대비 매출이 8% 증가했어요! 이런 흐름을 유지해보세요.
          </div>
          <button onClick={() => navigate("/community")} className="h-9 px-4 rounded-lg border border-white/15 bg-white/10 text-sm text-zinc-100 hover:bg-white/20">
            상세 분석 보기
          </button>
        </div>
      </main>
      )}
      </div>
    </div>
  );
}

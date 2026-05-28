import { useNavigate } from "react-router";
import {
  Store, ArrowRight, ChevronLeft,
  FileText, Users, Wrench, TrendingUp, ShoppingCart,
  CheckCircle2, Star, Shield, Zap, Heart,
} from "lucide-react";

const services = [
  {
    badge: "01 — 정부 지원사업",
    icon: FileText,
    headline: "사장님 맞춤 지원사업,\nAI비서가 찾습니다.",
    desc: "창업 준비부터 매장 경영까지, 사장님의 프로필을 분석해 꼭 필요한 지원 정보를 실시간으로 연결해 드립니다.",
    points: ["업종·지역 맞춤 추천", "AI비서", "맞춤형 지원사업 큐레이션"],
    accentColor: "#10b981",
    bg: "from-emerald-950/60 to-[#141720]",
  },
  {
    badge: "02 — 사장님 커뮤니티",
    icon: Users,
    headline: "같은 고민,\n혼자 하지 마세요.",
    desc: "AI 트렌드 분석, 경영 고민 상담, 창업·메뉴 분석 AI까지. 전국 사장님 커뮤니티에 합류하세요.",
    points: ["AI 트렌드 분석", "창업·메뉴 분석 AI", "커뮤니티"],
    accentColor: "#34d399",
    bg: "from-emerald-950/60 to-[#141720]",
  },
  {
    badge: "03 — 서비스 도구",
    icon: Wrench,
    headline: "복잡한 매장 관리,\n디지털로 더 가볍게.",
    desc: "재고 현황부터 매출 장부, 직원 근태와 마진 계산까지. 매장 운영에 꼭 필요한 핵심 기능을 설치 없이 웹에서 한눈에 관리하세요.",
    points: ["매출·지출 장부", "재고 현황 차트", "마진 계산기"],
    accentColor: "#10b981",
    bg: "from-emerald-950/60 to-[#141720]",
  },
  {
    badge: "04 — 식자재 시세",
    icon: TrendingUp,
    headline: "시장 가기 전에\n시세 먼저 확인하세요.",
    desc: "매일 업데이트되는 식자재 가격과 주간 추이 차트로 최적의 구매 타이밍을. 가격 목표치 알림도 설정할 수 있어요.",
    points: ["실시간 가격 조회", "주간·월간 추이 차트", "가격 상승 알림"],
    accentColor: "#14b8a6",
    bg: "from-teal-950/60 to-[#141720]",
  },
  {
    badge: "05 — 광장 · 직거래·공구",
    icon: ShoppingCart,
    headline: "같이 사면 더 저렴해요,\n광장에서 만나요.",
    desc: "포스기, 냉장고, 테이블 등 업소용 집기를 사장님끼리 직거래하거나 공동구매로 원가를 낮추세요.",
    points: ["직거래 장터", "공동구매 절감", "나눔 섹션"],
    accentColor: "#3b82f6",
    bg: "from-blue-950/60 to-[#141720]",
  },
];

const stats = [
  { value: "12,847", label: "가입 사장님", suffix: "명" },
  { value: "324",    label: "지원사업",    suffix: "건" },
  { value: "5,291",  label: "커뮤니티 글", suffix: "개" },
  { value: "1,830",  label: "거래 완료",   suffix: "건" },
];

export function SignupPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#141720", minHeight: "100vh", color: "white" }}>

      {/* ── 상단 헤더 ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4"
        style={{ background: "rgba(20,23,32,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 transition-all"
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: "0.85rem" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
        >
          <ChevronLeft className="w-4 h-4" /> 홈으로
        </button>

        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#10b981,#34d399)" }}
          >
            <Store className="w-4 h-4 text-white" />
          </div>
          <span style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.03em" }}>소상광장</span>
        </div>

        <button
          onClick={() => navigate("/register")}
          className="flex items-center gap-1.5 px-4 h-9 rounded-lg transition-all"
          style={{
            background: "rgba(16,185,129,0.15)", color: "#10b981",
            border: "1px solid rgba(16,185,129,0.35)", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(16,185,129,0.25)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(16,185,129,0.15)")}
        >
          무료 가입
        </button>
      </header>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden">
        

        

        <h1
          className="mb-6"
          style={{ fontSize: "70px", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.04em", maxWidth: "720px" }}
        >
          소상공인을 위한<br />
          <span style={{ background: "linear-gradient(135deg, #10b981, #34d399)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent", display: "inline-block" }}>
            종합 비즈니스 플랫폼
          </span>
        </h1>

        <p
          className="mb-10"
          style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.5)", maxWidth: "540px", lineHeight: 1.75 }}
        >
          창업 준비부터 매장 경영까지,<br />
          사장님의 모든 순간을 함께하는 24시간 AI 비즈니스 파트너
        </p>

        {/* 통계 */}
        <div
          className="flex items-center gap-10 px-10 py-5 rounded-2xl mb-12"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {stats.map((s, i) => (
            <div key={s.label} className="text-center" style={{ borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none", paddingRight: i < stats.length - 1 ? "40px" : "0" }}>
              <p style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                {s.value}
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", marginLeft: "2px" }}>{s.suffix}</span>
              </p>
              <p style={{ fontSize: "0.7rem", fontWeight: 500, color: "rgba(255,255,255,0.3)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            const el = document.getElementById("service-01");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex flex-col items-center gap-2 transition-all"
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)" }}
        >
          
          
        </button>
      </section>

      {/* ── 5개 서비스 섹션 ── */}
      {services.map((svc, idx) => (
        <section
          key={svc.badge}
          id={`service-0${idx + 1}`}
          className="relative px-6 sm:px-10 lg:px-20 py-24 overflow-hidden"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at ${idx % 2 === 0 ? "20% 50%" : "80% 50%"}, ${svc.accentColor}10 0%, transparent 55%)` }}
          />

          <div
            className={`relative max-w-[1100px] mx-auto grid md:grid-cols-2 gap-16 items-center ${idx % 2 === 1 ? "md:[direction:rtl]" : ""}`}
          >
            {/* 텍스트 */}
            <div style={{ direction: "ltr" }}>
              <span
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-7"
                style={{
                  fontSize: "0.75rem", fontWeight: 600,
                  background: svc.accentColor + "20",
                  color: svc.accentColor,
                  border: `1px solid ${svc.accentColor}35`,
                }}
              >
                <svc.icon style={{ width: "13px", height: "13px" }} />
                {svc.badge}
              </span>

              <h2
                className="mb-5"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.04em", whiteSpace: "pre-line" }}
              >
                {svc.headline}
              </h2>

              <p
                className="mb-10 leading-relaxed"
                style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", maxWidth: "440px" }}
              >
                {svc.desc}
              </p>

              <div className="flex flex-col gap-4">
                {svc.points.map((pt) => (
                  <div key={pt} className="flex items-center gap-3">
                    <CheckCircle2 style={{ width: "18px", height: "18px", color: svc.accentColor, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.97rem", fontWeight: 500, color: "rgba(255,255,255,0.75)" }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 비주얼 카드 */}
            <div style={{ direction: "ltr" }} className="flex items-center justify-center">
              <div
                className="relative w-full max-w-[380px] aspect-square rounded-3xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${svc.accentColor}15, ${svc.accentColor}05)`,
                  border: `1px solid ${svc.accentColor}20`,
                  boxShadow: `0 40px 80px ${svc.accentColor}12`,
                }}
              >
                <div
                  className="w-28 h-28 rounded-3xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${svc.accentColor}, ${svc.accentColor}cc)`,
                    boxShadow: `0 20px 50px ${svc.accentColor}45`,
                  }}
                >
                  <svc.icon style={{ width: "56px", height: "56px", color: "white" }} />
                </div>

                {/* 장식 원 */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{ border: `2px dashed ${svc.accentColor}15`, margin: "16px" }}
                />

                {/* 포인트 뱃지 */}
                {svc.points.slice(0, 2).map((pt, pi) => (
                  <div
                    key={pt}
                    className="absolute px-4 py-2.5 rounded-xl"
                    style={{
                      background: "rgba(20,22,30,0.92)",
                      border: `1px solid ${svc.accentColor}25`,
                      backdropFilter: "blur(8px)",
                      boxShadow: `0 8px 24px rgba(0,0,0,0.3)`,
                      top: pi === 0 ? "14%" : undefined,
                      bottom: pi === 1 ? "14%" : undefined,
                      right: pi === 0 ? "-10%" : undefined,
                      left: pi === 1 ? "-10%" : undefined,
                    }}
                  >
                    <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "white", whiteSpace: "nowrap" }}>{pt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── 하단 CTA ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 60%)" }}
        />

        <div className="relative">
          

          <h2
            className="mb-5"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.04em" }}
          >
            소상광장에 합류하세요
          </h2>

          <p
            className="mb-12"
            style={{ fontSize: "1.02rem", color: "rgba(255,255,255,0.45)", maxWidth: "460px", margin: "0 auto 48px", lineHeight: 1.75 }}
          >로그인 하나로 서비스를&nbsp;&nbsp;이용할 수 있어요.<br />사장님의 성장을 소상광장이 함께 응원합니다.</p>

          <button
            onClick={() => navigate("/register")}
            className="flex items-center justify-center gap-2 mx-auto transition-all active:scale-[0.98]"
            style={{
              height: "60px", paddingLeft: "40px", paddingRight: "40px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
              color: "white", fontSize: "1.1rem", fontWeight: 700,
              border: "none", cursor: "pointer",
              boxShadow: "0 10px 36px rgba(16,185,129,0.48)",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 14px 46px rgba(16,185,129,0.65)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 10px 36px rgba(16,185,129,0.48)")}
          >
            무료로 시작하기 <ArrowRight className="w-5 h-5" />
          </button>

          <div
            className="flex items-center justify-center gap-8 mt-12"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "36px" }}
          >
            {[
              { icon: Zap,    text: "실시간 업데이트" },
              { icon: Shield, text: "검증된 정보" },
              { icon: Heart,  text: "사장님 중심" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.25)" }}>
                <item.icon style={{ width: "14px", height: "14px" }} />
                <span style={{ fontSize: "0.8rem" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
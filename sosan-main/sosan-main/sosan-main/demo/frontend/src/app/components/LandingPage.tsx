import { useNavigate } from "react-router";
import { ArrowRight, Store, BarChart2, TrendingUp, Star } from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#141720",
        color: "white",
        fontFamily: "'Noto Sans KR', sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* 배경 글로우 */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 55%)",
          zIndex: 0,
        }}
      />

      {/* 상단 네비 */}
      <nav
        className="relative flex items-center justify-between px-6 py-4 mx-auto"
        style={{ maxWidth: "1100px", zIndex: 1 }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#f97316,#fb923c)" }}
          >
            <Store size={18} className="text-white" />
          </div>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
            소상<span style={{ color: "#f97316" }}>광장</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.65)",
              borderRadius: "10px",
              padding: "8px 18px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            로그인
          </button>
          <button
            onClick={() => navigate("/home")}
            style={{
              background: "linear-gradient(135deg,#10b981,#34d399)",
              border: "none",
              color: "white",
              borderRadius: "10px",
              padding: "8px 18px",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: 700,
              boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
            }}
          >
            무료 시작
          </button>
        </div>
      </nav>

      {/* 히어로 */}
      <section
        className="relative flex flex-col items-center text-center px-6 pt-16 pb-20"
        style={{ zIndex: 1 }}
      >
        {/* 뱃지 */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.35)",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "#34d399",
          }}
        >
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          정식 출시 기념 1개월 무료 체험
        </div>

        {/* 타이틀 */}
        <h1
          style={{
            fontSize: "clamp(2.8rem, 7vw, 5rem)",
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          소상공인을 위한
          <br />
          <span style={{ color: "#10b981" }}>AI 사업 파트너</span>
        </h1>

        {/* 서브텍스트 */}
        <p
          style={{
            fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.85,
            maxWidth: "520px",
            marginBottom: "40px",
          }}
        >
          창업 준비부터 운영, 매출 상승 전략까지. 데이터와 AI가 사장님의
          비즈니스 성공을 확실하게 안내합니다.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate("/signup")}
          className="flex items-center gap-2.5 transition-transform"
          style={{
            background: "linear-gradient(135deg,#10b981,#34d399)",
            border: "none",
            color: "white",
            borderRadius: "16px",
            padding: "18px 36px",
            cursor: "pointer",
            fontSize: "1.05rem",
            fontWeight: 800,
            boxShadow: "0 8px 32px rgba(16,185,129,0.45)",
            letterSpacing: "-0.02em",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          지금 무료로 시작하기 <ArrowRight size={20} />
        </button>

        {/* 신뢰 지표 */}
        <div
          className="flex items-center gap-5 mt-10 flex-wrap justify-center"
          style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.28)" }}
        >
          <span className="flex items-center gap-1.5">
            <Star size={12} style={{ color: "#fbbf24" }} /> 4.9점 평균 만족도
          </span>
          <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
          <span>3,200+ 사장님 이용 중</span>
          <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
          <span>신용카드 없이 무료 시작</span>
        </div>
      </section>

      {/* 피처 카드 3개 */}
      <section
        className="relative px-6 pb-20 mx-auto"
        style={{ maxWidth: "1100px", zIndex: 1 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Store size={22} />,
              color: "#10b981",
              bg: "rgba(16,185,129,0.12)",
              title: "상권 및 입지 분석",
              desc: "AI가 최적의 매장 위치를 추천합니다.",
            },
            {
              icon: <TrendingUp size={22} />,
              color: "#6366f1",
              bg: "rgba(99,102,241,0.12)",
              title: "실시간 트렌드 파악",
              desc: "요즘 뜨는 아이템과 고객 수요를 확인하세요.",
            },
            {
              icon: <BarChart2 size={22} />,
              color: "#f97316",
              bg: "rgba(249,115,22,0.12)",
              title: "매출 시뮬레이션",
              desc: "예상 비용과 수익을 미리 계산해드립니다.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-center text-center rounded-2xl px-6 py-8 transition-all cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.borderColor = `${card.color}40`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              <div
                className="flex items-center justify-center rounded-xl mb-5"
                style={{ width: "52px", height: "52px", background: card.bg, color: card.color }}
              >
                {card.icon}
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>
                {card.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 푸터 */}
      <footer
        className="relative text-center pb-10"
        style={{ zIndex: 1, fontSize: "0.78rem", color: "rgba(255,255,255,0.18)" }}
      >
        © 2026 소상광장. All rights reserved.
      </footer>
    </div>
  );
}

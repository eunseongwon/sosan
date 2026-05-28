import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  Store, ArrowRight, Eye, EyeOff,
  Shield, Zap, Heart, Mail, Lock, User, ChevronLeft, Check,
  Briefcase,
} from "lucide-react";

const businessTypes = [
  { value: "food",          label: "외식업 (식당, 카페, 분식)" },
  { value: "retail",        label: "소매업 (편의점, 마트)" },
  { value: "service",       label: "서비스업 (미용, 세탁)" },
  { value: "manufacturing", label: "제조업 (공방, 제과)" },
  { value: "other",         label: "기타" },
];

const STEPS = ["가입 방법", "정보 입력", "완료"] as const;
type Step = "social" | "form" | "done";

export function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep]         = useState<Step>("social");
  const [email, setEmail]       = useState("");
  const [name, setName]         = useState("");
  const [password, setPw]       = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [business, setBusiness] = useState("");
  const [agreed, setAgreed]     = useState(false);

  /* ─── 스타일 헬퍼 ─── */
  const inputBase: React.CSSProperties = {
    width: "100%", height: "52px", padding: "0 48px 0 44px",
    borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.07)", color: "white",
    fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "rgba(16,185,129,0.6)";
    e.target.style.boxShadow   = "0 0 0 3px rgba(16,185,129,0.12)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.1)";
    e.target.style.boxShadow   = "none";
  };

  const stepIndex = step === "social" ? 0 : step === "form" ? 1 : 2;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: "#141720" }}
    >
      {/* 배경 글로우 */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(16,185,129,0.07) 0%, transparent 60%)" }}
      />

      {/* 카드 */}
      <div className="relative w-full" style={{ maxWidth: "440px" }}>

        {/* 로고 */}
        <Link to="/" className="flex items-center gap-2.5 mb-9">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg,#10b981,#34d399)" }}
          >
            <Store className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="text-white" style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
            소상<span style={{ color: "#10b981" }}>광장</span>
          </span>
        </Link>

        {/* 진행 단계 표시 */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: i < stepIndex ? "#10b981" : i === stepIndex ? "#10b981" : "rgba(255,255,255,0.08)",
                  fontSize: "0.72rem", fontWeight: 700,
                  color: i <= stepIndex ? "white" : "rgba(255,255,255,0.25)",
                }}
              >
                {i < stepIndex
                  ? <Check style={{ width: "13px", height: "13px" }} />
                  : i + 1
                }
              </div>
              <span style={{
                fontSize: "0.75rem",
                color: i === stepIndex ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
                fontWeight: i === stepIndex ? 600 : 400,
              }}>{label}</span>
              {i < STEPS.length - 1 && (
                <div className="w-6 h-[2px] rounded-full mx-1" style={{ background: i < stepIndex ? "#10b981" : "rgba(255,255,255,0.1)" }} />
              )}
            </div>
          ))}
        </div>

        {/* ══ STEP 1: 소셜 / 이메일 선택 ══ */}
        {step === "social" && (
          <div>
            <h1 className="text-white mb-1.5" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em" }}>
              무료로 시작하세요
            </h1>
            <p className="mb-8" style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.42)" }}>
              이메일 하나로 모든 서비스를 즉시 이용할 수 있어요.
            </p>

            {/* 소셜 가입 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                {
                  name: "카카오",
                  bg: "#FEE500", color: "#000",
                  icon: (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="#000">
                      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.737 1.65 5.147 4.138 6.612l-1.053 3.92a.3.3 0 00.46.328L9.9 19.25A11.518 11.518 0 0012 19.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
                    </svg>
                  ),
                },
                {
                  name: "네이버",
                  bg: "#03C75A", color: "#fff",
                  icon: (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff">
                      <path d="M16.273 12.845L7.376 3H3v18h7.727V11.155L19.624 21H24V3h-7.727z" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setStep("form")}
                  className="flex items-center justify-center gap-2 h-[50px] rounded-xl transition-all active:scale-[0.98]"
                  style={{ background: s.bg, color: s.color, fontSize: "0.88rem", fontWeight: 700, border: "none", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {s.icon}{s.name}로 가입
                </button>
              ))}
            </div>

            {/* 구분선 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)" }}>또는 이메일로 가입</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>

            {/* 이메일 입력 */}
            <form onSubmit={(e) => { e.preventDefault(); if (email.trim()) setStep("form"); }} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(255,255,255,0.25)" }} />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소를 입력하세요" required
                  style={{ ...inputBase, paddingRight: "18px" }}
                  onFocus={onFocus} onBlur={onBlur}
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                style={{
                  height: "56px", borderRadius: "14px",
                  background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                  color: "white", fontSize: "1.05rem", fontWeight: 700,
                  border: "none", cursor: "pointer",
                  boxShadow: "0 8px 28px rgba(16,185,129,0.45)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 36px rgba(16,185,129,0.62)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 8px 28px rgba(16,185,129,0.45)")}
              >
                이메일로 가입하기 <ArrowRight style={{ width: "18px", height: "18px" }} />
              </button>
            </form>

            {/* 로그인 링크 */}
            <p className="mt-6 text-center" style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.3)" }}>
              이미 계정이 있으신가요?{" "}
              <Link
                to="/login"
                style={{ color: "#10b981", fontWeight: 600, textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                로그인
              </Link>
            </p>

            {/* 신뢰 배지 */}
            <div className="flex items-center justify-center gap-8 mt-8 pt-7" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                { icon: Zap,    text: "실시간 업데이트" },
                { icon: Shield, text: "검증된 정보" },
                { icon: Heart,  text: "사장님 중심" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.22)" }}>
                  <item.icon style={{ width: "13px", height: "13px" }} />
                  <span style={{ fontSize: "0.73rem" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ STEP 2: 정보 입력 폼 ══ */}
        {step === "form" && (
          <div>
            <h1 className="text-white mb-1.5" style={{ fontSize: "1.9rem", fontWeight: 800, letterSpacing: "-0.04em" }}>
              정보를 입력해 주세요
            </h1>
            {email && (
              <p className="mb-7" style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.35)" }}>{email}</p>
            )}
            {!email && (
              <p className="mb-7" style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.35)" }}>소셜 계정으로 가입</p>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); setStep("done"); }}
              className="space-y-4"
            >
              {/* 이름 */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: "rgba(255,255,255,0.4)", marginBottom: "7px" }}>
                  사장님 이름
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(255,255,255,0.25)" }} />
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동" required
                    style={inputBase}
                    onFocus={onFocus} onBlur={onBlur}
                  />
                </div>
              </div>

              {/* 비밀번호 (이메일 가입만) */}
              {email && (
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: "rgba(255,255,255,0.4)", marginBottom: "7px" }}>
                    비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(255,255,255,0.25)" }} />
                    <input
                      type={showPw ? "text" : "password"}
                      value={password} onChange={(e) => setPw(e.target.value)}
                      placeholder="8자 이상 입력해 주세요" required minLength={8}
                      style={inputBase}
                      onFocus={onFocus} onBlur={onBlur}
                    />
                    <button
                      type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 0 }}
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* 업종 */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 500, color: "rgba(255,255,255,0.4)", marginBottom: "7px" }}>
                  업종 선택
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(255,255,255,0.25)", zIndex: 1 }} />
                  <select
                    value={business} onChange={(e) => setBusiness(e.target.value)} required
                    style={{
                      ...inputBase,
                      paddingLeft: "44px", paddingRight: "18px",
                      appearance: "none", cursor: "pointer",
                    }}
                    onFocus={onFocus} onBlur={onBlur}
                  >
                    <option value="" style={{ background: "#1a1c24" }}>업종을 선택해 주세요</option>
                    {businessTypes.map((bt) => (
                      <option key={bt.value} value={bt.value} style={{ background: "#1a1c24" }}>{bt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 약관 동의 */}
              <label className="flex items-start gap-3 cursor-pointer select-none pt-1">
                <div
                  onClick={() => setAgreed(!agreed)}
                  className="w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 mt-0.5"
                  style={{
                    background: agreed ? "#10b981" : "rgba(255,255,255,0.07)",
                    border: agreed ? "1.5px solid #10b981" : "1.5px solid rgba(255,255,255,0.15)",
                    cursor: "pointer",
                  }}
                >
                  {agreed && (
                    <svg viewBox="0 0 12 10" width="10" height="8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1,5 4.5,8.5 11,1" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                  <span style={{ color: "rgba(255,255,255,0.65)", textDecoration: "underline", cursor: "pointer" }}>이용약관</span> 및{" "}
                  <span style={{ color: "rgba(255,255,255,0.65)", textDecoration: "underline", cursor: "pointer" }}>개인정보처리방침</span>에 동의합니다.
                </span>
              </label>

              {/* 가입 버튼 */}
              <button
                type="submit"
                disabled={!agreed}
                className="w-full flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                style={{
                  marginTop: "6px", height: "56px", borderRadius: "14px",
                  background: agreed
                    ? "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                    : "rgba(16,185,129,0.25)",
                  color: "white", fontSize: "1.05rem", fontWeight: 700,
                  border: "none", cursor: agreed ? "pointer" : "not-allowed",
                  boxShadow: agreed ? "0 8px 28px rgba(16,185,129,0.45)" : "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { if (agreed) e.currentTarget.style.boxShadow = "0 12px 36px rgba(16,185,129,0.62)"; }}
                onMouseLeave={(e) => { if (agreed) e.currentTarget.style.boxShadow = "0 8px 28px rgba(16,185,129,0.45)"; }}
              >
                소상광장 시작하기 <ArrowRight style={{ width: "18px", height: "18px" }} />
              </button>
            </form>

            <button
              onClick={() => setStep("social")}
              className="flex items-center gap-1 mt-5 transition-all"
              style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.28)", background: "none", border: "none", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
            >
              <ChevronLeft style={{ width: "15px", height: "15px" }} /> 이전으로
            </button>
          </div>
        )}

        {/* ══ STEP 3: 완료 ══ */}
        {step === "done" && (
          <div className="text-center py-8">
            {/* 완료 아이콘 - 초록 */}
            <div
              className="mx-auto mb-7 flex items-center justify-center rounded-full relative"
              style={{
                width: "80px", height: "80px",
                background: "linear-gradient(135deg, #10b981, #34d399)",
                boxShadow: "0 16px 44px rgba(16,185,129,0.5)",
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle at 50% 120%, rgba(16,185,129,0.5) 0%, transparent 65%)", transform: "translateY(20px) scale(1.3)", filter: "blur(12px)" }}
              />
              <Check style={{ width: "40px", height: "40px", color: "white", strokeWidth: 2.5 }} />
            </div>
            <h2 className="text-white mb-2" style={{ fontSize: "1.9rem", fontWeight: 800, letterSpacing: "-0.04em" }}>
              가입 완료!
            </h2>
            <p className="mb-1.5" style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)" }}>
              소상광장에 오신 것을 환영합니다 🎉
            </p>
            <p className="mb-4" style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.3)" }}>
              {name || "사장님"}의 성공을 함께 응원할게요.
            </p>

            {/* AI 분석 안내 */}
            <div
              className="mb-8 rounded-2xl p-5 text-left"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#34d399" }}>가입 완료 혜택</span>
              </div>
              <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "white", marginBottom: "4px" }}>
                AI 맞춤 창업 분석을 무료로 받아보세요
              </p>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
                4가지 질문으로 나만을 위한 상권 분석 · 입지 추천 · 창업 시뮬레이션을 제공합니다.
              </p>
            </div>

            <div className="space-y-3">
              {/* AI 분석 시작 버튼 (메인) */}
              <button
                onClick={() => navigate("/ai-analysis")}
                className="w-full flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                style={{
                  height: "56px", borderRadius: "14px",
                  background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                  color: "white", fontSize: "1.05rem", fontWeight: 700,
                  border: "none", cursor: "pointer",
                  boxShadow: "0 8px 28px rgba(16,185,129,0.45)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 36px rgba(16,185,129,0.62)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 8px 28px rgba(16,185,129,0.45)")}
              >
                AI 맞춤 분석 시작하기 <ArrowRight style={{ width: "18px", height: "18px" }} />
              </button>
              {/* 홈으로 */}
              <button
                onClick={() => navigate("/")}
                className="w-full h-11 rounded-xl transition-all"
                style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
              >
                서비스 둘러보기
              </button>
              <button
                onClick={() => { setStep("social"); setEmail(""); setName(""); setPw(""); setBusiness(""); setAgreed(false); }}
                className="w-full h-11 rounded-xl transition-all"
                style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.25)", background: "transparent", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
              >
                다시 입력하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
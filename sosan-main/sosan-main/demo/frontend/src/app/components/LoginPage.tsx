import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  Store, ArrowRight, Eye, EyeOff,
  Shield, Zap, Heart, Mail, Lock,
} from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail]   = useState("");
  const [password, setPw]   = useState("");
  const [showPw, setShowPw] = useState(false);

  const inputBase: React.CSSProperties = {
    width: "100%", height: "52px", padding: "0 48px 0 44px",
    borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.07)", color: "white",
    fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(16,185,129,0.6)";
    e.target.style.boxShadow   = "0 0 0 3px rgba(16,185,129,0.12)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.1)";
    e.target.style.boxShadow   = "none";
  };

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

        {/* 헤더 */}
        <h1 className="text-white mb-1.5" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em" }}>
          다시 오셨군요!
        </h1>
        <p className="mb-8" style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.42)" }}>
          소상광장에 로그인하고 서비스를 이용하세요.
        </p>

        {/* 소셜 로그인 */}
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
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 h-[50px] rounded-xl transition-all active:scale-[0.98]"
              style={{ background: s.bg, color: s.color, fontSize: "0.88rem", fontWeight: 700, border: "none", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {s.icon}{s.name}로 로그인
            </button>
          ))}
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.25)" }}>또는 이메일로 로그인</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* 이메일 로그인 폼 */}
        <form
          onSubmit={(e) => { e.preventDefault(); navigate("/"); }}
          className="space-y-3"
        >
          {/* 이메일 */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(255,255,255,0.25)" }} />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소" required
              style={{ ...inputBase, paddingRight: "18px" }}
              onFocus={onFocus} onBlur={onBlur}
            />
          </div>

          {/* 비밀번호 */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "rgba(255,255,255,0.25)" }} />
            <input
              type={showPw ? "text" : "password"}
              value={password} onChange={(e) => setPw(e.target.value)}
              placeholder="비밀번호" required
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

          {/* 비밀번호 찾기 */}
          <div className="flex justify-end">
            <button
              type="button"
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", padding: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#10b981")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>

          {/* 로그인 버튼 */}
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
            로그인 <ArrowRight style={{ width: "18px", height: "18px" }} />
          </button>
        </form>

        {/* 회원가입 링크 */}
        <p className="mt-6 text-center" style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.3)" }}>
          아직 계정이 없으신가요?{" "}
          <Link
            to="/register"
            style={{ color: "#10b981", fontWeight: 600, textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            무료 가입
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
    </div>
  );
}

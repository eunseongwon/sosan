import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  Store,
  Home,
  FileText,
  Users,
  Briefcase,
  Wrench,
  MapPin,
  ShoppingCart,
  Menu,
  X,
  Bell,
  LogIn,
  ChevronUp,
  Phone,
  Mail,
  ExternalLink,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";

const navItems = [
  { path: "/home", label: "홈", icon: Home },
  { path: "/support", label: "지원사업", icon: FileText },
  { path: "/community", label: "커뮤니티", icon: Users },
  { path: "/tools", label: "서비스", icon: Wrench },
  { path: "/market-price", label: "시세", icon: TrendingUp },
  { path: "/trade", label: "광장", icon: ShoppingCart },
];

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 8);
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSignupClick = () => {
    setMobileOpen(false);
    navigate("/signup");
  };

  const handleLoginClick = () => {
    setMobileOpen(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-shadow duration-300 ${
          scrolled ? "shadow-xl border-white/5" : "border-transparent"
        }`}
        style={{
          backgroundColor: '#141720',
          backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 55%)`,
        }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[60px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-emerald-400 rounded-xl flex items-center justify-center shadow-sm">
                <Store className="w-[18px] h-[18px] text-white" />
              </div>
              <span className="text-white hidden sm:block" style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                소상<span className="text-primary">광장</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center">
              {navItems.map((item) => {
                const isActive =
                  item.path === "/home"
                    ? location.pathname === "/home"
                    : location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all duration-200 mx-0.5 ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-[15px] h-[15px]" />
                    <span style={{ fontSize: '0.84rem', fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5">
              <Button
                className="hidden md:flex h-9 px-3.5 rounded-xl items-center gap-1.5 transition-all"
                style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", fontSize: "0.82rem", fontWeight: 600 }}
                onClick={() => navigate("/ai-analysis")}
              >
                <Sparkles className="w-3.5 h-3.5" /> AI 분석
              </Button>
              <Button variant="ghost" size="icon" className="relative w-9 h-9 rounded-xl text-gray-400 hover:text-white hover:bg-white/5">
                <Bell className="w-[18px] h-[18px]" />
                <span className="absolute top-1 right-1 w-[7px] h-[7px] bg-red-500 rounded-full ring-2 ring-[#141720]" />
              </Button>

              <div className="hidden sm:flex items-center gap-1.5 ml-1.5">
                <Button
                  variant="ghost"
                  className="h-9 px-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5"
                  style={{ fontSize: '0.84rem' }}
                  onClick={handleLoginClick}
                >
                  <LogIn className="w-4 h-4 mr-1.5" /> 로그인
                </Button>
                <Button
                  className="h-9 px-4 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-sm"
                  style={{ fontSize: '0.84rem' }}
                  onClick={handleSignupClick}
                >
                  무료 가입
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden w-9 h-9 rounded-xl text-gray-400 hover:text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/5 animate-in slide-in-from-top-2 duration-200" style={{ backgroundColor: '#141720' }}>
            <nav className="flex flex-col p-3 gap-0.5">
              {navItems.map((item) => {
                const isActive =
                  item.path === "/home"
                    ? location.pathname === "/home"
                    : location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-400 hover:bg-white/5 hover:text-white active:bg-white/10"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span style={{ fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                  </Link>
                );
              })}
              <div className="flex gap-2 mt-3 px-2 sm:hidden">
                <Button variant="outline" className="flex-1 rounded-xl h-11 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white" onClick={handleLoginClick}>로그인</Button>
                <Button
                  className="flex-1 rounded-xl h-11 bg-primary text-white"
                  onClick={handleSignupClick}
                >
                  무료 가입
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-[60vh]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-10">
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-emerald-400 rounded-lg flex items-center justify-center">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <span className="text-white" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  소상광장
                </span>
              </div>
              <p className="text-gray-400 max-w-xs leading-relaxed" style={{ fontSize: '0.85rem' }}>
                소상공인의 성장을 돕는 종합 플랫폼.<br />
                정보, 커뮤니티, 도구를 한 곳에서.
              </p>
              <div className="flex flex-col gap-2.5 mt-5">
                <a href="tel:1588-0000" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors" style={{ fontSize: '0.84rem' }}>
                  <Phone className="w-4 h-4" /> 1588-0000 (평일 09:00~18:00)
                </a>
                <a href="mailto:help@sajangnim.kr" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors" style={{ fontSize: '0.84rem' }}>
                  <Mail className="w-4 h-4" /> help@sajangnim.kr
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white mb-4" style={{ fontSize: '0.85rem', fontWeight: 600 }}>서비스</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "정부 지원사업", path: "/support" },
                  { label: "사장님 커뮤니티", path: "/community" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link to={item.path} className="text-gray-400 hover:text-white transition-colors" style={{ fontSize: '0.84rem' }}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4" style={{ fontSize: '0.85rem', fontWeight: 600 }}>도구</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "재고 관리", path: "/tools" },
                  { label: "매출/지출 장부", path: "/tools" },
                  { label: "직원 근무관리", path: "/tools" },
                  { label: "마진 계산기", path: "/tools" },
                  { label: "중고 거래소", path: "/market" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link to={item.path} className="text-gray-400 hover:text-white transition-colors" style={{ fontSize: '0.84rem' }}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4" style={{ fontSize: '0.85rem', fontWeight: 600 }}>고객지원</h4>
              <ul className="space-y-2.5">
                {["공지사항", "자주 묻는 질문", "이용약관", "개인정보처리방침", "문의하기"].map((item) => (
                  <li key={item}>
                    <span className="text-gray-400 hover:text-white transition-colors cursor-pointer" style={{ fontSize: '0.84rem' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4" style={{ fontSize: '0.85rem', fontWeight: 600 }}>관련기관</h4>
              <ul className="space-y-2.5">
                {[
                  { label: "소상공인시장진흥공단", url: "https://www.semas.or.kr" },
                  { label: "중소벤처기업부", url: "https://www.mss.go.kr" },
                  { label: "소상공인마당", url: "https://www.sbiz.or.kr" },
                  { label: "창업진흥원", url: "https://www.kised.or.kr" },
                  { label: "신용보증기금", url: "https://www.kodit.co.kr" },
                  { label: "기술보증기금", url: "https://www.kibo.or.kr" },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1"
                      style={{ fontSize: '0.84rem' }}
                    >
                      {item.label}
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-gray-500" style={{ fontSize: '0.8rem' }}>
              &copy; 2026 소상광장. All rights reserved.
            </span>
            <span className="text-gray-500" style={{ fontSize: '0.8rem' }}>
              사업자등록번호 000-00-00000 | 대표 홍길동
            </span>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-white border border-border rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
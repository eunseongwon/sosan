import { Link, useNavigate } from "react-router";
import {
  FileText,
  Users,
  Wrench,
  ShoppingCart,
  ArrowRight,
  TrendingUp,
  Bell,
  Search,
  MessageCircle,
  Sparkles,
  Clock,
  Store,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

/* ────────── Data (경영 및 지원사업 데이터) ────────── */
const heroSlides = [
  {
    badge: "사장님 전용 경영 AI",
    title: "데이터로 앞서가는\n성공 경영 파트너",
    sub: "전주·전북 지역 실시간 유동인구 분석부터 나에게 딱 맞는 지원사업까지. 이제 감이 아닌 데이터로 결정하세요.",
    cta: "무료 경영 분석 받기",
    accent: "linear-gradient(135deg,#10b981,#34d399)",
    bg: "from-emerald-950/80 via-[#141720] to-[#141720]",
  }
];

// 우측 카드용: 마감 임박 지원사업 데이터 (image_30a586.png 디자인 적용)
const hotSupportProjects = [
  { 
    name: "디지털 전환 지원", 
    amount: "최대 500만", 
    dDay: "D-3", 
    category: "IT/기기",
    status: "urgent" 
  },
  { 
    name: "지역 임차료 보조금", 
    amount: "월 30만", 
    dDay: "D-12", 
    category: "금융/지원",
    status: "active" 
  },
  { 
    name: "청년창업 컨설팅", 
    amount: "전액 무료", 
    dDay: "D-25", 
    category: "교육/컨설팅",
    status: "active" 
  },
];

// 하단 시세 섹션 데이터
const ingredientTrends = [
  { name: "배추 (10kg)", price: "24,500", change: "+12.5%", status: "up", category: "채소류" },
  { name: "무 (20kg)", price: "18,200", change: "+8.3%", status: "up", category: "채소류" },
  { name: "돈육 (삼겹살/kg)", price: "21,000", change: "-2.1%", status: "down", category: "육류" },
  { name: "대파 (1kg)", price: "3,400", change: "+5.4%", status: "up", category: "채소류" },
  { name: "식용유 (18L)", price: "52,000", change: "0.0%", status: "stable", category: "가공식품" },
];

const stats = [
  { label: "실시간 분석 업장", value: "12,847", suffix: "개", icon: Store, color: "#10b981" },
  { label: "지원사업 정보", value: "324", suffix: "건", icon: FileText, color: "#34d399" },
  { label: "성공 경영 노하우", value: "5,291", suffix: "건", icon: MessageCircle, color: "#10b981" },
  { label: "직거래 매칭", value: "1,830", suffix: "건", icon: ShoppingCart, color: "#3b82f6" },
];

const quickLinks = [
  { icon: FileText, label: "맞춤 지원사업", desc: "나에게 딱 맞는 보조금 찾기", path: "/support", color: "#10b981" },
  { icon: Store, label: "상권 분석", desc: "지역별 유동인구 분석", path: "/ai-analysis", color: "#34d399" },
  { icon: Wrench, label: "디지털 장부", desc: "매출·매입 자동 관리", path: "/tools", color: "#10b981" },
  { icon: TrendingUp, label: "식자재 시세", desc: "실시간 전국 도매시장 시세", path: "/market-price", color: "#14b8a6" },
  { icon: MessageCircle, label: "사장님 커뮤니티", desc: "업종별 사장님 고민 해결", path: "/community", color: "#3b82f6" },
];

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const current = heroSlides[0];

  return (
    <div style={{ background: "#141720", minHeight: "100vh", color: "white" }}>

      {/* ══════════ HERO SECTION (지원사업 리포트 적용) ══════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: 750, display: 'flex', alignItems: 'center' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className={`absolute inset-0 bg-gradient-to-r ${current.bg}`} />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* 왼쪽: 헤드라인 */}
            <div className="flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8" 
                   style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "0.85rem", fontWeight: 700, color: "#34d399" }}>
                <Sparkles className="w-4 h-4" />
                {current.badge}
              </div>

              <h1 className="text-white mb-8" style={{ fontSize: "clamp(2.5rem, 5.5vw, 4rem)", fontWeight: 850, lineHeight: 1.2, letterSpacing: "-0.03em" }}>
                {current.title}
              </h1>

              <p className="mb-12" style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, whiteSpace: "pre-line", maxWidth: "540px" }}>
                {current.sub}
              </p>

              <div className="flex flex-wrap gap-5">
                <button onClick={() => navigate("/ai-analysis")} 
                        className="flex items-center gap-3 px-10 h-16 rounded-2xl text-white font-bold transition-all hover:scale-105" 
                        style={{ background: current.accent, boxShadow: "0 10px 30px rgba(16,185,129,0.4)" }}>
                  {current.cta} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 오른쪽: 수정된 지원사업 리포트 카드 (image_30a586.png 레이아웃 반영) */}
            <div className="hidden md:block">
              <div className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[40px] p-10 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6 text-emerald-400" />
                    <span className="font-extrabold text-xl text-white">맞춤 지원사업 알림</span>
                  </div>
                 
                </div>
                
                <div className="space-y-6">
                  {hotSupportProjects.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-5 rounded-2xl bg-white/5 border border-white/5 transition-all hover:bg-white/10 group cursor-pointer">
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-wider">{item.category}</p>
                        <p className="text-lg font-black group-hover:text-emerald-400 transition-colors text-white">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.amount} 지원</p>
                      </div>
                      <div className={`flex items-center gap-1 font-black text-xl ${item.status === 'urgent' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {item.dDay}
                        <ArrowUpRight className="w-5 h-5 opacity-50" />
                      </div>
                    </div>
                  ))}
                </div>

        
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ SEARCH SECTION ══════════ */}
      <section className="py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold mb-10 text-emerald-400">검색 한 번으로 경영 문제 해결</h2>
          <div className="relative max-w-3xl mx-auto">
            <input 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              placeholder="지원사업, 상권 분석, 식자재 시세 검색" 
              className="w-full h-20 pl-8 pr-24 rounded-3xl bg-white/5 border border-white/10 text-white outline-none focus:border-emerald-500/50 transition-all shadow-2xl" 
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ STATS & QUICK LINKS ══════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-3xl p-8 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 transition-transform hover:scale-110"><s.icon className="w-7 h-7" style={{ color: s.color }} /></div>
              <div>
                <p className="text-2xl font-black text-white">{s.value}<span className="text-xs text-gray-500 ml-1 font-bold">{s.suffix}</span></p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-2xl font-extrabold mb-10 flex items-center gap-3 text-white">
          <Wrench className="w-6 h-6 text-emerald-400" />
          핵심 서비스 바로가기
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-24">
          {quickLinks.map((q) => (
            <Link key={q.path} to={q.path} className="group">
              <div className="h-full bg-white/5 border border-white/10 p-8 rounded-[32px] hover:bg-white/[0.08] transition-all hover:-translate-y-2 shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 transition-transform group-hover:rotate-12"><q.icon className="w-6 h-6" style={{ color: q.color }} /></div>
                <p className="font-black text-lg mb-3 text-white">{q.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">{q.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* ══════════ INGREDIENT PRICE TREND ══════════ */}
        <div className="bg-white/5 border border-white/10 rounded-[48px] p-12 shadow-sm">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black mb-2 flex items-center gap-3 text-white">
                <TrendingUp className="w-7 h-7 text-emerald-400" />
                실시간 식자재 시세 추이
              </h3>
              <p className="text-sm text-gray-500 font-medium">전국 도매시장 데이터를 기반으로 실시간 가격 변동을 제공합니다.</p>
            </div>
            <Link to="/market-price" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-emerald-400 transition-colors">
              전체 시세 보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {ingredientTrends.map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-[32px] p-6 hover:bg-white/[0.07] transition-all group">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-3 block">{item.category}</span>
                <h4 className="font-black text-lg mb-2 text-white">{item.name}</h4>
                <p className="text-2xl font-black mb-4 text-white">{item.price}<span className="text-xs ml-1 font-bold text-gray-500">원</span></p>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ${
                  item.status === 'up' ? 'text-red-400 bg-red-400/10' : 
                  item.status === 'down' ? 'text-blue-400 bg-blue-400/10' : 
                  'text-gray-400 bg-white/5'
                }`}>
                  {item.status === 'up' ? <ArrowUpRight className="w-3 h-3" /> : item.status === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
import { useState } from "react";
import {
  Search,
  Filter,
  Clock,
  Building2,
  ChevronDown,
  ExternalLink,
  Bell,
  Bookmark,
  BookmarkCheck,
  Tag,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

const categories = ["전체", "자금 지원", "교육/컨설팅", "디지털 전환", "임차료", "마케팅", "수출"];
const regions = ["전국", "서울", "경기", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

const supportData = [
  {
    id: 1, title: "2026년 소상공인 디지털 전환 지원사업", org: "중소벤처기업부", category: "디지털 전환", region: "전국",
    amount: "최대 500만원", deadline: "2026.03.31", status: "접수중",
    desc: "소상공인의 온라인 판로 개척 및 디지털 역량 강화를 위한 맞춤형 지원 사업입니다.",
    tags: ["디지털전환", "온라인판매"],
  },
  {
    id: 2, title: "서울시 소상공인 임차료 보조금", org: "서울특별시", category: "임차료", region: "서울",
    amount: "월 최대 30만원 (6개월)", deadline: "2026.04.15", status: "접수중",
    desc: "서울 소재 소상공인 임차료 부담 경감을 위한 보조금 지원 프로그램",
    tags: ["임차료", "서울시"],
  },
  {
    id: 3, title: "경기도 소상공인 경영안정 자금", org: "경기도", category: "자금 지원", region: "경기",
    amount: "최대 3,000만원 (저금리 대출)", deadline: "2026.03.20", status: "접수중",
    desc: "경기도 내 소상공인의 경영 안정을 위한 저금리 대출 프로그램",
    tags: ["대출", "경기도"],
  },
  {
    id: 4, title: "부산시 전통시장 현대화 사업", org: "부산광역시", category: "마케팅", region: "부산",
    amount: "점포당 최대 200만원", deadline: "2026.05.01", status: "접수예정",
    desc: "전통시장 내 소상공인 점포 시설 현대화 및 마케팅 지원",
    tags: ["전통시장", "현대화"],
  },
  {
    id: 5, title: "소상공인 스마트상점 기술보급", org: "소상공인시장진흥공단", category: "디지털 전환", region: "전국",
    amount: "최대 700만원", deadline: "2026.04.30", status: "접수중",
    desc: "스마트 결제, 키오스크, 재고관리 시스템 등 기술 도입 비용 지원",
    tags: ["스마트상점", "키오스크"],
  },
  {
    id: 6, title: "소상공인 무료 세무/법률 컨설팅", org: "중소벤처기업부", category: "교육/컨설팅", region: "전국",
    amount: "무료", deadline: "상시 접수", status: "상시",
    desc: "세무, 법률, 노무 등 소상공인 경영 관련 전문가 무료 상담 서비스",
    tags: ["컨설팅", "세무"],
  },
  {
    id: 7, title: "인천시 소상공인 수출 지원사업", org: "인천광역시", category: "수출", region: "인천",
    amount: "최대 1,000만원", deadline: "2026.06.30", status: "접수중",
    desc: "해외 온라인 플랫폼 입점 및 수출 역량 강화 지원",
    tags: ["수출", "해외판매"],
  },
  {
    id: 8, title: "소상공인 역량강화 아카데미", org: "소상공인시장진흥공단", category: "교육/컨설팅", region: "전국",
    amount: "무료 (교육비 전액 지원)", deadline: "2026.05.15", status: "접수예정",
    desc: "SNS 마케팅, 경영전략, 재무관리 등 온·오프라인 교육 과정 제공",
    tags: ["교육", "마케팅"],
  },
];

export function GovernmentSupport() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedRegion, setSelectedRegion] = useState("전국");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set([2, 6]));
  const [showRegionFilter, setShowRegionFilter] = useState(false);

  const filtered = supportData.filter((item) => {
    const matchCategory = selectedCategory === "전체" || item.category === selectedCategory;
    const matchRegion = selectedRegion === "전국" || item.region === selectedRegion || item.region === "전국";
    const matchSearch = !searchQuery || item.title.includes(searchQuery) || item.desc.includes(searchQuery);
    return matchCategory && matchRegion && matchSearch;
  });

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "접수중": return { background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.25)" };
      case "접수예정": return { background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)" };
      default: return { background: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)" };
    }
  };

  return (
    <div 
      className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10"
      style={{
        minHeight: '100vh',
        backgroundColor: '#141720',
        backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 50%)`,
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(59,130,246,0.15)" }}>
            <Building2 className="w-4 h-4" style={{ color: "#60a5fa" }} />
          </div>
          <h1 className="text-white" style={{ fontSize: '1.55rem', fontWeight: 700, letterSpacing: '-0.02em' }}>정부 지원사업 알림</h1>
        </div>
        <p className="text-gray-400" style={{ fontSize: '0.9rem' }}>지자체별 소상공인 지원금 · 대출 · 교육 정보를 한눈에 확인하세요</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "접수 중", value: supportData.filter(s => s.status === "접수중").length + "건", bg: "rgba(16,185,129,0.1)", color: "#10b981" },
          { label: "접수 예정", value: supportData.filter(s => s.status === "접수예정").length + "건", bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
          { label: "마감 임박", value: "2건", bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
          { label: "내 북마크", value: bookmarks.size + "건", bg: "rgba(59,130,246,0.1)", color: "#60a5fa" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4 text-center" style={{ background: stat.bg }}>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: '0.78rem', fontWeight: 500, color: stat.color, opacity: 0.7 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Notification Banner */}
      <div
        className="flex items-center gap-3 rounded-xl p-4 mb-6"
        style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.15)" }}>
          <Bell className="w-5 h-5" style={{ color: "#60a5fa" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white" style={{ fontSize: '0.88rem', fontWeight: 600 }}>맞춤 지원사업 알림 받기</p>
          <p className="text-gray-500" style={{ fontSize: '0.78rem' }}>내 업종 · 지역에 맞는 지원사업이 등록되면 알림을 보내드려요</p>
        </div>
        <Button className="text-white rounded-xl shrink-0 h-9 px-4 shadow-sm" style={{ background: "#3b82f6", fontSize: '0.82rem' }}>
          알림 설정
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="지원사업명, 키워드로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/40 focus:ring-primary/20"
          />
        </div>
        <div className="relative">
          <Button
            variant="outline"
            className="rounded-xl h-11 border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white px-4"
            onClick={() => setShowRegionFilter(!showRegionFilter)}
          >
            <MapPinIcon className="w-4 h-4 mr-1.5 text-gray-400" />
            {selectedRegion}
            <ChevronDown className="w-3.5 h-3.5 ml-2 text-gray-400" />
          </Button>
          {showRegionFilter && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowRegionFilter(false)} />
              <div className="absolute right-0 top-full mt-2 z-20 bg-[#1a1d24] border border-white/10 rounded-xl shadow-xl p-2 w-52 max-h-64 overflow-y-auto">
                {regions.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setSelectedRegion(r); setShowRegionFilter(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedRegion === r ? "bg-primary/10 text-primary" : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                    style={{ fontSize: '0.85rem', fontWeight: selectedRegion === r ? 600 : 400 }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full transition-all ${
              selectedCategory === cat
                ? "bg-primary text-white shadow-sm"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
            onClick={() => setSelectedCategory(cat)}
            style={{ fontSize: '0.82rem', fontWeight: 500 }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mb-3">
        <p className="text-gray-500" style={{ fontSize: '0.82rem' }}>
          총 <span className="text-white" style={{ fontWeight: 600 }}>{filtered.length}건</span>
        </p>
      </div>

      {/* Table */}
      <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
        {/* Table Header */}
        <div className="grid border-b border-white/10 bg-white/5 px-4" style={{ gridTemplateColumns: '32px 90px 1fr 140px 110px 80px' }}>
          <div className="py-3" />
          <div className="py-3 text-gray-400 text-center" style={{ fontSize: '0.78rem', fontWeight: 600 }}>지역</div>
          <div className="py-3 text-gray-400 pl-3" style={{ fontSize: '0.78rem', fontWeight: 600 }}>사업명 / 기관</div>
          <div className="py-3 text-gray-400 text-right" style={{ fontSize: '0.78rem', fontWeight: 600 }}>지원금액</div>
          <div className="py-3 text-gray-400 text-center" style={{ fontSize: '0.78rem', fontWeight: 600 }}>마감일</div>
          <div className="py-3 text-gray-400 text-center" style={{ fontSize: '0.78rem', fontWeight: 600 }}>상태</div>
        </div>

        {/* Table Rows */}
        {filtered.map((item) => (
          <div
            key={item.id}
            className="grid border-b border-white/5 last:border-0 hover:bg-emerald-500/10 transition-colors group px-4 items-center"
            style={{ gridTemplateColumns: '32px 90px 1fr 140px 110px 80px' }}
          >
            {/* Bookmark */}
            <button
              onClick={() => toggleBookmark(item.id)}
              className={`w-7 h-7 flex items-center justify-center transition-colors ${
                bookmarks.has(item.id) ? "text-primary" : "text-gray-600 hover:text-gray-400"
              }`}
            >
              {bookmarks.has(item.id) ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {/* Region */}
            <div className="py-4 text-center">
              <div className="text-gray-300" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{item.region}</div>
              <div className="text-gray-500 mt-0.5" style={{ fontSize: '0.7rem' }}>{item.category}</div>
            </div>

            {/* Title + Org */}
            <div className="py-4 pl-3 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="truncate text-gray-200 group-hover:text-primary transition-colors" style={{ fontSize: '0.92rem', fontWeight: 600 }}>
                  {item.title}
                </h3>
                <ExternalLink className="w-3.5 h-3.5 text-gray-600 hover:text-gray-400 cursor-pointer shrink-0 transition-colors" />
              </div>
              <div className="text-gray-500 truncate mt-0.5" style={{ fontSize: '0.76rem' }}>{item.org}</div>
            </div>

            {/* Amount */}
            <div className="py-4 text-right pr-2">
              <span className="text-primary" style={{ fontSize: '0.88rem', fontWeight: 700 }}>{item.amount}</span>
            </div>

            {/* Deadline */}
            <div className="py-4 text-center">
              <span className="text-gray-400" style={{ fontSize: '0.82rem' }}>{item.deadline}</span>
            </div>

            {/* Status */}
            <div className="py-4 flex justify-center">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full"
                style={{ fontSize: '0.68rem', fontWeight: 600, ...getStatusStyle(item.status) }}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
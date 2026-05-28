import { useState } from "react";
import {
  MessageSquare,
  ThumbsUp,
  Eye,
  Clock,
  PenSquare,
  Search,
  Pin,
  Flame,
  X,
  Image as ImageIcon,
  BarChart3,
  Users,
  TrendingUp,
  Bell,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { BusinessInsight } from "./BusinessInsight";
import { useNavigate } from "react-router";

const boardCategories = [
  "전체", "외식업", "서비스업", "소매업", "도매업", "제조업", "프랜차이즈", "자유게시판", "노하우",
];

const mockPosts = [
  {
    id: 1, category: "외식업", title: "배달앱 수수료 줄이는 현실적인 방법 공유합니다",
    content: "3년째 치킨집 운영 중인데, 배달앱 수수료를 줄이면서도 매출을 유지하는 방법을 찾았습니다.",
    author: "치킨사장", avatar: "🐔", date: "2시간 전", views: 1283, likes: 123, comments: 47, isPinned: true, isHot: true,
  },
  {
    id: 2, category: "서비스업", title: "1인 카페 운영 6개월 차 후기 (현실 매출 공개)",
    content: "동네에 카페를 열고 6개월이 지났습니다. 현실적인 매출을 정리해봤습니다.",
    author: "카페장인", avatar: "☕", date: "5시간 전", views: 892, likes: 89, comments: 32, isPinned: false, isHot: true,
  },
  {
    id: 3, category: "노하우", title: "재고관리 엑셀 대신 이거 써보세요 (무료 도구 추천)",
    content: "엑셀로 재고관리 하다가 한계를 느껴서 찾아본 무료 도구들을 비교해봤습니다.",
    author: "효율왕", avatar: "📊", date: "8시간 전", views: 2156, likes: 156, comments: 28, isPinned: false, isHot: true,
  },
  {
    id: 4, category: "소매업", title: "편의점 야간 무인 시스템 도입 3개월 후기",
    content: "인건비 절약을 위해 야간 무인 시스템을 도입했는데 생각보다 만족스럽습니다.",
    author: "24시사장", avatar: "🏪", date: "12시간 전", views: 567, likes: 45, comments: 19, isPinned: false, isHot: false,
  },
  {
    id: 5, category: "프랜차이즈", title: "프차 본사와 분쟁 시 대처법 (경험담)",
    content: "프랜차이즈 운영 3년 차에 본사와 갈등이 생겼을 때 어떻게 해결했는지 공유합니다.",
    author: "경험자", avatar: "⚖️", date: "1일 전", views: 3421, likes: 234, comments: 87, isPinned: false, isHot: true,
  },
  {
    id: 6, category: "자유게시판", title: "오늘 손님이 남긴 감동 리뷰에 울컥했습니다",
    content: "장한 지 1년, 힘들었는데 오늘 받은 리뷰 보 눈물이 났네요.",
    author: "감동사장", avatar: "😢", date: "1일 전", views: 1823, likes: 312, comments: 56, isPinned: false, isHot: false,
  },
  {
    id: 7, category: "외식업", title: "주방 동선 개선으로 피크타임 효율 30% 올린 방법",
    content: "작은 주방에서 효율적으로 일하기 위해 동선을 재배치했는데 효과가 엄청났습니다.",
    author: "주방장", avatar: "👨‍🍳", date: "2일 전", views: 876, likes: 98, comments: 23, isPinned: false, isHot: false,
  },
  {
    id: 8, category: "노하우", title: "인스타그램으로 월 매출 200만원 늘린 마케팅 전략",
    content: "SNS 마케팅 전혀 모르던 제가 인스타로 매출을 올린 방법을 단계별로 공유합니다.",
    author: "마케팅초보", avatar: "📱", date: "2일 전", views: 4532, likes: 456, comments: 112, isPinned: false, isHot: true,
  },
];

export function Community() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [showWrite, setShowWrite] = useState(false);
  const [writeForm, setWriteForm] = useState({ category: "자유게시판", title: "", content: "" });
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<"all" | "hot" | "latest">("all");
  const [mainTab, setMainTab] = useState<"community" | "insight">("community");
  const navigate = useNavigate();

  const filtered = mockPosts
    .filter((p) => {
      const matchCat = selectedCategory === "전체" || p.category === selectedCategory;
      const matchSearch = !searchQuery || p.title.includes(searchQuery) || p.content.includes(searchQuery);
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "hot") return b.likes - a.likes;
      if (sortBy === "latest") return 0;
      // pinned first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

  const toggleLike = (id: number) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
            <Users className="w-4 h-4" style={{ color: "#10b981" }} />
          </div>
          <h1 className="text-white" style={{ fontSize: "1.55rem", fontWeight: 700, letterSpacing: "-0.02em" }}>사장님 커뮤니티</h1>
        </div>
        <p className="text-gray-400" style={{ fontSize: "0.9rem" }}>업종별 노하우 공유 · 경영 고민 상담 · 데이터 기반 분석</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "전체 게시글", value: mockPosts.length + "개", bg: "rgba(16,185,129,0.1)", color: "#10b981" },
          { label: "HOT 게시글", value: mockPosts.filter((p) => p.isHot).length + "개", bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
          { label: "오늘 활성 사장님", value: "2,341명", bg: "rgba(59,130,246,0.1)", color: "#60a5fa" },
          { label: "내 공감 게시글", value: likedPosts.size + "개", bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4 text-center" style={{ background: stat.bg }}>
            <p style={{ fontSize: "1.25rem", fontWeight: 700, color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: "0.78rem", fontWeight: 500, color: stat.color, opacity: 0.7 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Notification Banner */}
      <div
        className="flex items-center gap-3 rounded-xl p-4 mb-6"
        style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.15)" }}>
          <Bell className="w-5 h-5" style={{ color: "#10b981" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white" style={{ fontSize: "0.88rem", fontWeight: 600 }}>인기 게시글 알림 받기</p>
          <p className="text-gray-500" style={{ fontSize: "0.78rem" }}>내 업종의 인기 게시글이 등록되면 알림을 보내드려요</p>
        </div>
        <Button
          className="text-white rounded-xl shrink-0 h-9 px-4 shadow-sm"
          style={{ background: "#10b981", fontSize: "0.82rem" }}
        >
          알림 설정
        </Button>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setMainTab("community")}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
            mainTab === "community"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/50"
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          style={{ fontSize: "0.88rem", fontWeight: 600 }}
        >
          <MessageSquare className="w-4 h-4" /> 게시판
        </button>
        <button
          onClick={() => setMainTab("insight")}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
            mainTab === "insight"
              ? "bg-orange-600 text-white shadow-md shadow-orange-900/50"
              : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          style={{ fontSize: "0.88rem", fontWeight: 600 }}
        >
          <BarChart3 className="w-4 h-4" /> 창업·메뉴 분석
        </button>
        <button
          onClick={() => navigate("/ai-analysis")}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap shrink-0 bg-white/5 text-emerald-400 hover:bg-emerald-500/20"
          style={{ fontSize: "0.88rem", fontWeight: 600, border: "1px solid rgba(16,185,129,0.3)" }}
        >
          <Sparkles className="w-4 h-4" /> AI 맞춤 분석
        </button>
      </div>

      {mainTab === "insight" ? (
        <BusinessInsight />
      ) : (
        <>
          {/* Write Form */}
          {showWrite && (
            <Card className="mb-6 border-0 shadow-lg ring-1 ring-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 style={{ fontWeight: 600, fontSize: "1.02rem" }}>새 글 작성</h3>
                  <button onClick={() => setShowWrite(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <select
                      className="border border-gray-200 rounded-xl px-3.5 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                      value={writeForm.category}
                      onChange={(e) => setWriteForm({ ...writeForm, category: e.target.value })}
                    >
                      {boardCategories.filter((c) => c !== "전체").map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <Input
                      placeholder="제목을 입력하세요"
                      value={writeForm.title}
                      onChange={(e) => setWriteForm({ ...writeForm, title: e.target.value })}
                      className="flex-1 h-11 rounded-xl border-gray-200"
                    />
                  </div>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl p-4 min-h-[140px] text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-gray-400"
                    placeholder="다른 사장님들과 나누고 싶은 이야기를 자유롭게 적어주세요..."
                    value={writeForm.content}
                    onChange={(e) => setWriteForm({ ...writeForm, content: e.target.value })}
                  />
                  <div className="flex items-center justify-between">
                    <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-50">
                      <ImageIcon className="w-4 h-4" />
                      <span style={{ fontSize: "0.82rem" }}>사진 첨부</span>
                    </button>
                    <div className="flex gap-2">
                      <Button variant="outline" className="rounded-xl h-10 border-gray-200" onClick={() => setShowWrite(false)}>취소</Button>
                      <Button className="bg-primary text-white rounded-xl h-10 px-6" onClick={() => setShowWrite(false)}>등록하기</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search & Write */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="게시글 제목, 내용으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/40 focus:ring-primary/20"
              />
            </div>
            <Button
              className="bg-primary text-white rounded-xl h-11 px-5 shadow-sm hover:shadow-md transition-all shrink-0"
              onClick={() => setShowWrite(!showWrite)}
            >
              <PenSquare className="w-4 h-4 mr-1.5" /> 글쓰기
            </Button>
          </div>

          {/* Sort Pills */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {[
              { key: "all", label: "전체" },
              { key: "hot", label: "🔥 인기순" },
              { key: "latest", label: "최신순" },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key as typeof sortBy)}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  sortBy === s.key
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
                style={{ fontSize: "0.82rem", fontWeight: 500 }}
              >
                {s.label}
              </button>
            ))}
            <div className="w-px h-5 bg-white/10 mx-1" />
            {boardCategories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1.5 rounded-full transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setSelectedCategory(cat)}
                style={{ fontSize: "0.82rem", fontWeight: 500 }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="mb-3">
            <p className="text-gray-500" style={{ fontSize: "0.82rem" }}>
              총 <span className="text-white" style={{ fontWeight: 600 }}>{filtered.length}개</span> 게시글
            </p>
          </div>

          {/* Table */}
          <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
            {/* Table Header */}
            <div
              className="hidden md:grid border-b border-white/10 bg-white/5 px-4"
              style={{ gridTemplateColumns: "32px 90px 1fr 100px 90px 90px" }}
            >
              <div className="py-3" />
              <div className="py-3 text-gray-400 text-center" style={{ fontSize: "0.78rem", fontWeight: 600 }}>카테고리</div>
              <div className="py-3 text-gray-400 pl-3" style={{ fontSize: "0.78rem", fontWeight: 600 }}>제목 / 작성자</div>
              <div className="py-3 text-gray-400 text-center" style={{ fontSize: "0.78rem", fontWeight: 600 }}>조회 / 댓글</div>
              <div className="py-3 text-gray-400 text-center" style={{ fontSize: "0.78rem", fontWeight: 600 }}>작성일</div>
              <div className="py-3 text-gray-400 text-center" style={{ fontSize: "0.78rem", fontWeight: 600 }}>공감</div>
            </div>

            {/* Table Rows */}
            {filtered.map((post) => (
              <div
                key={post.id}
                className={`border-b border-white/5 last:border-0 transition-colors group cursor-pointer
                  ${post.isPinned ? "bg-primary/5 hover:bg-emerald-500/10" : "hover:bg-emerald-500/10"}`}
              >
                {/* Desktop row */}
                <div
                  className="hidden md:grid px-4 items-center"
                  style={{ gridTemplateColumns: "32px 90px 1fr 100px 90px 90px" }}
                >
                  {/* Badge icons */}
                  <div className="py-4 flex flex-col gap-1 items-center">
                    {post.isPinned && <Pin className="w-3.5 h-3.5 text-primary" />}
                    {post.isHot && <Flame className="w-3.5 h-3.5 text-red-500" />}
                  </div>

                  {/* Category */}
                  <div className="py-4 text-center">
                    <span
                      className="inline-block px-2.5 py-1 rounded-lg bg-white/5 text-gray-400"
                      style={{ fontSize: "0.74rem", fontWeight: 500 }}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* Title + Author */}
                  <div className="py-4 pl-3 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      {post.isPinned && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0" style={{ fontSize: "0.64rem", fontWeight: 700 }}>공지</span>
                      )}
                      {post.isHot && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-red-900/30 text-red-400 shrink-0" style={{ fontSize: "0.64rem", fontWeight: 700 }}>HOT</span>
                      )}
                      <h4 className="truncate text-gray-200 group-hover:text-primary transition-colors" style={{ fontSize: "0.92rem", fontWeight: 600 }}>
                        {post.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span style={{ fontSize: "0.75rem" }}>{post.avatar}</span>
                      <span className="text-gray-500" style={{ fontSize: "0.75rem" }}>{post.author}</span>
                    </div>
                  </div>

                  {/* Views / Comments */}
                  <div className="py-4 text-center">
                    <div className="flex items-center justify-center gap-3 text-gray-500" style={{ fontSize: "0.78rem" }}>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {post.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> {post.comments}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="py-4 text-center">
                    <span className="text-gray-500" style={{ fontSize: "0.82rem" }}>{post.date}</span>
                  </div>

                  {/* Likes */}
                  <div className="py-4 flex justify-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                        likedPosts.has(post.id)
                          ? "bg-primary/10 text-primary"
                          : "bg-white/5 text-gray-400 hover:bg-primary/10 hover:text-primary"
                      }`}
                      style={{ fontSize: "0.78rem", fontWeight: 600 }}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                      {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                    </button>
                  </div>
                </div>

                {/* Mobile row */}
                <div className="md:hidden p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0" style={{ fontSize: "1.1rem" }}>
                      {post.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        {post.isPinned && (
                          <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary" style={{ fontSize: "0.64rem", fontWeight: 700 }}>공지</span>
                        )}
                        {post.isHot && (
                          <span className="px-1.5 py-0.5 rounded bg-red-900/30 text-red-400" style={{ fontSize: "0.64rem", fontWeight: 700 }}>HOT</span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-white/5 text-gray-400" style={{ fontSize: "0.7rem", fontWeight: 500 }}>{post.category}</span>
                      </div>
                      <p className="text-gray-200 group-hover:text-primary transition-colors truncate mb-1" style={{ fontSize: "0.9rem", fontWeight: 600 }}>{post.title}</p>
                      <div className="flex items-center gap-3 text-gray-500" style={{ fontSize: "0.75rem" }}>
                        <span>{post.author}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{post.comments}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                          className={`flex items-center gap-1 ${likedPosts.has(post.id) ? "text-primary" : ""}`}
                        >
                          <ThumbsUp className={`w-3 h-3 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                          {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                        </button>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
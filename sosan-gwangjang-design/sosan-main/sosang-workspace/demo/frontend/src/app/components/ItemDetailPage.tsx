import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ChevronLeft, Heart, Eye, Clock, MessageCircle, MapPin, Camera, Flag } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ItemDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const item = (location.state as { item: any } | null)?.item;

  const [liked, setLiked] = useState(false);

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "#141720", color: "white" }}>
        <p style={{ color: "rgba(255,255,255,0.4)" }}>매물 정보를 불러올 수 없습니다.</p>
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-4 py-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "none", cursor: "pointer" }}>
          <ChevronLeft size={16} /> 돌아가기
        </button>
      </div>
    );
  }

  const likeCount = item.likes + (liked ? 1 : 0);

  return (
    <div style={{ minHeight: "100vh", background: "#141720", color: "white", fontFamily: "'Noto Sans KR', sans-serif" }}>

      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-10"
        style={{ background: "rgba(20,23,32,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5"
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.55)", fontSize: "0.88rem" }}>
          <ChevronLeft size={18} /> 목록으로
        </button>
        <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>중고 거래소</span>
        <div style={{ width: "70px" }} />
      </div>

      {/* 본문 레이아웃: 데스크탑 2열 / 모바일 1열 */}
      <div className="mx-auto px-4 py-8" style={{ maxWidth: "960px" }}>
        <div className="flex flex-col md:flex-row gap-8 pb-32 md:pb-10">

          {/* ── 왼쪽: 이미지 ── */}
          <div className="md:w-[420px] shrink-0">
            <div className="rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ height: "380px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {item.image
                ? <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
                : <Camera size={60} style={{ color: "rgba(255,255,255,0.12)" }} />
              }
            </div>
            {/* 페이지 도트 */}
            <div className="flex justify-center gap-1.5 mt-3">
              {[0,1,2,3,4].map((i) => (
                <div key={i} style={{
                  width: i === 0 ? "20px" : "7px",
                  height: "7px",
                  borderRadius: "4px",
                  background: i === 0 ? "#10b981" : "rgba(255,255,255,0.15)",
                  transition: "all 0.2s",
                }} />
              ))}
            </div>
          </div>

          {/* ── 오른쪽: 상품 정보 ── */}
          <div className="flex-1 min-w-0">

            {/* 카테고리 */}
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", marginBottom: "6px" }}>
              {item.category}
            </p>

            {/* 제목 */}
            <h1 style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "10px" }}>
              {item.title}
            </h1>

            {/* 가격 */}
            <p style={{ fontSize: "2rem", fontWeight: 900, color: "white", letterSpacing: "-0.04em", marginBottom: "18px" }}>
              {item.price.toLocaleString()}<span style={{ fontSize: "1.1rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginLeft: "4px" }}>원</span>
            </p>

            {/* 통계 행 */}
            <div className="flex items-center gap-4 pb-4 mb-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>
              <span className="flex items-center gap-1">
                <Heart size={13} style={{ color: liked ? "#ef4444" : undefined }} /> {likeCount}
              </span>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
              <span className="flex items-center gap-1"><Eye size={13} /> {item.views}</span>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
              <span className="flex items-center gap-1"><Clock size={13} /> {item.posted}</span>
              <button
                className="ml-auto flex items-center gap-1"
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.25)", fontSize: "0.78rem" }}>
                <Flag size={12} /> 신고하기
              </button>
            </div>

            {/* 상품 상세 테이블 */}
            <div className="flex flex-col gap-3 mb-6">
              {[
                { label: "상품상태", value: item.condition },
                { label: "카테고리", value: item.category },
                { label: "거래지역", value: item.location },
                { label: "판매자", value: item.seller },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-4" style={{ fontSize: "0.88rem" }}>
                  <span style={{ width: "72px", color: "rgba(255,255,255,0.38)", flexShrink: 0, fontSize: "0.82rem" }}>
                    · {row.label}
                  </span>
                  <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* 구분선 */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", marginBottom: "18px" }} />

            {/* 상품 설명 */}
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
              {item.desc}
            </p>

            {/* 데스크탑 전용 하단 버튼 */}
            <div className="hidden md:flex items-center gap-3 mt-8">
              <button
                onClick={() => setLiked((v) => !v)}
                className="flex items-center gap-2 px-5 h-12 rounded-xl font-semibold"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: liked ? "#ef4444" : "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                  whiteSpace: "nowrap",
                }}
              >
                <Heart size={16} className={liked ? "fill-current" : ""} />
                찜 {likeCount}
              </button>

              <button
                onClick={() => navigate("/chat", { state: { sellerName: item.seller, itemTitle: item.title } })}
                className="flex-1 h-12 rounded-xl font-bold flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #10b981, #34d399)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.97rem",
                  boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
                }}
              >
                <MessageCircle size={18} /> 채팅하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 전용 하단 고정 버튼 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 px-4 py-4"
        style={{ background: "rgba(20,23,32,0.97)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLiked((v) => !v)}
            className="flex items-center gap-1.5 px-4 h-12 rounded-xl font-semibold shrink-0"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: liked ? "#ef4444" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            <Heart size={16} className={liked ? "fill-current" : ""} />
            찜 {likeCount}
          </button>
          <button
            onClick={() => navigate("/chat", { state: { sellerName: item.seller, itemTitle: item.title } })}
            className="flex-1 h-12 rounded-xl font-bold flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #10b981, #34d399)",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "0.97rem",
              boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
            }}
          >
            <MessageCircle size={18} /> 채팅하기
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Search,
  Send,
  MoreHorizontal,
  ChevronLeft,
  MessageCircle,
  Image as ImageIcon,
  Smile,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface ChatItem {
  id: number;
  name: string;
  itemTitle: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  avatarColor: string;
}

interface Message {
  id: number;
  from: "me" | "other";
  text: string;
  time: string;
}

const avatarColors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const defaultConversations: ChatItem[] = [
  {
    id: 2, name: "강남식당", itemTitle: "업무용 45박스 냉장고 (유니크)",
    lastMessage: "냉장고 아직 있나요?", time: "어제", unread: 0, avatar: "강", avatarColor: "#3b82f6",
  },
  {
    id: 3, name: "성남카페", itemTitle: "카페 2인 테이블 + 의자 세트 (4조)",
    lastMessage: "테이블 상태 사진 보내주실 수 있나요?", time: "어제", unread: 1, avatar: "성", avatarColor: "#f59e0b",
  },
  {
    id: 4, name: "수원치킨", itemTitle: "키오스크형 포스기 + 영수증 프린터",
    lastMessage: "확인했습니다 감사해요 😊", time: "2일 전", unread: 0, avatar: "수", avatarColor: "#ef4444",
  },
  {
    id: 5, name: "홍대카페사장", itemTitle: "빈티지 카페 펜던트 조명 6개 세트",
    lastMessage: "직거래 어디서 하면 될까요?", time: "3일 전", unread: 0, avatar: "홍", avatarColor: "#8b5cf6",
  },
];

const defaultMessages: Record<number, Message[]> = {
  2: [
    { id: 1, from: "other", text: "안녕하세요! 냉장고 아직 판매 중인가요?", time: "어제 오후 2:10" },
    { id: 2, from: "me", text: "네 아직 있어요!", time: "어제 오후 2:12" },
    { id: 3, from: "other", text: "냉장고 아직 있나요?", time: "어제 오후 3:05" },
  ],
  3: [
    { id: 1, from: "other", text: "테이블 세트 관심 있어서 연락드려요", time: "어제 오전 11:00" },
    { id: 2, from: "me", text: "네 반갑습니다! 어떤 점이 궁금하세요?", time: "어제 오전 11:05" },
    { id: 3, from: "other", text: "테이블 상태 사진 보내주실 수 있나요?", time: "어제 오전 11:10" },
  ],
  4: [
    { id: 1, from: "other", text: "포스기 관심 있습니다. 거래 가능한가요?", time: "2일 전 오후 1:00" },
    { id: 2, from: "me", text: "네 가능합니다! 언제 오실 수 있으세요?", time: "2일 전 오후 1:30" },
    { id: 3, from: "other", text: "확인했습니다 감사해요 😊", time: "2일 전 오후 2:00" },
  ],
  5: [
    { id: 1, from: "other", text: "조명 아직 있나요? 카페 분위기 마음에 들어서요", time: "3일 전 오후 4:00" },
    { id: 2, from: "me", text: "네 있습니다! 직거래 원하세요?", time: "3일 전 오후 4:10" },
    { id: 3, from: "other", text: "직거래 어디서 하면 될까요?", time: "3일 전 오후 4:15" },
  ],
};

const filterTabs = ["전체", "안읽음"];

export function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Item info passed from Marketplace
  const incomingItem = (location.state as { sellerName?: string; itemTitle?: string } | null);
  const sellerName = incomingItem?.sellerName ?? "마포사장님";
  const itemTitle = incomingItem?.itemTitle ?? "업소용 4구 가스레인지";

  // Build conversation list: incoming item first, then defaults
  const incomingConv: ChatItem = {
    id: 1,
    name: sellerName,
    itemTitle,
    lastMessage: "안녕하세요! 궁금한 점 물어보세요 😊",
    time: "방금",
    unread: 1,
    avatar: sellerName.charAt(0),
    avatarColor: avatarColors[0],
  };
  const conversations: ChatItem[] = [incomingConv, ...defaultConversations];

  const [selectedId, setSelectedId] = useState<number>(1);
  const [activeFilter, setActiveFilter] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Record<number, Message[]>>({
    1: [
      { id: 1, from: "other", text: "안녕하세요! 궁금한 점 물어보세요 😊", time: "방금" },
    ],
    ...defaultMessages,
  });

  const selectedConv = conversations.find((c) => c.id === selectedId)!;
  const currentMessages = messages[selectedId] ?? [];

  const filteredConvs = conversations.filter((c) => {
    const matchSearch = !searchQuery || c.name.includes(searchQuery) || c.itemTitle.includes(searchQuery);
    const matchFilter = activeFilter === "안읽음" ? c.unread > 0 : true;
    return matchSearch && matchFilter;
  });

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const sendMessage = () => {
    const text = messageText.trim();
    if (!text) return;
    const now = new Date();
    const timeStr = `오전 ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const newMsg: Message = { id: Date.now(), from: "me", text, time: timeStr };
    setMessages((prev) => ({ ...prev, [selectedId]: [...(prev[selectedId] ?? []), newMsg] }));
    setMessageText("");
    setTimeout(scrollToBottom, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="flex"
      style={{
        height: "calc(100vh - 60px)",
        backgroundColor: "#141720",
      }}
    >
      {/* ── Left Panel: Conversation List ── */}
      <div
        className="flex flex-col shrink-0"
        style={{
          width: "300px",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          backgroundColor: "rgba(255,255,255,0.02)",
        }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-white transition-colors"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-white" style={{ fontSize: "1rem", fontWeight: 700 }}>
                전체 대화
              </span>
            </div>
            <button className="text-gray-500 hover:text-white transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}>
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              placeholder="대화 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white placeholder:text-gray-600 outline-none focus:border-primary/40 transition-colors"
              style={{ fontSize: "0.8rem" }}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 px-4 pb-3 overflow-x-auto scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className="shrink-0 rounded-full px-3 py-1 transition-all"
              style={{
                fontSize: "0.75rem",
                fontWeight: activeFilter === tab ? 600 : 400,
                background: activeFilter === tab ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)",
                color: activeFilter === tab ? "#10b981" : "rgba(255,255,255,0.45)",
                border: activeFilter === tab ? "1px solid rgba(16,185,129,0.35)" : "1px solid transparent",
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConvs.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className="w-full text-left px-4 py-3.5 transition-colors relative"
              style={{
                background: selectedId === conv.id ? "rgba(16,185,129,0.08)" : "transparent",
                borderLeft: selectedId === conv.id ? "2px solid #10b981" : "2px solid transparent",
                borderRight: "none",
                borderTop: "none",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                cursor: "pointer",
              }}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white"
                  style={{ background: conv.avatarColor, fontSize: "0.9rem", fontWeight: 700 }}
                >
                  {conv.avatar}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-white truncate" style={{ fontSize: "0.855rem", fontWeight: 600 }}>
                      {conv.name}
                    </span>
                    <span className="text-gray-600 shrink-0 ml-2" style={{ fontSize: "0.7rem" }}>
                      {conv.time}
                    </span>
                  </div>
                  <p className="text-gray-600 truncate" style={{ fontSize: "0.72rem", marginBottom: "1px" }}>
                    {conv.itemTitle}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 truncate" style={{ fontSize: "0.78rem" }}>
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <span
                        className="shrink-0 ml-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white"
                        style={{ fontSize: "0.65rem", fontWeight: 700 }}
                      >
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right Panel: Chat Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.01)" }}
        >
          <div>
            <p className="text-white" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
              {selectedConv.name}
            </p>
            <p className="text-gray-500" style={{ fontSize: "0.78rem" }}>
              {selectedConv.itemTitle}
            </p>
          </div>
          <button className="text-gray-500 hover:text-white transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}>
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"} items-end gap-2`}
            >
              {/* Other's avatar */}
              {msg.from === "other" && (
                <div
                  className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white"
                  style={{ background: selectedConv.avatarColor, fontSize: "0.75rem", fontWeight: 700 }}
                >
                  {selectedConv.avatar}
                </div>
              )}

              <div className={`flex flex-col ${msg.from === "me" ? "items-end" : "items-start"} max-w-[65%]`}>
                {/* Bubble */}
                <div
                  className="px-4 py-2.5 rounded-2xl"
                  style={{
                    background: msg.from === "me"
                      ? "rgba(16,185,129,0.85)"
                      : "rgba(255,255,255,0.08)",
                    color: msg.from === "me" ? "#fff" : "rgba(255,255,255,0.9)",
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                    borderRadius: msg.from === "me"
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                  }}
                >
                  {msg.text}
                </div>
                {/* Time */}
                <span className="mt-1 text-gray-600" style={{ fontSize: "0.7rem" }}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div
          className="px-5 py-4 shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(255,255,255,0.01)" }}
        >
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-2"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <button className="text-gray-500 hover:text-gray-300 transition-colors shrink-0" style={{ background: "none", border: "none", cursor: "pointer" }}>
              <Smile className="w-5 h-5" />
            </button>
            <input
              placeholder="메시지를 입력하세요..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white placeholder:text-gray-600 outline-none"
              style={{ fontSize: "0.875rem" }}
            />
            <button className="text-gray-500 hover:text-gray-300 transition-colors shrink-0" style={{ background: "none", border: "none", cursor: "pointer" }}>
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              onClick={sendMessage}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all"
              style={{
                background: messageText.trim() ? "#10b981" : "rgba(255,255,255,0.08)",
                border: "none",
                cursor: messageText.trim() ? "pointer" : "default",
              }}
            >
              <Send className="w-4 h-4" style={{ color: messageText.trim() ? "#fff" : "rgba(255,255,255,0.3)" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

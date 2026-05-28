import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  RefreshCw,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Bell,
  Flame,
  Snowflake,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PriceDirection = "up" | "down" | "stable";

interface Ingredient {
  id: number;
  name: string;
  emoji: string;
  category: string;
  price: number;
  unit: string;
  change: number;
  changePercent: number;
  direction: PriceDirection;
  weekAgo: number;
  monthAgo: number;
  yearAvg: number;
  isVolatile: boolean;
  updatedAt: string;
  weeklyData: { day: string; price: number }[];
}

const categories = ["전체", "수산물", "축산물", "채소", "과일", "곡물/유제품"];

const ingredientsData: Ingredient[] = [
  {
    id: 1, name: "광어(양식)", emoji: "🐟", category: "수산물",
    price: 18500, unit: "kg", change: 1200, changePercent: 6.9, direction: "up",
    weekAgo: 17300, monthAgo: 16800, yearAvg: 17200, isVolatile: true, updatedAt: "오늘 06:00",
    weeklyData: [
      { day: "월", price: 17300 }, { day: "화", price: 17800 }, { day: "수", price: 17500 },
      { day: "목", price: 18200 }, { day: "금", price: 18500 }, { day: "토", price: 18500 }, { day: "일", price: 18500 },
    ],
  },
  {
    id: 2, name: "참돔(자연산)", emoji: "🎣", category: "수산물",
    price: 32000, unit: "kg", change: -2000, changePercent: -5.9, direction: "down",
    weekAgo: 34000, monthAgo: 35500, yearAvg: 33000, isVolatile: true, updatedAt: "오늘 06:00",
    weeklyData: [
      { day: "월", price: 34000 }, { day: "화", price: 33500 }, { day: "수", price: 33000 },
      { day: "목", price: 32800 }, { day: "금", price: 32000 }, { day: "토", price: 32000 }, { day: "일", price: 32000 },
    ],
  },
  {
    id: 3, name: "고등어", emoji: "🐠", category: "수산물",
    price: 4800, unit: "마리", change: 300, changePercent: 6.7, direction: "up",
    weekAgo: 4500, monthAgo: 4200, yearAvg: 4100, isVolatile: false, updatedAt: "오늘 06:00",
    weeklyData: [
      { day: "월", price: 4500 }, { day: "화", price: 4500 }, { day: "수", price: 4600 },
      { day: "목", price: 4700 }, { day: "금", price: 4800 }, { day: "토", price: 4800 }, { day: "일", price: 4800 },
    ],
  },
  {
    id: 4, name: "새우(흰다리)", emoji: "🦐", category: "수산물",
    price: 12800, unit: "kg", change: 800, changePercent: 6.7, direction: "up",
    weekAgo: 12000, monthAgo: 11500, yearAvg: 11800, isVolatile: true, updatedAt: "오늘 06:00",
    weeklyData: [
      { day: "월", price: 12000 }, { day: "화", price: 12200 }, { day: "수", price: 12400 },
      { day: "목", price: 12500 }, { day: "금", price: 12800 }, { day: "토", price: 12800 }, { day: "일", price: 12800 },
    ],
  },
  {
    id: 5, name: "한우(1++등심)", emoji: "🥩", category: "축산물",
    price: 98000, unit: "kg", change: -3000, changePercent: -3.0, direction: "down",
    weekAgo: 101000, monthAgo: 105000, yearAvg: 102000, isVolatile: false, updatedAt: "오늘 07:00",
    weeklyData: [
      { day: "월", price: 101000 }, { day: "화", price: 100000 }, { day: "수", price: 99500 },
      { day: "목", price: 99000 }, { day: "금", price: 98000 }, { day: "토", price: 98000 }, { day: "일", price: 98000 },
    ],
  },
  {
    id: 6, name: "삼겹살(국산)", emoji: "🐷", category: "축산물",
    price: 22500, unit: "kg", change: 500, changePercent: 2.3, direction: "up",
    weekAgo: 22000, monthAgo: 21500, yearAvg: 21800, isVolatile: false, updatedAt: "오늘 07:00",
    weeklyData: [
      { day: "월", price: 22000 }, { day: "화", price: 22000 }, { day: "수", price: 22200 },
      { day: "목", price: 22300 }, { day: "금", price: 22500 }, { day: "토", price: 22500 }, { day: "일", price: 22500 },
    ],
  },
  {
    id: 7, name: "닭(육계)", emoji: "🍗", category: "축산물",
    price: 6800, unit: "마리", change: 0, changePercent: 0, direction: "stable",
    weekAgo: 6800, monthAgo: 6500, yearAvg: 6600, isVolatile: false, updatedAt: "오늘 07:00",
    weeklyData: [
      { day: "월", price: 6800 }, { day: "화", price: 6800 }, { day: "수", price: 6800 },
      { day: "목", price: 6800 }, { day: "금", price: 6800 }, { day: "토", price: 6800 }, { day: "일", price: 6800 },
    ],
  },
  {
    id: 8, name: "계란(30구)", emoji: "🥚", category: "곡물/유제품",
    price: 7200, unit: "판", change: 400, changePercent: 5.9, direction: "up",
    weekAgo: 6800, monthAgo: 6500, yearAvg: 6200, isVolatile: true, updatedAt: "오늘 08:00",
    weeklyData: [
      { day: "월", price: 6800 }, { day: "화", price: 6900 }, { day: "수", price: 7000 },
      { day: "목", price: 7100 }, { day: "금", price: 7200 }, { day: "토", price: 7200 }, { day: "일", price: 7200 },
    ],
  },
  {
    id: 9, name: "대파", emoji: "🧅", category: "채소",
    price: 3200, unit: "kg", change: -800, changePercent: -20.0, direction: "down",
    weekAgo: 4000, monthAgo: 5500, yearAvg: 3800, isVolatile: true, updatedAt: "오늘 05:00",
    weeklyData: [
      { day: "월", price: 4000 }, { day: "화", price: 3800 }, { day: "수", price: 3600 },
      { day: "목", price: 3400 }, { day: "금", price: 3200 }, { day: "토", price: 3200 }, { day: "일", price: 3200 },
    ],
  },
  {
    id: 10, name: "양파", emoji: "🧅", category: "채소",
    price: 1800, unit: "kg", change: -200, changePercent: -10.0, direction: "down",
    weekAgo: 2000, monthAgo: 2500, yearAvg: 2200, isVolatile: false, updatedAt: "오늘 05:00",
    weeklyData: [
      { day: "월", price: 2000 }, { day: "화", price: 1950 }, { day: "수", price: 1900 },
      { day: "목", price: 1850 }, { day: "금", price: 1800 }, { day: "토", price: 1800 }, { day: "일", price: 1800 },
    ],
  },
  {
    id: 11, name: "배추", emoji: "🥬", category: "채소",
    price: 4500, unit: "포기", change: 1500, changePercent: 50.0, direction: "up",
    weekAgo: 3000, monthAgo: 2800, yearAvg: 3200, isVolatile: true, updatedAt: "오늘 05:00",
    weeklyData: [
      { day: "월", price: 3000 }, { day: "화", price: 3200 }, { day: "수", price: 3500 },
      { day: "목", price: 4000 }, { day: "금", price: 4500 }, { day: "토", price: 4500 }, { day: "일", price: 4500 },
    ],
  },
  {
    id: 12, name: "쌀(20kg)", emoji: "🍚", category: "곡물/유제품",
    price: 52000, unit: "포", change: 0, changePercent: 0, direction: "stable",
    weekAgo: 52000, monthAgo: 51500, yearAvg: 50800, isVolatile: false, updatedAt: "오늘 08:00",
    weeklyData: [
      { day: "월", price: 52000 }, { day: "화", price: 52000 }, { day: "수", price: 52000 },
      { day: "목", price: 52000 }, { day: "금", price: 52000 }, { day: "토", price: 52000 }, { day: "일", price: 52000 },
    ],
  },
];

const priceAlerts = [
  { item: "배추", message: "한파 영향으로 가격 급등 (전주 대비 +50%)", type: "warning" as const },
  { item: "대파", message: "출하량 증가로 가격 하락세 (전주 대비 -20%)", type: "good" as const },
  { item: "새우", message: "수입량 감소로 가격 상승 추세", type: "warning" as const },
];

export function MarketPrice() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [priceAlertItems, setPriceAlertItems] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    return ingredientsData.filter((item) => {
      const matchCat = selectedCategory === "전체" || item.category === selectedCategory;
      const matchSearch = !searchQuery || item.name.includes(searchQuery);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const directionIcon = (d: PriceDirection) => {
    if (d === "up") return <ArrowUpRight className="w-3.5 h-3.5" />;
    if (d === "down") return <ArrowDownRight className="w-3.5 h-3.5" />;
    return <Minus className="w-3.5 h-3.5" />;
  };

  const directionColor = (d: PriceDirection) => {
    if (d === "up") return "text-red-500";
    if (d === "down") return "text-blue-500";
    return "text-gray-400";
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
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <h1 className="text-white" style={{ fontSize: '1.55rem', fontWeight: 700, letterSpacing: '-0.02em' }}>식자재 시세</h1>
        </div>
        <p className="text-gray-400" style={{ fontSize: '0.9rem' }}>실시간 식자재 가격 · 시세 변동 추이</p>
      </div>

      <div className="space-y-6">
        {/* Update Time */}
        <div className="flex items-center justify-end gap-1 text-gray-400" style={{ fontSize: "0.72rem" }}>
          <RefreshCw className="w-3 h-3" /> 최종 업데이트: 오늘 08:00
        </div>

        {/* Price Alerts */}
        <div className="space-y-2">
          {priceAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-3 flex items-center gap-3 ring-1 ${
                alert.type === "warning"
                  ? "bg-red-900/20 ring-red-500/30"
                  : "bg-emerald-900/20 ring-emerald-500/30"
              }`}
            >
              {alert.type === "warning" ? (
                <Flame className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <Snowflake className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <p style={{ fontSize: "0.82rem" }}>
                <strong className={alert.type === "warning" ? "text-red-300" : "text-emerald-300"}>
                  {alert.item}
                </strong>{" "}
                <span className={alert.type === "warning" ? "text-red-400" : "text-emerald-400"}>
                  {alert.message}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2.5 border border-white/10 rounded-xl text-sm bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/40 placeholder:text-gray-500"
            placeholder="식자재 검색 (예: 광어, 삼겹살, 대파...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
              style={{ fontSize: "0.8rem", fontWeight: 500 }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price Table */}
        <div className="space-y-2">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className={`border-0 shadow-sm ring-1 cursor-pointer transition-all hover:shadow-md bg-white/5 ${
                selectedItem === item.id
                  ? "ring-teal-500/50 shadow-md"
                  : "ring-white/10"
              }`}
              onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Emoji */}
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0" style={{ fontSize: "1.3rem" }}>
                    {item.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-gray-200" style={{ fontSize: "0.92rem", fontWeight: 600 }}>{item.name}</span>
                      {item.isVolatile && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-900/30 text-amber-400" style={{ fontSize: "0.6rem", fontWeight: 600 }}>
                          <AlertTriangle className="w-2.5 h-2.5 inline" /> 변동
                        </span>
                      )}
                      <span className="text-gray-500" style={{ fontSize: "0.68rem" }}>{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500" style={{ fontSize: "0.72rem" }}>/{item.unit}</span>
                      <span className="text-gray-500" style={{ fontSize: "0.68rem" }}>
                        <Clock className="w-3 h-3 inline mr-0.5" />{item.updatedAt}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="text-white" style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                      {item.price.toLocaleString()}원
                    </p>
                    <div className={`flex items-center justify-end gap-0.5 ${directionColor(item.direction)}`} style={{ fontSize: "0.78rem", fontWeight: 600 }}>
                      {directionIcon(item.direction)}
                      {item.direction !== "stable" && (
                        <>
                          {Math.abs(item.change).toLocaleString()}원
                          <span style={{ fontSize: "0.7rem" }}>({item.changePercent > 0 ? "+" : ""}{item.changePercent}%)</span>
                        </>
                      )}
                      {item.direction === "stable" && <span>보합</span>}
                    </div>
                  </div>

                  {/* Alert Bell */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPriceAlertItems((prev) => {
                        const next = new Set(prev);
                        next.has(item.id) ? next.delete(item.id) : next.add(item.id);
                        return next;
                      });
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                      priceAlertItems.has(item.id)
                        ? "bg-teal-600/20 text-teal-400"
                        : "bg-white/5 text-gray-600 hover:text-gray-400"
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                </div>

                {/* Expanded Chart */}
                {selectedItem === item.id && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                    {/* Weekly Chart */}
                    <div>
                      <h5 className="mb-2 text-gray-300" style={{ fontSize: "0.85rem", fontWeight: 600 }}>이번 주 시세 추이</h5>
                      <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={item.weeklyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                          <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                          <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" domain={["auto", "auto"]} />
                          <Tooltip
                            contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                            formatter={(value: number) => [`${value.toLocaleString()}원`, item.name]}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke={item.direction === "up" ? "#ef4444" : item.direction === "down" ? "#3b82f6" : "#9ca3af"}
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: item.direction === "up" ? "#ef4444" : item.direction === "down" ? "#3b82f6" : "#9ca3af" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Comparison */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 rounded-xl bg-gray-50">
                        <p className="text-gray-400 mb-1" style={{ fontSize: "0.68rem" }}>1주 전</p>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700 }}>{item.weekAgo.toLocaleString()}원</p>
                        <p className={`${item.price > item.weekAgo ? "text-red-500" : item.price < item.weekAgo ? "text-blue-500" : "text-gray-400"}`} style={{ fontSize: "0.72rem" }}>
                          {item.price > item.weekAgo ? "+" : ""}{((item.price - item.weekAgo) / item.weekAgo * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gray-50">
                        <p className="text-gray-400 mb-1" style={{ fontSize: "0.68rem" }}>1개월 전</p>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700 }}>{item.monthAgo.toLocaleString()}원</p>
                        <p className={`${item.price > item.monthAgo ? "text-red-500" : item.price < item.monthAgo ? "text-blue-500" : "text-gray-400"}`} style={{ fontSize: "0.72rem" }}>
                          {item.price > item.monthAgo ? "+" : ""}{((item.price - item.monthAgo) / item.monthAgo * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gray-50">
                        <p className="text-gray-400 mb-1" style={{ fontSize: "0.68rem" }}>연평균</p>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700 }}>{item.yearAvg.toLocaleString()}원</p>
                        <p className={`${item.price > item.yearAvg ? "text-red-500" : item.price < item.yearAvg ? "text-blue-500" : "text-gray-400"}`} style={{ fontSize: "0.72rem" }}>
                          {item.price > item.yearAvg ? "+" : ""}{((item.price - item.yearAvg) / item.yearAvg * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {/* Tip */}
                    <div className="bg-teal-50 rounded-xl p-3 flex items-start gap-2 ring-1 ring-teal-100">
                      <Info className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                      <p className="text-teal-700" style={{ fontSize: "0.78rem", lineHeight: 1.5 }}>
                        {item.direction === "up"
                          ? `${item.name} 가격이 상승 추세입니다. 대량 구매 시점을 조절하거나 대체 식재료를 검토해보세요.`
                          : item.direction === "down"
                          ? `${item.name} 가격이 하락 추세입니다. 지금이 대량 구매 적기일 수 있습니다.`
                          : `${item.name} 가격이 안정적입니다. 현재 가격 수준에서 정기 구매를 고려해보세요.`
                        }
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Source Info */}
        <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-2">
          <Info className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <p className="text-gray-500" style={{ fontSize: "0.75rem", lineHeight: 1.5 }}>
            가격 정보는 가락시장 경매가, 축산물품질평가원, 수산물 산지 경매 데이터를 기반으로 합니다.
            실제 매입가는 유통 경로와 물량에 따라 차이가 있을 수 있습니다. 매일 오전 업데이트됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
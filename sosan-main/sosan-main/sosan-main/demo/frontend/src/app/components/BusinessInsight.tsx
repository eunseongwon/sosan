import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MapPin,
  Search,
  Lightbulb,
  BarChart3,
  ShieldAlert,
  ChevronRight,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Target,
  Zap,
  Store,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";

// 전주 지역 기준 Mock 데이터
const jeonjuDistricts = [
  "한옥마을", "객리단길", "남부시장", "풍남문", "덕진동", "효자동", "송천동", "서신동", "인후동", "금암동"
];

// 네이버 검색 트렌드 (Mock)
const trendingKeywords = [
  { keyword: "비건 디저트", change: 187, volume: 32400, area: "객리단길", hasStore: false, category: "외식업" },
  { keyword: "수제 맥주", change: 124, volume: 28700, area: "한옥마을", hasStore: true, category: "외식업" },
  { keyword: "로봇 카페", change: 156, volume: 19200, area: "덕진동", hasStore: false, category: "서비스업" },
  { keyword: "제로 웨이스트샵", change: 98, volume: 15600, area: "효자동", hasStore: false, category: "소매업" },
  { keyword: "반려동물 카페", change: 89, volume: 24300, area: "송천동", hasStore: true, category: "서비스업" },
  { keyword: "무인 아이스크림", change: 134, volume: 21800, area: "서신동", hasStore: false, category: "소매업" },
  { keyword: "프리미엄 김밥", change: 112, volume: 18500, area: "남부시장", hasStore: true, category: "외식업" },
  { keyword: "건강 도시락", change: 76, volume: 16900, area: "인후동", hasStore: false, category: "외식업" },
];

// 월별 검색 트렌드 추이
const monthlyTrends: Record<string, { month: string; volume: number }[]> = {
  "비건 디저트": [
    { month: "9월", volume: 8200 }, { month: "10월", volume: 11400 }, { month: "11월", volume: 14800 },
    { month: "12월", volume: 18200 }, { month: "1월", volume: 22600 }, { month: "2월", volume: 32400 },
  ],
  "로봇 카페": [
    { month: "9월", volume: 5100 }, { month: "10월", volume: 7200 }, { month: "11월", volume: 9800 },
    { month: "12월", volume: 12400 }, { month: "1월", volume: 15600 }, { month: "2월", volume: 19200 },
  ],
  "무인 아이스크림": [
    { month: "9월", volume: 7800 }, { month: "10월", volume: 9400 }, { month: "11월", volume: 12100 },
    { month: "12월", volume: 15200 }, { month: "1월", volume: 18400 }, { month: "2월", volume: 21800 },
  ],
  "제로 웨이스트샵": [
    { month: "9월", volume: 5600 }, { month: "10월", volume: 7100 }, { month: "11월", volume: 8900 },
    { month: "12월", volume: 11200 }, { month: "1월", volume: 13400 }, { month: "2월", volume: 15600 },
  ],
  "건강 도시락": [
    { month: "9월", volume: 6200 }, { month: "10월", volume: 7800 }, { month: "11월", volume: 9500 },
    { month: "12월", volume: 11800 }, { month: "1월", volume: 14200 }, { month: "2월", volume: 16900 },
  ],
};

// 업종별 폐업률 데이터
const closureRates = [
  { category: "커피/음료", rate1yr: 18.2, rate3yr: 42.5, stores: 1247, risk: "중간" },
  { category: "치킨/피자", rate1yr: 22.7, rate3yr: 51.3, stores: 892, risk: "높음" },
  { category: "한식", rate1yr: 15.8, rate3yr: 38.1, stores: 2156, risk: "중간" },
  { category: "디저트/베이커리", rate1yr: 24.3, rate3yr: 55.8, stores: 634, risk: "높음" },
  { category: "무인매장", rate1yr: 28.1, rate3yr: 61.2, stores: 312, risk: "매우높음" },
  { category: "반려동물 관련", rate1yr: 12.4, rate3yr: 29.7, stores: 189, risk: "낮음" },
  { category: "건강식/샐러드", rate1yr: 19.6, rate3yr: 45.2, stores: 278, risk: "중간" },
  { category: "주류/바", rate1yr: 26.5, rate3yr: 58.4, stores: 423, risk: "높음" },
];

// 추천 아이템 상세 분석
const recommendations = [
  {
    id: 1,
    item: "비건 디저트 전문점",
    area: "객리단길",
    score: 92,
    searchTrend: "급상승",
    competitorCount: 0,
    closureRate: 24.3,
    avgRevenue: "월 1,800만원",
    initialCost: "3,000~5,000만원",
    targetCustomer: "20~30대 여성, 건강 관심층",
    summary: "객리단길 일대에서 '비건 디저트' 검색량이 6개월간 187% 증가했으나, 현재 전문점이 전무합니다. 다만 디저트업종 전체 3년 폐업률이 55.8%로 높아 차별화 전략이 필수적입니다.",
    pros: ["검색량 급증 (6개월 187%↑)", "동네 내 경쟁 매장 0개", "MZ세대 트렌드 부합", "객리단길 유동인구 증가세"],
    cons: ["디저트 업종 폐업률 높음 (55.8%/3년)", "원재료 단가 일반 디저트 대비 30%↑", "타깃 고객층 제한적", "계절별 수요 편차 존재"],
    radarData: [
      { subject: "검색트렌드", A: 95 }, { subject: "경쟁강도", A: 90 }, { subject: "수익성", A: 70 },
      { subject: "지속가능성", A: 65 }, { subject: "진입장벽", A: 75 }, { subject: "성장성", A: 88 },
    ],
  },
  {
    id: 2,
    item: "로봇 서빙 카페",
    area: "덕진동",
    score: 78,
    searchTrend: "상승",
    competitorCount: 0,
    closureRate: 18.2,
    avgRevenue: "월 2,200만원",
    initialCost: "8,000만원~1.2억",
    targetCustomer: "가족 단위, 대학생",
    summary: "덕진동(전북대 인근)에서 로봇 카페 관심도가 156% 급증 중이나 초기 투자비용이 높습니다. 전북대 학생 및 가족 단위 고객을 타깃으로 SNS 바이럴 효과가 기대됩니다.",
    pros: ["화제성/SNS 바이럴 효과 높음", "인건비 절감 가능", "전북대 인근 대학생 수요", "경쟁 매장 부재"],
    cons: ["초기 투자비용 높음 (8천만~1.2억)", "로봇 유지보수 비용", "신규성 소멸 후 재방문율 불확실", "기술 장애 시 운영 리스크"],
    radarData: [
      { subject: "검색트렌드", A: 85 }, { subject: "경쟁강도", A: 92 }, { subject: "수익성", A: 72 },
      { subject: "지속가능성", A: 55 }, { subject: "진입장벽", A: 45 }, { subject: "성장성", A: 80 },
    ],
  },
  {
    id: 3,
    item: "건강 도시락 전문점",
    area: "인후동",
    score: 85,
    searchTrend: "꾸준 상승",
    competitorCount: 1,
    closureRate: 19.6,
    avgRevenue: "월 1,500만원",
    initialCost: "2,000~3,500만원",
    targetCustomer: "직장인, 건강 관심층, 다이어터",
    summary: "인후동 직장인 밀집 지역에서 건강 도시락 검색이 꾸준히 증가하고 있으며, 기존 매장 1개뿐입니다. 초기 비용이 상대적으로 낮고, 배달 전용으로도 운영 가능합니다.",
    pros: ["낮은 초기 투자비용", "배달/구독 모델 가능", "건강 트렌드 지속 성장", "직장인 점심 수요 안정적"],
    cons: ["건강식 업종 폐업률 19.6%/1년", "식재료 원가율 높음", "메뉴 다양성 한계", "기존 배달 도시락과 경쟁"],
    radarData: [
      { subject: "검색트렌드", A: 72 }, { subject: "경쟁강도", A: 82 }, { subject: "수익성", A: 68 },
      { subject: "지속가능성", A: 78 }, { subject: "진입장벽", A: 85 }, { subject: "성장성", A: 75 },
    ],
  },
];

const riskColorMap: Record<string, string> = {
  "낮음": "text-emerald-600 bg-emerald-50",
  "중간": "text-amber-600 bg-amber-50",
  "높음": "text-red-500 bg-red-50",
  "매우높음": "text-red-700 bg-red-100",
};

const closureBarColors = ["#10b981", "#f59e0b", "#10b981", "#ef4444", "#ef4444", "#10b981", "#f59e0b", "#ef4444"];

export function BusinessInsight() {
  const [selectedDistrict, setSelectedDistrict] = useState("전체");
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<"trends" | "closure" | "recommend">("trends");

  const filteredTrends = trendingKeywords.filter(
    (t) => selectedDistrict === "전체" || t.area === selectedDistrict
  );

  const selectedRec = recommendations.find((r) => r.id === selectedRecommendation);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-200">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            데이터 기반 창업 · 메뉴 추천
          </h2>
          <p className="text-gray-500" style={{ fontSize: "0.82rem" }}>
            네이버 검색 트렌드 × 공공 상권 분석 × 폐업률 데이터
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 flex items-start gap-3 ring-1 ring-orange-100">
        <Info className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
        <p className="text-orange-700" style={{ fontSize: "0.82rem", lineHeight: 1.6 }}>
          본 데이터는 네이버 검색 트렌드와 공공 상권정보를 기반으로 한 <strong>참고용 분석</strong>입니다.
          실제 창업 및 메뉴 변경 시에는 반드시 현장 조사와 전문가 상담을 병행하세요.
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: "trends" as const, icon: TrendingUp, label: "검색 트렌드" },
          { key: "closure" as const, icon: ShieldAlert, label: "폐업률 분석" },
          { key: "recommend" as const, icon: Lightbulb, label: "유망 아이템 추천" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeSection === tab.key
                ? "bg-orange-600 text-white shadow-md shadow-orange-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={{ fontSize: "0.84rem", fontWeight: 600 }}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════ Section 1: 검색 트렌드 ═══════ */}
      {activeSection === "trends" && (
        <div className="space-y-5">
          {/* District Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["전체", ...jeonjuDistricts].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDistrict(d)}
                className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                  selectedDistrict === d
                    ? "bg-orange-100 text-orange-700 ring-1 ring-orange-200"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
                style={{ fontSize: "0.78rem", fontWeight: 500 }}
              >
                <MapPin className="w-3 h-3 inline mr-0.5" />
                {d}
              </button>
            ))}
          </div>

          {/* Trending Keywords Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTrends.map((item, idx) => (
              <Card
                key={item.keyword}
                className={`border-0 shadow-sm ring-1 cursor-pointer transition-all hover:shadow-md ${
                  selectedKeyword === item.keyword
                    ? "ring-orange-300 bg-orange-50/50"
                    : "ring-black/[0.04] hover:ring-orange-200"
                }`}
                onClick={() => setSelectedKeyword(selectedKeyword === item.keyword ? null : item.keyword)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center"
                        style={{ fontSize: "0.72rem", fontWeight: 700 }}
                      >
                        {idx + 1}
                      </span>
                      <span style={{ fontSize: "0.92rem", fontWeight: 600 }}>{item.keyword}</span>
                    </div>
                    {!item.hasStore ? (
                      <Badge className="bg-emerald-50 text-emerald-600 border-0 rounded-lg" style={{ fontSize: "0.68rem" }}>
                        <Zap className="w-3 h-3 mr-0.5" /> 공백시장
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-500 border-0 rounded-lg" style={{ fontSize: "0.68rem" }}>
                        경쟁 있음
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4" style={{ fontSize: "0.78rem" }}>
                    <span className="text-gray-500">
                      <MapPin className="w-3 h-3 inline mr-0.5" />
                      {item.area}
                    </span>
                    <span className={`flex items-center gap-0.5 ${item.change > 100 ? "text-red-500" : "text-emerald-600"}`}>
                      <ArrowUpRight className="w-3 h-3" />
                      {item.change}%
                    </span>
                    <span className="text-gray-400">
                      <Search className="w-3 h-3 inline mr-0.5" />
                      {item.volume.toLocaleString()}/월
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Keyword Trend Chart */}
          {selectedKeyword && monthlyTrends[selectedKeyword] && (
            <Card className="border-0 shadow-md ring-1 ring-orange-100">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                      "{selectedKeyword}" 검색량 추이
                    </h4>
                    <p className="text-gray-400" style={{ fontSize: "0.78rem" }}>
                      최근 6개월 네이버 검색 트렌드 (전주 지역)
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg" style={{ fontSize: "0.78rem", fontWeight: 600 }}>
                    <TrendingUp className="w-3.5 h-3.5" />
                    상승세
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={monthlyTrends[selectedKeyword]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                      formatter={(value: number) => [`${value.toLocaleString()}회`, "검색량"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="volume"
                      stroke="#ea580c"
                      strokeWidth={2.5}
                      dot={{ fill: "#ea580c", r: 4 }}
                      activeDot={{ r: 6, fill: "#ea580c" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {selectedKeyword && !monthlyTrends[selectedKeyword] && (
            <Card className="border-0 shadow-sm ring-1 ring-black/[0.04]">
              <CardContent className="p-8 text-center text-gray-400">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p style={{ fontSize: "0.85rem" }}>"{selectedKeyword}" 상세 트렌드 데이터를 준비 중입니다.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ═══════ Section 2: 폐업률 분석 ═══════ */}
      {activeSection === "closure" && (
        <div className="space-y-5">
          {/* Warning Banner */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 flex items-start gap-3 ring-1 ring-amber-100">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-amber-800" style={{ fontSize: "0.82rem", lineHeight: 1.6 }}>
              아래 데이터는 전북 전주시 기준 최근 공공 상권 통계입니다.
              창업 전 해당 업종의 <strong>폐업률과 생존율</strong>을 반드시 확인하시기 바랍니다.
            </p>
          </div>

          {/* Closure Rate Bar Chart */}
          <Card className="border-0 shadow-md ring-1 ring-black/[0.04]">
            <CardContent className="p-5">
              <h4 className="mb-1" style={{ fontSize: "0.95rem", fontWeight: 600 }}>업종별 폐업률 비교</h4>
              <p className="text-gray-400 mb-4" style={{ fontSize: "0.78rem" }}>전주시 기준 · 1년/3년 폐업률 (%)</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={closureRates} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" unit="%" />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} stroke="#9ca3af" width={100} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                    formatter={(value: number, name: string) => [`${value}%`, name === "rate1yr" ? "1년 폐업률" : "3년 폐업률"]}
                  />
                  <Legend formatter={(value) => (value === "rate1yr" ? "1년 폐업률" : "3년 폐업률")} />
                  <Bar dataKey="rate1yr" name="1년 폐업률" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={10} />
                  <Bar dataKey="rate3yr" name="3년 폐업률" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Closure Rate Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {closureRates.map((item) => (
              <Card key={item.category} className="border-0 shadow-sm ring-1 ring-black/[0.04]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-gray-400" />
                      <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{item.category}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md ${riskColorMap[item.risk] || ""}`}
                      style={{ fontSize: "0.7rem", fontWeight: 600 }}
                    >
                      리스크 {item.risk}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 rounded-lg bg-gray-50">
                      <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>1년 폐업률</p>
                      <p className="text-amber-600" style={{ fontSize: "1rem", fontWeight: 700 }}>{item.rate1yr}%</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-gray-50">
                      <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>3년 폐업률</p>
                      <p className="text-red-500" style={{ fontSize: "1rem", fontWeight: 700 }}>{item.rate3yr}%</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-gray-50">
                      <p className="text-gray-400" style={{ fontSize: "0.68rem" }}>전주 매장수</p>
                      <p className="text-gray-700" style={{ fontSize: "1rem", fontWeight: 700 }}>{item.stores}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ Section 3: 유망 아이템 추천 ═══════ */}
      {activeSection === "recommend" && (
        <div className="space-y-5">
          {/* Recommendation Cards */}
          <div className="grid grid-cols-1 gap-4">
            {recommendations.map((rec) => (
              <Card
                key={rec.id}
                className={`border-0 shadow-sm ring-1 cursor-pointer transition-all hover:shadow-lg ${
                  selectedRecommendation === rec.id
                    ? "ring-orange-300 shadow-md"
                    : "ring-black/[0.04]"
                }`}
                onClick={() => setSelectedRecommendation(selectedRecommendation === rec.id ? null : rec.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          rec.score >= 90
                            ? "bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-200"
                            : rec.score >= 80
                            ? "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200"
                            : "bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-200"
                        }`}
                      >
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: "1rem", fontWeight: 600 }}>{rec.item}</h4>
                        <p className="text-gray-400 flex items-center gap-1" style={{ fontSize: "0.78rem" }}>
                          <MapPin className="w-3 h-3" /> {rec.area} · 경쟁 {rec.competitorCount}개
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl ${
                          rec.score >= 90
                            ? "bg-orange-100 text-orange-700"
                            : rec.score >= 80
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                        style={{ fontSize: "0.82rem", fontWeight: 700 }}
                      >
                        <Star className="w-3.5 h-3.5" />
                        {rec.score}점
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3" style={{ fontSize: "0.84rem", lineHeight: 1.6 }}>
                    {rec.summary}
                  </p>

                  <div className="flex flex-wrap gap-3" style={{ fontSize: "0.78rem" }}>
                    <span className="text-gray-500">
                      💰 예상매출: <strong className="text-gray-700">{rec.avgRevenue}</strong>
                    </span>
                    <span className="text-gray-500">
                      🏗️ 초기비용: <strong className="text-gray-700">{rec.initialCost}</strong>
                    </span>
                    <span className="text-gray-500">
                      📉 폐업률: <strong className={rec.closureRate > 20 ? "text-red-500" : "text-emerald-600"}>
                        {rec.closureRate}%/1년
                      </strong>
                    </span>
                  </div>

                  {selectedRecommendation === rec.id && (
                    <div className="mt-5 pt-5 border-t border-gray-100 space-y-5">
                      {/* Radar Chart */}
                      <div>
                        <h5 className="mb-3" style={{ fontSize: "0.88rem", fontWeight: 600 }}>종합 평가</h5>
                        <ResponsiveContainer width="100%" height={250}>
                          <RadarChart data={rec.radarData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                            <Radar
                              name="점수"
                              dataKey="A"
                              stroke="#ea580c"
                              fill="#ea580c"
                              fillOpacity={0.15}
                              strokeWidth={2}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Pros & Cons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-emerald-50/50 rounded-xl p-4">
                          <h5 className="text-emerald-700 mb-2 flex items-center gap-1" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                            <TrendingUp className="w-4 h-4" /> 기회 요인
                          </h5>
                          <ul className="space-y-1.5">
                            {rec.pros.map((p, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-emerald-700" style={{ fontSize: "0.8rem" }}>
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-red-50/50 rounded-xl p-4">
                          <h5 className="text-red-600 mb-2 flex items-center gap-1" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                            <AlertTriangle className="w-4 h-4" /> 리스크 요인
                          </h5>
                          <ul className="space-y-1.5">
                            {rec.cons.map((c, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-red-600" style={{ fontSize: "0.8rem" }}>
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-red-400 shrink-0" />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Target Customer */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-gray-500" style={{ fontSize: "0.78rem" }}>
                          🎯 주요 타깃 고객: <strong className="text-gray-700">{rec.targetCustomer}</strong>
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedRecommendation !== rec.id && (
                    <div className="mt-3 flex items-center gap-1 text-orange-500" style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                      상세 분석 보기 <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
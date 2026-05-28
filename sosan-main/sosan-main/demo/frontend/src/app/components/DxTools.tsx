import { useState } from "react";
import {
  Package,
  Calculator,
  Plus,
  Minus,
  BookOpen,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
  X,
  Check,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

// ========== Inventory Management ==========
interface InventoryItem {
  id: number;
  name: string;
  barcode: string;
  stock: number;
  unit: string;
  minStock: number;
  lastUpdated: string;
  category: string;
}

const initialInventory: InventoryItem[] = [
  { id: 1, name: "쌀 (10kg)", barcode: "8801234567890", stock: 5, unit: "포", minStock: 2, lastUpdated: "2026.02.24", category: "식재료" },
  { id: 2, name: "식용유 (1.8L)", barcode: "8801234567891", stock: 12, unit: "병", minStock: 5, lastUpdated: "2026.02.23", category: "식재료" },
  { id: 3, name: "일회용 컵 (1000개)", barcode: "8801234567892", stock: 3, unit: "박스", minStock: 2, lastUpdated: "2026.02.22", category: "소모품" },
  { id: 4, name: "냅킨 (500매)", barcode: "8801234567893", stock: 8, unit: "팩", minStock: 3, lastUpdated: "2026.02.24", category: "소모품" },
  { id: 5, name: "돼지고기 삼겹살 (1kg)", barcode: "8801234567894", stock: 15, unit: "팩", minStock: 5, lastUpdated: "2026.02.24", category: "식재료" },
  { id: 6, name: "코카콜라 (1.5L)", barcode: "8801234567895", stock: 20, unit: "병", minStock: 10, lastUpdated: "2026.02.23", category: "음료" },
];

function InventoryTab() {
  const [inventory, setInventory] = useState(initialInventory);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", stock: "", unit: "개", minStock: "3", category: "식재료" });

  const adjustStock = (id: number, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stock: Math.max(0, item.stock + delta), lastUpdated: "2026.02.24" } : item
      )
    );
  };

  const stockData = inventory.map((item) => ({
    name: item.name.length > 8 ? item.name.substring(0, 8) + "..." : item.name,
    fullName: item.name,
    id: item.id,
    재고: item.stock,
    최소: item.minStock,
  }));

  const categoryData = [
    { name: "식재료", value: inventory.filter((i) => i.category === "식재료").length },
    { name: "소모품", value: inventory.filter((i) => i.category === "소모품").length },
    { name: "음료", value: inventory.filter((i) => i.category === "음료").length },
  ];
  const COLORS = ["#10b981", "#f59e0b", "#3B82F6"];

  return (
    <div className="space-y-6">
      {inventory.filter((i) => i.stock <= i.minStock).length > 0 && (
        <div className="rounded-xl p-4" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: "#ef4444", marginBottom: "6px" }}>재고 부족 알림</p>
          <div className="flex flex-wrap gap-2">
            {inventory.filter((i) => i.stock <= i.minStock).map((item) => (
              <span key={item.id} className="px-2.5 py-1 rounded-full" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", fontSize: "0.78rem", fontWeight: 600 }}>
                {item.name}: {item.stock}{item.unit}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <CardContent className="p-4">
            <h4 className="mb-4 text-white" style={{ fontSize: '0.9rem', fontWeight: 600 }}>재고 현황 차트</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.45)" }} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.45)" }} />
                <Tooltip contentStyle={{ background: "#1a1d24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white" }} />
                <Bar dataKey="재고" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="최소" fill="rgba(16,185,129,0.3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <CardContent className="p-4">
            <h4 className="mb-4 text-white" style={{ fontSize: '0.9rem', fontWeight: 600 }}>카테고리별 분포</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`category-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1a1d24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white" }} />
                <Legend wrapperStyle={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h4 style={{ fontWeight: 600 }}>재고 목록</h4>
        <Button className="bg-primary text-white rounded-lg" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-4 h-4 mr-1" /> 품목 추가
        </Button>
      </div>

      {showAdd && (
        <Card className="border-primary/30">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Input placeholder="품목명" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
              <Input type="number" placeholder="수량" value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })} />
              <select className="border border-border rounded-lg px-3 py-2 bg-white text-sm" value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}>
                <option>개</option><option>포</option><option>병</option><option>박스</option><option>팩</option><option>kg</option>
              </select>
              <select className="border border-border rounded-lg px-3 py-2 bg-white text-sm" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
                <option>식재료</option><option>소모품</option><option>음료</option>
              </select>
              <Button className="bg-primary text-white rounded-lg" onClick={() => {
                if (newItem.name && newItem.stock) {
                  setInventory((prev) => [...prev, {
                    id: Date.now(), name: newItem.name, barcode: String(Date.now()), stock: Number(newItem.stock),
                    unit: newItem.unit, minStock: Number(newItem.minStock), lastUpdated: "2026.02.24", category: newItem.category,
                  }]);
                  setNewItem({ name: "", stock: "", unit: "개", minStock: "3", category: "식재료" });
                  setShowAdd(false);
                }
              }}>추가</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}>
                  <th className="text-left p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>품목</th>
                  <th className="text-left p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>카테고리</th>
                  <th className="text-center p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>재고</th>
                  <th className="text-center p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>상태</th>
                  <th className="text-center p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>입출고</th>
                  <th className="text-right p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>최종 수정</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-white/[0.03] transition-colors" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <td className="p-3">
                      <p className="text-white" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.name}</p>
                      <p className="text-gray-500" style={{ fontSize: '0.75rem' }}>{item.barcode}</p>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-lg text-gray-400" style={{ background: "rgba(255,255,255,0.07)", fontSize: "0.75rem", fontWeight: 500 }}>{item.category}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-white" style={{ fontWeight: 600 }}>{item.stock}</span>
                      <span className="text-gray-500" style={{ fontSize: '0.8rem' }}> {item.unit}</span>
                    </td>
                    <td className="p-3 text-center">
                      {item.stock <= item.minStock ? (
                        <span className="px-2.5 py-1 rounded-full" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", fontSize: "0.72rem", fontWeight: 600 }}>부족</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: "0.72rem", fontWeight: 600 }}>정상</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="outline" size="icon" className="h-7 w-7 rounded" onClick={() => adjustStock(item.id, -1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-7 w-7 rounded" onClick={() => adjustStock(item.id, 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-3 text-right text-muted-foreground" style={{ fontSize: '0.8rem' }}>{item.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ========== Sales Ledger (매출/지출 장부) ==========
interface LedgerEntry {
  id: number;
  date: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  method: string;
}

const initialLedger: LedgerEntry[] = [
  { id: 1, date: "2026.02.24", type: "income", category: "현장매출", description: "점심 매출", amount: 520000, method: "카드" },
  { id: 2, date: "2026.02.24", type: "income", category: "배달매출", description: "배민/쿠팡이츠", amount: 380000, method: "앱결제" },
  { id: 3, date: "2026.02.24", type: "expense", category: "식재료", description: "농산물 시장 장보기", amount: 185000, method: "현금" },
  { id: 4, date: "2026.02.24", type: "expense", category: "인건비", description: "아르바이트 일당 (2명)", amount: 180000, method: "계좌이체" },
  { id: 5, date: "2026.02.23", type: "income", category: "현장매출", description: "점심+저녁 매출", amount: 890000, method: "카드" },
  { id: 6, date: "2026.02.23", type: "income", category: "배달매출", description: "배달 매출", amount: 310000, method: "앱결제" },
  { id: 7, date: "2026.02.23", type: "expense", category: "식재료", description: "정육점 고기 구매", amount: 230000, method: "카드" },
  { id: 8, date: "2026.02.23", type: "expense", category: "공과금", description: "전기요금", amount: 156000, method: "자동이체" },
  { id: 9, date: "2026.02.22", type: "income", category: "현장매출", description: "주말 매출", amount: 1120000, method: "카드" },
  { id: 10, date: "2026.02.22", type: "expense", category: "소모품", description: "포장용기/냅킨", amount: 67000, method: "카드" },
  { id: 11, date: "2026.02.21", type: "income", category: "현장매출", description: "평일 매출", amount: 430000, method: "카드" },
  { id: 12, date: "2026.02.21", type: "expense", category: "식재료", description: "야채/과일 구매", amount: 95000, method: "현금" },
];

const weeklyTrendData = [
  { day: "2/18(화)", 매출: 780000, 지출: 320000 },
  { day: "2/19(수)", 매출: 650000, 지출: 280000 },
  { day: "2/20(목)", 매출: 720000, 지출: 195000 },
  { day: "2/21(금)", 매출: 430000, 지출: 95000 },
  { day: "2/22(토)", 매출: 1120000, 지출: 67000 },
  { day: "2/23(일)", 매출: 1200000, 지출: 386000 },
  { day: "2/24(월)", 매출: 900000, 지출: 365000 },
];

function SalesLedgerTab() {
  const [ledger, setLedger] = useState(initialLedger);
  const [showAdd, setShowAdd] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [newEntry, setNewEntry] = useState({
    type: "income" as "income" | "expense",
    category: "현장매출",
    description: "",
    amount: "",
    method: "카드",
  });

  const totalIncome = ledger.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const totalExpense = ledger.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const incomeCategories = ["현장매출", "배달매출", "기타수입"];
  const expenseCategories = ["식재료", "인건비", "공과금", "소모품", "임대료", "기타지출"];

  const expenseByCategory = expenseCategories.map((cat) => ({
    name: cat,
    value: ledger.filter((e) => e.type === "expense" && e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter((d) => d.value > 0);
  const PIE_COLORS = ["#EF4444", "#F59E0B", "#3B82F6", "#8B5CF6", "#06B6D4", "#6B7280"];

  const filtered = filterType === "all" ? ledger : ledger.filter((e) => e.type === filterType);

  const handleDelete = (id: number) => {
    setLedger((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(59,130,246,0.15)" }}>
                <TrendingUp className="w-4 h-4" style={{ color: "#60a5fa" }} />
              </div>
              <span style={{ fontSize: '0.825rem', fontWeight: 500, color: "#60a5fa" }}>총 매출</span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: "#60a5fa" }}>
              {totalIncome.toLocaleString()}<span style={{ fontSize: '0.9rem' }}>원</span>
            </p>
          </CardContent>
        </Card>
        <Card style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)" }}>
                <TrendingDown className="w-4 h-4" style={{ color: "#f87171" }} />
              </div>
              <span style={{ fontSize: '0.825rem', fontWeight: 500, color: "#f87171" }}>총 지출</span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: "#f87171" }}>
              {totalExpense.toLocaleString()}<span style={{ fontSize: '0.9rem' }}>원</span>
            </p>
          </CardContent>
        </Card>
        <Card style={{ background: netProfit >= 0 ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)", border: `1px solid ${netProfit >= 0 ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}` }}>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: netProfit >= 0 ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)" }}>
                <Wallet className="w-4 h-4" style={{ color: netProfit >= 0 ? "#10b981" : "#f59e0b" }} />
              </div>
              <span style={{ fontSize: '0.825rem', fontWeight: 500, color: netProfit >= 0 ? "#10b981" : "#f59e0b" }}>순이익</span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: netProfit >= 0 ? "#10b981" : "#f59e0b" }}>
              {netProfit >= 0 ? "+" : ""}{netProfit.toLocaleString()}<span style={{ fontSize: '0.9rem' }}>원</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <CardContent className="p-4">
            <h4 className="mb-4 text-white" style={{ fontSize: '0.9rem', fontWeight: 600 }}>주간 매출/지출 추이</h4>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.45)" }} />
                <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.45)" }} tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} />
                <Tooltip contentStyle={{ background: "#1a1d24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white" }} formatter={(value: number) => `${value.toLocaleString()}원`} />
                <Area type="monotone" dataKey="매출" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={2} />
                <Area type="monotone" dataKey="지출" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <CardContent className="p-4">
            <h4 className="mb-4 text-white" style={{ fontSize: '0.9rem', fontWeight: 600 }}>지출 항목별 비중</h4>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`expense-${entry.name}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1a1d24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white" }} formatter={(value: number) => `${value.toLocaleString()}원`} />
                <Legend wrapperStyle={{ fontSize: '0.75rem', color: "rgba(255,255,255,0.6)" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["all", "income", "expense"] as const).map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              className={`rounded-full px-4 h-9 ${filterType === type ? "bg-primary text-white" : ""}`}
              onClick={() => setFilterType(type)}
              style={{ fontSize: '0.825rem' }}
            >
              {type === "all" ? "전체" : type === "income" ? "매출" : "지출"}
            </Button>
          ))}
        </div>
        <Button className="bg-primary text-white rounded-lg" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-4 h-4 mr-1" /> 내역 추가
        </Button>
      </div>

      {/* Add Entry */}
      {showAdd && (
        <Card className="border-primary/30">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <select
                className="border border-border rounded-lg px-3 py-2 bg-white text-sm"
                value={newEntry.type}
                onChange={(e) => setNewEntry({
                  ...newEntry,
                  type: e.target.value as "income" | "expense",
                  category: e.target.value === "income" ? "현장매출" : "식재료",
                })}
              >
                <option value="income">매출</option>
                <option value="expense">지출</option>
              </select>
              <select
                className="border border-border rounded-lg px-3 py-2 bg-white text-sm"
                value={newEntry.category}
                onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
              >
                {(newEntry.type === "income" ? incomeCategories : expenseCategories).map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
              <Input placeholder="설명" value={newEntry.description} onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })} />
              <Input type="number" placeholder="금액" value={newEntry.amount} onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })} />
              <select
                className="border border-border rounded-lg px-3 py-2 bg-white text-sm"
                value={newEntry.method}
                onChange={(e) => setNewEntry({ ...newEntry, method: e.target.value })}
              >
                <option>카드</option><option>현금</option><option>계좌이체</option><option>앱결제</option><option>자동이체</option>
              </select>
              <Button className="bg-primary text-white rounded-lg" onClick={() => {
                if (newEntry.description && newEntry.amount) {
                  setLedger((prev) => [{
                    id: Date.now(),
                    date: "2026.02.24",
                    type: newEntry.type,
                    category: newEntry.category,
                    description: newEntry.description,
                    amount: Number(newEntry.amount),
                    method: newEntry.method,
                  }, ...prev]);
                  setNewEntry({ type: "income", category: "현장매출", description: "", amount: "", method: "카드" });
                  setShowAdd(false);
                }
              }}>추가</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ledger Table */}
      <Card style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}>
                  <th className="text-left p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>날짜</th>
                  <th className="text-left p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>구분</th>
                  <th className="text-left p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>카테고리</th>
                  <th className="text-left p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>내용</th>
                  <th className="text-right p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>금액</th>
                  <th className="text-center p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>결제</th>
                  <th className="text-center p-3" style={{ fontSize: '0.825rem', fontWeight: 600 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-white/[0.03] transition-colors" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <td className="p-3 text-gray-300" style={{ fontSize: '0.825rem' }}>{entry.date}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full" style={{ background: entry.type === "income" ? "rgba(59,130,246,0.2)" : "rgba(239,68,68,0.2)", color: entry.type === "income" ? "#93c5fd" : "#fca5a5", fontSize: "0.72rem", fontWeight: 700 }}>
                        {entry.type === "income" ? "매출" : "지출"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.1)", color: "#d1d5db", fontSize: "0.75rem", fontWeight: 500 }}>{entry.category}</span>
                    </td>
                    <td className="p-3 text-gray-200" style={{ fontSize: '0.875rem' }}>{entry.description}</td>
                    <td className="p-3 text-right" style={{ fontWeight: 700, fontSize: '0.9rem', color: entry.type === "income" ? "#60a5fa" : "#f87171" }}>
                      {entry.type === "income" ? "+" : "-"}{entry.amount.toLocaleString()}원
                    </td>
                    <td className="p-3 text-center text-gray-300" style={{ fontSize: '0.8rem' }}>{entry.method}</td>
                    <td className="p-3 text-center">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500" onClick={() => handleDelete(entry.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ========== Employee Schedule (직원 근무 관리) ==========
interface Employee {
  id: number;
  name: string;
  role: string;
  hourlyWage: number;
  phone: string;
  status: "active" | "off";
}

interface ShiftEntry {
  id: number;
  employeeId: number;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  status: "completed" | "ongoing" | "scheduled";
}

const initialEmployees: Employee[] = [
  { id: 1, name: "김서연", role: "홀 서빙", hourlyWage: 10030, phone: "010-****-1234", status: "active" },
  { id: 2, name: "이준호", role: "주방 보조", hourlyWage: 10030, phone: "010-****-5678", status: "active" },
  { id: 3, name: "박민지", role: "홀 서빙", hourlyWage: 10530, phone: "010-****-9012", status: "active" },
  { id: 4, name: "정현우", role: "배달", hourlyWage: 11000, phone: "010-****-3456", status: "off" },
  { id: 5, name: "최유진", role: "주방 보조", hourlyWage: 10030, phone: "010-****-7890", status: "active" },
];

const initialShifts: ShiftEntry[] = [
  { id: 1, employeeId: 1, date: "2026.02.24", startTime: "11:00", endTime: "17:00", hours: 6, status: "ongoing" },
  { id: 2, employeeId: 2, date: "2026.02.24", startTime: "10:00", endTime: "16:00", hours: 6, status: "ongoing" },
  { id: 3, employeeId: 3, date: "2026.02.24", startTime: "17:00", endTime: "22:00", hours: 5, status: "scheduled" },
  { id: 4, employeeId: 5, date: "2026.02.24", startTime: "10:00", endTime: "14:00", hours: 4, status: "completed" },
  { id: 5, employeeId: 1, date: "2026.02.23", startTime: "11:00", endTime: "17:00", hours: 6, status: "completed" },
  { id: 6, employeeId: 2, date: "2026.02.23", startTime: "10:00", endTime: "16:00", hours: 6, status: "completed" },
  { id: 7, employeeId: 3, date: "2026.02.23", startTime: "17:00", endTime: "22:00", hours: 5, status: "completed" },
  { id: 8, employeeId: 4, date: "2026.02.23", startTime: "11:00", endTime: "15:00", hours: 4, status: "completed" },
  { id: 9, employeeId: 5, date: "2026.02.23", startTime: "16:00", endTime: "22:00", hours: 6, status: "completed" },
];

const weekDays = ["월", "화", "수", "목", "금", "토", "일"];
const weekSchedule = [
  { day: "2/24(월)", shifts: [{ name: "김서연", time: "11-17" }, { name: "이준호", time: "10-16" }, { name: "박민지", time: "17-22" }, { name: "최유진", time: "10-14" }] },
  { day: "2/25(화)", shifts: [{ name: "김서연", time: "11-17" }, { name: "이준호", time: "10-16" }, { name: "정현우", time: "11-15" }, { name: "최유진", time: "16-22" }] },
  { day: "2/26(수)", shifts: [{ name: "박민지", time: "11-17" }, { name: "이준호", time: "10-16" }, { name: "최유진", time: "10-14" }] },
  { day: "2/27(목)", shifts: [{ name: "김서연", time: "11-17" }, { name: "정현우", time: "11-15" }, { name: "박민지", time: "17-22" }] },
  { day: "2/28(금)", shifts: [{ name: "김서연", time: "11-17" }, { name: "이준호", time: "10-16" }, { name: "박민지", time: "17-22" }, { name: "최유진", time: "16-22" }] },
  { day: "3/1(토)", shifts: [{ name: "김서연", time: "10-17" }, { name: "이준호", time: "10-16" }, { name: "박민지", time: "16-22" }, { name: "정현우", time: "11-17" }, { name: "최유진", time: "10-16" }] },
  { day: "3/2(일)", shifts: [{ name: "김서연", time: "10-17" }, { name: "이준호", time: "10-16" }, { name: "박민지", time: "16-22" }, { name: "최유진", time: "10-16" }] },
];

function EmployeeScheduleTab() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newEmployee, setNewEmployee] = useState({ name: "", role: "홀 서빙", hourlyWage: "", phone: "", status: "active" as "active" | "off" });
  const [editForm, setEditForm] = useState<{ name: string; role: string; hourlyWage: string; phone: string; status: "active" | "off" } | null>(null);

  const weeklyHoursData = employees.map((emp) => {
    const totalHours = initialShifts
      .filter((s) => s.employeeId === emp.id && s.status === "completed")
      .reduce((sum, s) => sum + s.hours, 0);
    return { id: emp.id, name: `${emp.name}_${emp.id}`, displayName: emp.name, 시간: totalHours, 급여: totalHours * emp.hourlyWage };
  });

  const todayShifts = initialShifts.filter((s) => s.date === "2026.02.24");
  const totalMonthlyWage = weeklyHoursData.reduce((sum, d) => sum + d.급여, 0);
  const activeCount = employees.filter((e) => e.status === "active").length;

  const roles = ["홀 서빙", "주방 보조", "배달", "카운터", "청소", "기타"];

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.hourlyWage) return;
    setEmployees((prev) => [...prev, {
      id: Date.now(),
      name: newEmployee.name,
      role: newEmployee.role,
      hourlyWage: Number(newEmployee.hourlyWage),
      phone: newEmployee.phone || "010-****-0000",
      status: newEmployee.status,
    }]);
    setNewEmployee({ name: "", role: "홀 서빙", hourlyWage: "", phone: "", status: "active" });
    setShowAdd(false);
  };

  const startEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setEditForm({ name: emp.name, role: emp.role, hourlyWage: String(emp.hourlyWage), phone: emp.phone, status: emp.status });
  };

  const saveEdit = () => {
    if (!editForm || !editingId) return;
    setEmployees((prev) => prev.map((e) => e.id === editingId ? {
      ...e,
      name: editForm.name,
      role: editForm.role,
      hourlyWage: Number(editForm.hourlyWage),
      phone: editForm.phone,
      status: editForm.status,
    } : e));
    setEditingId(null);
    setEditForm(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const deleteEmployee = (id: number) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: UserCheck, label: "오늘 출근", value: `${todayShifts.length}명`, bg: "rgba(59,130,246,0.08)", iconBg: "rgba(59,130,246,0.15)", color: "#60a5fa" },
          { icon: Clock, label: "오늘 근무시간", value: `${todayShifts.reduce((s, sh) => s + sh.hours, 0)}시간`, bg: "rgba(16,185,129,0.08)", iconBg: "rgba(16,185,129,0.15)", color: "#10b981" },
          { icon: Wallet, label: "주간 인건비 (예상)", value: `${totalMonthlyWage.toLocaleString()}원`, bg: "rgba(139,92,246,0.08)", iconBg: "rgba(139,92,246,0.15)", color: "#a78bfa" },
          { icon: UserCheck, label: "등록 직원", value: `${employees.length}명`, bg: "rgba(16,185,129,0.08)", iconBg: "rgba(16,185,129,0.15)", color: "#10b981" },
        ].map((stat) => (
          <Card key={stat.label} style={{ background: stat.bg, border: `1px solid ${stat.bg.replace("0.08", "0.2")}` }}>
            <CardContent className="p-4 text-center">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: stat.iconBg }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>{stat.label}</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Hours Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <CardContent className="p-4">
            <h4 className="mb-4 text-white" style={{ fontSize: '0.9rem', fontWeight: 600 }}>직원별 주간 근무시간</h4>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyHoursData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.45)" }} unit="h" />
                <YAxis type="category" dataKey="displayName" tick={{ fontSize: 12, fill: "rgba(255,255,255,0.45)" }} width={50} />
                <Tooltip contentStyle={{ background: "#1a1d24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white" }} formatter={(value: number, name: string) => name === "시간" ? `${value}시간` : `${value.toLocaleString()}원`} />
                <Bar dataKey="시간" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Today's Shifts */}
        <Card style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <CardContent className="p-4">
            <h4 className="mb-4 text-white" style={{ fontSize: '0.9rem', fontWeight: 600 }}>오늘의 근무 현황 (2/24)</h4>
            <div className="space-y-3">
              {todayShifts.map((shift) => {
                const emp = employees.find((e) => e.id === shift.employeeId);
                if (!emp) return null;
                return (
                  <div key={shift.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 ${
                      shift.status === "completed" ? "bg-green-500" : shift.status === "ongoing" ? "bg-blue-500" : "bg-gray-400"
                    }`} style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                      {emp.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{emp.name}</span>
                        <Badge variant="outline" className="text-xs">{emp.role}</Badge>
                      </div>
                      <p className="text-muted-foreground" style={{ fontSize: '0.8rem' }}>
                        {shift.startTime} ~ {shift.endTime} ({shift.hours}시간)
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full shrink-0" style={{
                      background: shift.status === "completed" ? "rgba(16,185,129,0.15)" : shift.status === "ongoing" ? "rgba(59,130,246,0.15)" : "rgba(156,163,175,0.15)",
                      color: shift.status === "completed" ? "#10b981" : shift.status === "ongoing" ? "#60a5fa" : "#9ca3af",
                      fontSize: "0.72rem", fontWeight: 600,
                    }}>
                      {shift.status === "completed" ? "퇴근" : shift.status === "ongoing" ? "근무중" : "예정"}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule Grid */}
      <Card style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <CardContent className="p-4">
          <h4 className="mb-4 text-white" style={{ fontSize: '0.9rem', fontWeight: 600 }}>주간 근무 스케줄</h4>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 min-w-[700px]">
              {weekSchedule.map((day, idx) => (
                <div key={day.day} className="rounded-xl p-3" style={{ background: idx === 0 ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)", border: idx === 0 ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-center mb-3" style={{ fontSize: '0.8rem', fontWeight: 600, color: idx === 0 ? "#10b981" : "rgba(255,255,255,0.45)" }}>
                    {day.day}
                  </p>
                  <div className="space-y-1.5">
                    {day.shifts.map((shift, sIdx) => (
                      <div key={sIdx} className="rounded-lg px-2 py-1.5" style={{ background: "rgba(255,255,255,0.07)" }}>
                        <p className="text-white" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{shift.name}</p>
                        <p className="text-gray-500" style={{ fontSize: '0.65rem' }}>{shift.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 style={{ fontWeight: 600 }}>직원 목록</h4>
          <Button className="bg-primary text-white rounded-lg" onClick={() => { setShowAdd(!showAdd); cancelEdit(); }}>
            <Plus className="w-4 h-4 mr-1" /> 직원 추가
          </Button>
        </div>

        {/* Add Employee Form */}
        {showAdd && (
          <Card className="mb-4" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <CardContent className="p-4">
              <p className="mb-3 text-white" style={{ fontSize: '0.875rem', fontWeight: 600 }}>새 직원 등록</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Input
                  placeholder="이름 *"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                />
                <select
                  className="rounded-lg px-3 py-2 text-sm text-white"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                >
                  {roles.map((r) => <option key={r} style={{ background: "#1a1d24" }}>{r}</option>)}
                </select>
                <Input
                  type="number"
                  placeholder="시급 (원) *"
                  value={newEmployee.hourlyWage}
                  onChange={(e) => setNewEmployee({ ...newEmployee, hourlyWage: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                />
                <Input
                  placeholder="연락처 (010-xxxx-xxxx)"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                />
                <select
                  className="rounded-lg px-3 py-2 text-sm text-white"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                  value={newEmployee.status}
                  onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value as "active" | "off" })}
                >
                  <option value="active" style={{ background: "#1a1d24" }}>근무중</option>
                  <option value="off" style={{ background: "#1a1d24" }}>휴무</option>
                </select>
              </div>
              <div className="flex gap-2 mt-3">
                <Button className="bg-primary text-white rounded-lg" onClick={handleAddEmployee}>
                  <Check className="w-4 h-4 mr-1" /> 등록
                </Button>
                <Button variant="outline" className="rounded-lg" onClick={() => setShowAdd(false)}>
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}>
                    <th className="text-left p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>이름</th>
                    <th className="text-left p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>역할</th>
                    <th className="text-right p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>시급</th>
                    <th className="text-center p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>연락처</th>
                    <th className="text-center p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>상태</th>
                    <th className="text-right p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>주간 근무</th>
                    <th className="text-right p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>예상 급여</th>
                    <th className="text-center p-3 text-gray-400" style={{ fontSize: '0.825rem', fontWeight: 600 }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => {
                    const empData = weeklyHoursData.find((d) => d.id === emp.id);
                    const isEditing = editingId === emp.id;
                    return (
                      <tr key={emp.id} className="border-b transition-colors" style={{ borderColor: "rgba(255,255,255,0.05)", background: isEditing ? "rgba(16,185,129,0.05)" : undefined }}>
                        {isEditing && editForm ? (
                          <>
                            <td className="p-2">
                              <Input className="h-8 text-sm" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                            </td>
                            <td className="p-2">
                              <select
                                className="rounded-lg px-2 py-1.5 text-sm w-full text-white"
                                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                                value={editForm.role}
                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                              >
                                {roles.map((r) => <option key={r} style={{ background: "#1a1d24" }}>{r}</option>)}
                              </select>
                            </td>
                            <td className="p-2">
                              <Input type="number" className="h-8 text-sm text-right" value={editForm.hourlyWage} onChange={(e) => setEditForm({ ...editForm, hourlyWage: e.target.value })} />
                            </td>
                            <td className="p-2">
                              <Input className="h-8 text-sm text-center" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                            </td>
                            <td className="p-2 text-center">
                              <select
                                className="rounded-lg px-2 py-1.5 text-sm text-white"
                                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                                value={editForm.status}
                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as "active" | "off" })}
                              >
                                <option value="active" style={{ background: "#1a1d24" }}>근무중</option>
                                <option value="off" style={{ background: "#1a1d24" }}>휴무</option>
                              </select>
                            </td>
                            <td className="p-2 text-right text-gray-200" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{empData?.시간 || 0}시간</td>
                            <td className="p-2 text-right text-white" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{(empData?.급여 || 0).toLocaleString()}원</td>
                            <td className="p-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button size="icon" className="h-7 w-7 bg-primary text-white rounded" onClick={saveEdit}>
                                  <Check className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-7 w-7 rounded" onClick={cancelEdit}>
                                  <X className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${emp.status === "active" ? "bg-primary" : "bg-gray-600"}`} style={{ fontSize: '0.7rem', fontWeight: 600 }}>
                                  {emp.name.charAt(0)}
                                </div>
                                <span className="text-gray-100" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{emp.name}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="px-2.5 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.1)", color: "#d1d5db", fontSize: "0.75rem", fontWeight: 500 }}>{emp.role}</span>
                            </td>
                            <td className="p-3 text-right text-gray-200" style={{ fontSize: '0.85rem' }}>{emp.hourlyWage.toLocaleString()}원</td>
                            <td className="p-3 text-center text-gray-300" style={{ fontSize: '0.825rem' }}>{emp.phone}</td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-1 rounded-full" style={{ background: emp.status === "active" ? "rgba(16,185,129,0.15)" : "rgba(156,163,175,0.15)", color: emp.status === "active" ? "#10b981" : "#9ca3af", fontSize: "0.72rem", fontWeight: 600 }}>
                                {emp.status === "active" ? "근무중" : "휴무"}
                              </span>
                            </td>
                            <td className="p-3 text-right text-gray-200" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{empData?.시간 || 0}시간</td>
                            <td className="p-3 text-right text-white" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{(empData?.급여 || 0).toLocaleString()}원</td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-primary" onClick={() => startEdit(emp)}>
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500" onClick={() => deleteEmployee(emp.id)}>
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ========== Margin Calculator ==========
function MarginCalculatorTab() {
  const [cost, setCost] = useState("8000");
  const [selling, setSelling] = useState("15000");
  const [platformFee, setPlatformFee] = useState("15");
  const [cardFee, setCardFee] = useState("2.5");
  const [quantity, setQuantity] = useState("100");
  const [rent, setRent] = useState("1500000");
  const [labor, setLabor] = useState("2000000");

  const costNum = Number(cost) || 0;
  const sellingNum = Number(selling) || 0;
  const platformFeeNum = Number(platformFee) || 0;
  const cardFeeNum = Number(cardFee) || 0;
  const quantityNum = Number(quantity) || 0;
  const rentNum = Number(rent) || 0;
  const laborNum = Number(labor) || 0;

  const platformFeeAmount = sellingNum * platformFeeNum / 100;
  const cardFeeAmount = sellingNum * cardFeeNum / 100;
  const netPerItem = sellingNum - costNum - platformFeeAmount - cardFeeAmount;
  const marginRate = sellingNum > 0 ? (netPerItem / sellingNum * 100) : 0;
  const monthlyRevenue = sellingNum * quantityNum;
  const monthlyCost = costNum * quantityNum + rentNum + laborNum;
  const monthlyPlatformFee = platformFeeAmount * quantityNum;
  const monthlyCardFee = cardFeeAmount * quantityNum;
  const monthlyProfit = monthlyRevenue - monthlyCost - monthlyPlatformFee - monthlyCardFee;

  const chartData = [
    { name: "원가", value: costNum * quantityNum },
    { name: "플랫폼 수수료", value: monthlyPlatformFee },
    { name: "카드 수수료", value: monthlyCardFee },
    { name: "임대료", value: rentNum },
    { name: "인건비", value: laborNum },
    { name: "순이익", value: Math.max(0, monthlyProfit) },
  ];
  const PIE_COLORS = ["#f87171", "#fbbf24", "#c084fc", "#60a5fa", "#22d3ee", "#34d399"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <Card style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <CardContent className="p-5">
              <h4 className="mb-4 text-white" style={{ fontWeight: 600 }}>단품 정보</h4>
              <div className="space-y-3">
                <div>
                  <label style={{ fontSize: '0.825rem', color: "#9ca3af", display: "block", marginBottom: "4px" }}>원가 (원)</label>
                  <Input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
                </div>
                <div>
                  <label style={{ fontSize: '0.825rem', color: "#9ca3af", display: "block", marginBottom: "4px" }}>판매가 (원)</label>
                  <Input type="number" value={selling} onChange={(e) => setSelling(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={{ fontSize: '0.825rem', color: "#9ca3af", display: "block", marginBottom: "4px" }}>플랫폼 수수료 (%)</label>
                    <Input type="number" value={platformFee} onChange={(e) => setPlatformFee(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.825rem', color: "#9ca3af", display: "block", marginBottom: "4px" }}>카드 수수료 (%)</label>
                    <Input type="number" value={cardFee} onChange={(e) => setCardFee(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <CardContent className="p-5">
              <h4 className="mb-4 text-white" style={{ fontWeight: 600 }}>월간 정보</h4>
              <div className="space-y-3">
                <div>
                  <label style={{ fontSize: '0.825rem', color: "#9ca3af", display: "block", marginBottom: "4px" }}>월 예상 판매량 (개)</label>
                  <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
                </div>
                <div>
                  <label style={{ fontSize: '0.825rem', color: "#9ca3af", display: "block", marginBottom: "4px" }}>월 임대료 (원)</label>
                  <Input type="number" value={rent} onChange={(e) => setRent(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
                </div>
                <div>
                  <label style={{ fontSize: '0.825rem', color: "#9ca3af", display: "block", marginBottom: "4px" }}>월 인건비 (원)</label>
                  <Input type="number" value={labor} onChange={(e) => setLabor(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Result */}
        <div className="space-y-4">
          <Card style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <CardContent className="p-5">
              <h4 className="mb-4 text-white" style={{ fontWeight: 600 }}>단품 수익 분석</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>판매가</p>
                  <p className="text-primary" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{sellingNum.toLocaleString()}원</p>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>원가</p>
                  <p className="text-white" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{costNum.toLocaleString()}원</p>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>순수익</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700, color: netPerItem >= 0 ? "#10b981" : "#f87171" }}>
                    {netPerItem.toLocaleString()}원
                  </p>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>마진율</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700, color: marginRate >= 0 ? "#10b981" : "#f87171" }}>
                    {marginRate.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-gray-400" style={{ fontSize: '0.8rem' }}>
                  <span>플랫폼 수수료</span>
                  <span>-{platformFeeAmount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-gray-400" style={{ fontSize: '0.8rem' }}>
                  <span>카드 수수료</span>
                  <span>-{cardFeeAmount.toLocaleString()}원</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <CardContent className="p-5">
              <h4 className="mb-4 text-white" style={{ fontWeight: 600 }}>월간 수익 시뮬레이션</h4>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-100" style={{ fontSize: '0.875rem' }}>
                  <span>월 매출</span>
                  <span style={{ fontWeight: 600 }}>{monthlyRevenue.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-gray-400" style={{ fontSize: '0.825rem' }}>
                  <span>- 원가 합계</span>
                  <span>{(costNum * quantityNum).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-gray-400" style={{ fontSize: '0.825rem' }}>
                  <span>- 플랫폼 수수료</span>
                  <span>{monthlyPlatformFee.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-gray-400" style={{ fontSize: '0.825rem' }}>
                  <span>- 카드 수수료</span>
                  <span>{monthlyCardFee.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-gray-400" style={{ fontSize: '0.825rem' }}>
                  <span>- 임대료</span>
                  <span>{rentNum.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-gray-400" style={{ fontSize: '0.825rem' }}>
                  <span>- 인건비</span>
                  <span>{laborNum.toLocaleString()}원</span>
                </div>
                <div className="border-t pt-2 flex justify-between" style={{ fontSize: '1rem', borderColor: "rgba(255,255,255,0.1)" }}>
                  <span className="text-white" style={{ fontWeight: 700 }}>월 순이익</span>
                  <span style={{ fontWeight: 700, color: monthlyProfit >= 0 ? "#10b981" : "#f87171" }}>
                    {monthlyProfit.toLocaleString()}원
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <CardContent className="p-4">
              <h4 className="mb-3 text-white" style={{ fontSize: '0.9rem', fontWeight: 600 }}>비용 구조</h4>
              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
                {chartData.filter(d => d.value > 0).map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[index % PIE_COLORS.length] }} />
                    <span className="text-gray-300" style={{ fontSize: "0.75rem" }}>{entry.name}</span>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={chartData.filter(d => d.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={2}
                  >
                    {chartData.filter(d => d.value > 0).map((entry, index) => (
                      <Cell key={`margin-${entry.name}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#1a1d24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white" }}
                    formatter={(value: number, name: string) => [`${value.toLocaleString()}원`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ========== Main DxTools Component ==========
export function DxTools() {
  return (
    <div 
      className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10"
      style={{
        minHeight: '100vh',
        backgroundColor: '#141720',
        backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 50%)`,
      }}
    >
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-white" style={{ fontSize: '1.55rem', fontWeight: 700, letterSpacing: '-0.02em' }}>서비스</h1>
        </div>
        <p className="text-gray-400" style={{ fontSize: '0.9rem' }}>소상공인에게 꼭 필요한 가벼운 관리 도구</p>
      </div>

      <Tabs defaultValue="inventory">
        <TabsList className="bg-white/5 rounded-xl mb-8 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="inventory" className="rounded-lg gap-1.5 data-[state=active]:shadow-sm px-4 data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400">
            <Package className="w-4 h-4" /> 재고 관리
          </TabsTrigger>
          <TabsTrigger value="ledger" className="rounded-lg gap-1.5 data-[state=active]:shadow-sm px-4 data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400">
            <BookOpen className="w-4 h-4" /> 매출/지출 장부
          </TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-lg gap-1.5 data-[state=active]:shadow-sm px-4 data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400">
            <CalendarDays className="w-4 h-4" /> 직원 근무관리
          </TabsTrigger>
          <TabsTrigger value="margin" className="rounded-lg gap-1.5 data-[state=active]:shadow-sm px-4 data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400">
            <Calculator className="w-4 h-4" /> 마진 계산기
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <InventoryTab />
        </TabsContent>
        <TabsContent value="ledger">
          <SalesLedgerTab />
        </TabsContent>
        <TabsContent value="schedule">
          <EmployeeScheduleTab />
        </TabsContent>
        <TabsContent value="margin">
          <MarginCalculatorTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
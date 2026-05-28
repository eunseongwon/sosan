import { useEffect, useMemo, useState, ReactNode } from "react";
import { useNavigate } from "react-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Store,
} from "lucide-react";

type ScoreItem = {
  label: string;
  value: number;
  desc: string;
};

type AiData = {
  summary: string;
  actions: string[];
  detailed: string;
};

type SupportItem = {
  id: number;
  title: string;
  org: string;
  status: string;
  amount: string;
};

type QaItem = {
  question: string;
  answer: string;
};

type StageFrameProps = {
  children: ReactNode;
  showPrev?: boolean;
  showNext?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
};

const StageFrame = ({
                      children,
                      showPrev = false,
                      showNext = false,
                      onPrev,
                      onNext,
                    }: StageFrameProps) => {
  return (
      <div className="relative flex items-center justify-center">
        {showPrev && onPrev && (
            <button
                onClick={onPrev}
                className="absolute -left-20 lg:-left-24 top-1/2 -translate-y-1/2 w-14 h-14
                     bg-white/5 border border-white/10 rounded-full hidden lg:flex
                     items-center justify-center text-zinc-400
                     hover:text-white hover:bg-emerald-500/20
                     hover:border-emerald-500/50 transition-all z-20 shadow-xl"
            >
              <ChevronLeft className="w-8 h-8 mr-1" />
            </button>
        )}

        <div className="w-full">{children}</div>

        {showNext && onNext && (
            <button
                onClick={onNext}
                className="absolute -right-20 lg:-right-24 top-1/2 -translate-y-1/2 w-14 h-14
                     bg-white/5 border border-white/10 rounded-full hidden lg:flex
                     items-center justify-center text-zinc-400
                     hover:text-white hover:bg-emerald-500/20
                     hover:border-emerald-500/50 transition-all z-20 shadow-xl"
            >
              <ChevronRight className="w-8 h-8 ml-1" />
            </button>
        )}
      </div>
  );
};
// 오각형 레이더 차트 컴포넌트
function QaRadarChart({
                        items,
                        setTooltip,
                      }: {
  items: QaItem[];
  setTooltip: any;
}) {
  const displayItems = Array.from({ length: 5 }).map(
      (_, i) => items[i % items.length],
  );

  const size = 340;
  const center = size / 2;
  const maxRadius = 140;

  // 각도를 계산하여 x, y 좌표를 구하는 함수
  const getPoint = (i: number, r: number) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / 5;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const levels = [0.33, 0.66, 1];

  // 각 꼭짓점별 시각적 점수 (그래프의 불규칙한 모양을 형성)
  const getScoreRadius = (idx: number) => {
    const scores = [0.9, 0.65, 0.85, 0.7, 0.8];
    return maxRadius * scores[idx];
  };

  const dataPoints = displayItems.map((_, i) => getPoint(i, getScoreRadius(i)));
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
      <div className="flex justify-center py-4 w-full">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="overflow-visible">
            {/* 거미줄 배경 다각형 */}
            {levels.map((level, lvlIdx) => {
              const pts = Array.from({ length: 5 }).map((_, i) =>
                  getPoint(i, maxRadius * level),
              );
              return (
                  <polygon
                      key={lvlIdx}
                      points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
                      fill="none"
                      stroke="#3f3f46"
                      strokeWidth="1"
                  />
              );
            })}
            {/* 중심에서 꼭짓점으로 뻗어나가는 선 */}
            {Array.from({ length: 5 }).map((_, i) => {
              const end = getPoint(i, maxRadius);
              return (
                  <line
                      key={i}
                      x1={center}
                      y1={center}
                      x2={end.x}
                      y2={end.y}
                      stroke="#3f3f46"
                      strokeWidth="1"
                  />
              );
            })}

            {/* 데이터 영역 다각형 */}
            <polygon
                points={dataPolygon}
                fill="rgba(52, 211, 153, 0.15)"
                stroke="#34d399"
                strokeWidth="2"
            />

            {/* 정중앙 점 */}
            <circle cx={center} cy={center} r="3" fill="#34d399" opacity="0.6" />

            {/* 각 꼭짓점 점 */}
            {dataPoints.map((p, i) => (
                <g
                    key={i}
                    onMouseEnter={(e) => {
                      setTooltip({
                        visible: true,
                        x: e.clientX,
                        y: e.clientY,
                        type: "qa", // 2줄짜리 QA 스타일 적용
                        title: `질문: ${displayItems[i].question}`,
                        text: `응답: ${displayItems[i].answer}`,
                      });
                    }}
                    onMouseMove={(e) => {
                      setTooltip((prev: any) => ({
                        ...prev,
                        x: e.clientX,
                        y: e.clientY,
                      }));
                    }}
                    onMouseLeave={() => {
                      setTooltip((prev: any) => ({ ...prev, visible: false }));
                    }}
                    className="cursor-pointer transition-all hover:scale-125"
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                >
                  <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" />
                  <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
                </g>
            ))}
          </svg>
        </div>
      </div>
  );
}

function HugeGradeGauge({
                          score,
                          topStrengths,
                          topWeakness,
                        }: {
  score: number;
  topStrengths: { label: string; value: number }[];
  topWeakness?: { label: string; value: number };
}) {
  const r = 140;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circ - (score / 100) * circ);
    }, 120);
    return () => clearTimeout(timer);
  }, [score, circ]);

  let grade = "C";
  if (score >= 90) grade = "S";
  else if (score >= 80) grade = "A";
  else if (score >= 70) grade = "B";

  return (
      <div
          className="relative flex flex-col items-center justify-center z-10"
          style={{ width: 320, height: 320 }}
      >
        <svg
            width="320"
            height="320"
            viewBox="0 0 320 320"
            className="transform -rotate-90 drop-shadow-2xl"
        >
          <circle
              cx="160"
              cy="160"
              r={r}
              fill="none"
              stroke="#27272a"
              strokeWidth="6"
          />
          <circle
              cx="160"
              cy="160"
              r={r}
              fill="none"
              stroke="#34d399"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 2s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
        <span className="text-7xl font-black text-emerald-400 leading-none mb-3 drop-shadow-lg">
          {grade}
        </span>
          <div className="flex flex-col items-center gap-1.5 mb-4">
            {topStrengths.map((s) => (
                <span
                    key={s.label}
                    className="text-emerald-300 text-sm font-bold tracking-wide"
                >
              {s.label} +{s.value}
            </span>
            ))}
            {/* 스케치에 있던 빨간색 글씨 (단점/약점) 반영 */}
            {topWeakness && (
                <span className="text-red-400 text-sm font-bold tracking-wide mt-0.5">
              단점({topWeakness.label}) -{Math.max(0, 100 - topWeakness.value)}
            </span>
            )}
          </div>
          <span className="text-white font-bold text-xl">{score}점</span>
        </div>
      </div>
  );
}

function TypewriterText({
                          text,
                          speed = 28,
                        }: {
  text: string;
  speed?: number;
}) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    if (!text) return;

    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i += 1;
      if (i >= text.length) clearInterval(timer);
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
      <>
        {displayedText}
        <span className="animate-pulse inline-block w-[2px] h-[1em] bg-emerald-400 align-middle ml-1" />
      </>
  );
}

function buildAiData(
    challenge: string,
    storeSize: string,
    operationScore: number,
): AiData {
  if (challenge.includes("마케팅")) {
    return {
      summary:
          "고객 유입은 발생하지만 재방문 전환이 약해 매출 성장이 둔화된 상태입니다. 마케팅 메시지와 리뷰 관리 흐름을 함께 개선하시면 효율이 빠르게 올라갑니다.",
      actions: [
        "주 2회 고정 콘텐츠와 리뷰 응답 루틴을 운영해 고객 반응을 꾸준히 쌓아주세요.",
        "피크 시간대 한정 프로모션을 진행해 광고 비용 대비 전환율을 높이세요.",
      ],
      detailed: `현재 ${storeSize} 매장은 노출 자체보다 전환 구조를 손보는 것이 핵심입니다. 홍보 채널이 분산되어 있거나 일관성이 부족하면 고객이 관심을 가져도 실제 방문으로 이어지지 않습니다.\n\n채널별 역할을 단순화하시길 권장드립니다. SNS는 방문 유도용, 플랫폼은 주문 전환용, 오프라인은 재방문 혜택 안내용으로 분리하시면 운영 피로를 줄이면서 성과를 명확히 확인할 수 있습니다.\n\n운영 점수 ${operationScore}점을 기준으로 보면 단기적으로는 리뷰 응대 속도와 이벤트 품질을 먼저 강화하시는 것이 가장 효과적입니다. 이후 월 단위로 신규/재방문 비중을 비교해 전략을 조정해보세요.`,
    };
  }

  if (challenge.includes("인건비") || challenge.includes("재료비")) {
    return {
      summary:
          "현재 문제는 매출보다 비용 구조의 비효율에서 크게 발생하고 있습니다. 피크 인력 배치와 메뉴 원가 점검을 동시에 진행하시면 수익성이 안정됩니다.",
      actions: [
        "시간대별 인력 투입표를 재정리해 불필요한 공백/과투입 시간을 줄이세요.",
        "판매량 대비 원가율이 높은 메뉴를 우선 점검해 마진 구조를 개선하세요.",
      ],
      detailed:
          "비용 관리 이슈가 있는 경우에는 매출 확대보다 누수 구간을 먼저 줄이는 전략이 안전합니다. 특히 인건비와 원가가 동시에 흔들릴 때는 운영 안정성이 빠르게 낮아질 수 있습니다. 근무표와 발주 주기를 함께 설계하시면 효과가 큽니다. 월간 손익표에서 상위 판매 메뉴의 마진율을 우선 분석해 작은 조정부터 진행해 보세요.",
    };
  }

  return {
    summary:
        "운영 데이터상 매출과 고객 유지의 균형이 다소 약한 구간이 있습니다. 핵심 지표를 좁혀 관리하시면 안정적인 성장 패턴으로 전환할 수 있습니다.",
    actions: [
      "주간 단위로 신규/재방문/리뷰 지표를 한 화면에서 관리하세요.",
      "상위 성과 메뉴 중심으로 프로모션을 재구성해 집중도를 높이세요.",
    ],
    detailed:
        "실행 우선순위를 명확히 정하는 것이 중요합니다. 먼저 매출, 재방문, 평판 세 축 중 가장 낮은 항목부터 개선해 보세요. 실행 과제는 많기보다 지속 가능한 루틴으로 설계될 때 성과가 납니다.",
  };
}

function getCategorySolutions(label: string, score: number): string[] {
  const low = score < 65;
  const mid = score >= 65 && score < 80;

  if (label === "매출 성과") {
    if (low)
      return [
        "주간 매출/객단가/방문수 3지표를 고정 추적하세요.",
        "저성과 시간대 한정 프로모션을 운영하세요.",
        "상위 메뉴 집중 판매 전략으로 회전율을 높이세요.",
      ];
    if (mid)
      return [
        "요일별 피크 패턴에 맞춘 운영표를 재조정하세요.",
        "고객군별 메뉴 묶음 구성으로 객단가를 높이세요.",
        "재구매 유도 쿠폰을 월 1회 테스트하세요.",
      ];
    return [
      "현재 성과 지표를 유지하면서 변동성만 관리하세요.",
      "고마진 메뉴의 노출 비중을 더 높이세요.",
      "월별 목표를 상향하되 비용률도 함께 점검하세요.",
    ];
  }

  if (label === "마케팅 역량") {
    if (low)
      return [
        "콘텐츠 발행 요일과 형식을 고정해 운영 루틴을 만드세요.",
        "리뷰 응답 SLA를 정해 24시간 내 대응하세요.",
        "광고는 피크 시간대에만 집중 집행하세요.",
      ];
    if (mid)
      return [
        "채널별 역할을 분리해 메시지를 단순화하세요.",
        "월별 성과 지표(도달/전환)를 분리 관리하세요.",
        "SNS와 매장 이벤트를 연동해 방문 전환을 높이세요.",
      ];
    return [
      "성과 높은 채널에 예산을 집중하세요.",
      "재방문 고객 대상 CRM 캠페인을 강화하세요.",
      "콘텐츠 템플릿 표준화로 실행 속도를 높이세요.",
    ];
  }

  if (label === "단골 확보") {
    return [
      "재방문 주기에 맞춘 혜택 간격을 설계하세요.",
      "포인트/스탬프 정책을 단순하게 유지하세요.",
      "단골 고객 전용 공지 채널을 운영하세요.",
    ];
  }

  if (label === "평판 관리") {
    return [
      "부정 리뷰는 원인/조치/재방문 제안 순서로 답변하세요.",
      "긍정 리뷰에도 감사 응답으로 신뢰를 쌓으세요.",
      "자주 지적되는 불편 요소를 주간 단위로 개선하세요.",
    ];
  }

  if (label === "가격 경쟁력") {
    return [
      "핵심 메뉴의 가격-가치 메시지를 선명하게 하세요.",
      "객단가 구간별 세트 구성을 추가하세요.",
      "저마진 메뉴 비중을 단계적으로 줄이세요.",
    ];
  }

  return [
    "피크 타임 인력 배치를 우선 재설계하세요.",
    "오픈/마감 체크리스트로 누락을 줄이세요.",
    "반복 업무를 표준화해 운영 편차를 낮추세요.",
  ];
}

function getCategorySupportItems(
    label: string,
    region: string,
    bizType: string,
): SupportItem[] {
  if (label === "마케팅 역량") {
    return [
      {
        id: 1,
        title: `${region} 소상공인 디지털 마케팅 지원`,
        org: "중소벤처기업부",
        status: "접수중",
        amount: "최대 500만원",
      },
      {
        id: 2,
        title: "온라인 판로/홍보 역량강화 프로그램",
        org: "소상공인시장진흥공단",
        status: "접수중",
        amount: "무료 컨설팅",
      },
      {
        id: 3,
        title: `${bizType} 업종 맞춤 프로모션 바우처`,
        org: "지자체 연계",
        status: "접수예정",
        amount: "상세페이지 참조",
      },
    ];
  }

  if (label === "운영 효율") {
    return [
      {
        id: 1,
        title: "스마트 상점 운영 고도화 사업",
        org: "중소벤처기업부",
        status: "접수중",
        amount: "최대 800만원",
      },
      {
        id: 2,
        title: "소상공인 생산성 향상 컨설팅",
        org: "소상공인시장진흥공단",
        status: "접수중",
        amount: "무료 진단",
      },
      {
        id: 3,
        title: "매장 운영 자동화 솔루션 지원",
        org: "민관협력",
        status: "상시",
        amount: "서비스별 상이",
      },
    ];
  }

  return [
    {
      id: 1,
      title: `${region} 소상공인 경영 안정 지원사업`,
      org: "중소벤처기업부",
      status: "접수중",
      amount: "최대 500만원",
    },
    {
      id: 2,
      title: "소상공인 역량강화 프로그램",
      org: "소상공인시장진흥공단",
      status: "접수중",
      amount: "무료 컨설팅",
    },
    {
      id: 3,
      title: `${bizType} 업종 맞춤 경영개선 바우처`,
      org: "지자체 연계",
      status: "접수예정",
      amount: "상세페이지 참조",
    },
  ];
}

function getCategoryAverageScore(label: string): number {
  const avgMap: Record<string, number> = {
    "매출 성과": 68,
    "마케팅 역량": 64,
    "단골 확보": 66,
    "평판 관리": 69,
    "가격 경쟁력": 67,
    "운영 효율": 65,
  };

  return avgMap[label] ?? 66;
}

function getCategoryOneLiner(
    label: string,
    value: number,
    avgScore: number,
): string {
  const gap = value - avgScore;
  const trend =
      gap >= 0
          ? `평균보다 ${gap}점 높아요`
          : `평균보다 ${Math.abs(gap)}점 낮아요`;

  if (label === "매출 성과") {
    return gap >= 0
        ? `매출 흐름은 좋은 편입니다. 지금처럼 핵심 시간대 운영을 유지하면 더 안정적으로 성장할 수 있어요. (${trend})`
        : `매출은 개선 여지가 큽니다. 피크 시간대 집중 운영과 대표 메뉴 강화부터 시작하면 좋겠습니다. (${trend})`;
  }

  if (label === "마케팅 역량") {
    return gap >= 0
        ? `마케팅 감각이 좋은 편이에요. 채널별 메시지 일관성만 유지하면 성과를 더 키울 수 있습니다. (${trend})`
        : `마케팅은 지금이 전환점입니다. 주간 콘텐츠 루틴만 먼저 잡아도 체감 성과가 달라질 거예요. (${trend})`;
  }

  if (label === "단골 확보") {
    return gap >= 0
        ? `단골 기반이 잘 쌓이고 있습니다. 현재 혜택 구조를 유지하면서 재방문 주기를 더 짧게 가져가 보세요. (${trend})`
        : `단골 전환이 조금 약합니다. 재방문 혜택과 안내 문구를 단순하게 바꾸는 것부터 추천드립니다. (${trend})`;
  }

  if (label === "평판 관리") {
    return gap >= 0
        ? `고객 평판 관리가 탄탄합니다. 지금처럼 빠른 리뷰 대응을 유지하면 신뢰가 더 쌓입니다. (${trend})`
        : `리뷰 대응 속도만 올려도 평판은 빠르게 개선됩니다. 우선 답변 원칙부터 정리해 보세요. (${trend})`;
  }

  if (label === "가격 경쟁력") {
    return gap >= 0
        ? `가격 전략이 시장과 잘 맞고 있습니다. 구성 상품만 조금 다듬으면 객단가를 더 높일 수 있어요. (${trend})`
        : `가격 경쟁력은 재정비가 필요합니다. 고마진 중심으로 메뉴 구조를 재배치하면 효과가 큽니다. (${trend})`;
  }

  return gap >= 0
      ? `운영 효율이 안정적입니다. 현재 표준 운영 방식을 유지하면 피크 타임 대응력이 더 좋아질 거예요. (${trend})`
      : `운영 효율은 개선 여지가 있습니다. 체크리스트와 인력 배치 최적화부터 시작해 보세요. (${trend})`;
}

function getAnswerText(
    answers: Record<string, string | string[]>,
    key: string,
    fallback = "미입력",
) {
  const value = answers[key];
  if (Array.isArray(value)) return value.join(", ") || fallback;
  return value || fallback;
}

function getCategoryQa(
    label: string,
    answers: Record<string, string | string[]>,
): QaItem[] {
  if (label === "매출 성과") {
    return [
      {
        question: "현재 월 평균 매출 규모는 어느 정도인가요?",
        answer: getAnswerText(answers, "revenue"),
      },
      {
        question: "매출이 최근 3개월간 어떤 추세인가요?",
        answer: getAnswerText(answers, "revenueTrend"),
      },
      {
        question: "매출은 주로 어디서 발생하나요?",
        answer: getAnswerText(answers, "sales"),
      },
    ];
  }

  if (label === "마케팅 역량") {
    return [
      {
        question: "마케팅은 어떻게 하고 계신가요?",
        answer: getAnswerText(answers, "marketing"),
      },
      {
        question: "가장 큰 경영 고민은 무엇인가요?",
        answer: getAnswerText(answers, "challenge"),
      },
    ];
  }

  if (label === "단골 확보") {
    return [
      {
        question: "재방문 고객 비율은 어느 정도인가요?",
        answer: getAnswerText(answers, "repeat"),
      },
      {
        question: "고객의 재방문 주기는 어떤가요?",
        answer: getAnswerText(answers, "repeatCycle"),
      },
      {
        question: "고객층은 어떻게 되나요?",
        answer: getAnswerText(answers, "customerPool"),
      },
    ];
  }

  if (label === "평판 관리") {
    return [
      {
        question: "리뷰 관리는 하고 있나요?",
        answer: getAnswerText(answers, "reviewControl"),
      },
      {
        question: "가장 큰 경영 고민은 무엇인가요?",
        answer: getAnswerText(answers, "challenge"),
      },
    ];
  }

  if (label === "가격 경쟁력") {
    return [
      {
        question: "객단가는 어느 정도인가요?",
        answer: getAnswerText(answers, "menuPrice"),
      },
      {
        question: "고객층은 어떻게 되나요?",
        answer: getAnswerText(answers, "customerPool"),
      },
    ];
  }

  return [
    {
      question: "근무 인원은 몇 명인가요?",
      answer: getAnswerText(answers, "workers"),
    },
    {
      question: "좌석 수는 몇 개인가요?",
      answer: getAnswerText(answers, "seats"),
    },
    {
      question: "피크 시간 대응이 가능한가요?",
      answer: getAnswerText(answers, "peakTimeWork"),
    },
    {
      question: "매출이 가장 많이 발생하는 시간대는 언제인가요?",
      answer: getAnswerText(answers, "peak"),
    },
  ];
}

function toText(
    value: string | string[] | undefined,
    fallback = "미입력",
): string {
  if (!value) return fallback;
  if (Array.isArray(value)) return value.join(", ") || fallback;
  return value;
}

function getVisitorPersona(customerPool: string, repeat: string): string {
  const cp = customerPool || "";
  const rp = repeat || "";

  if (cp.includes("직장") || cp.includes("20") || cp.includes("30")) {
    return "점심/퇴근 시간대 20~30대 직장인이 많이 오는 가게입니다.";
  }
  if (
      cp.includes("가족") ||
      cp.includes("주부") ||
      cp.includes("40") ||
      cp.includes("50")
  ) {
    return "가족 단위와 40~50대 생활권 고객이 많이 오는 가게입니다.";
  }
  if (cp.includes("학생") || cp.includes("10") || cp.includes("20")) {
    return "학생과 20대 초반 고객 유입이 많은 가게입니다.";
  }
  if (rp.includes("주 1") || rp.includes("자주")) {
    return "근거리 고정 고객의 재방문이 많은 동네형 가게입니다.";
  }
  return "생활권 내 다양한 연령대가 고르게 방문하는 혼합형 가게입니다.";
}

type MarketItem = {
  name: string;
  price: string;
  trend: string;
};

function getRelevantMarketItems(bizType: string): MarketItem[] {
  const normalized = bizType || "";

  if (normalized.includes("카페") || normalized.includes("음료")) {
    return [
      {
        name: "원두(블렌드)",
        price: "kg당 24,500원",
        trend: "전주 대비 -3.2%",
      },
      { name: "우유(대용량)", price: "L당 2,180원", trend: "전주 대비 -1.1%" },
      {
        name: "설탕/시럽 원재료",
        price: "kg당 1,960원",
        trend: "전주 대비 +0.4%",
      },
    ];
  }

  if (
      normalized.includes("분식") ||
      normalized.includes("한식") ||
      normalized.includes("식당")
  ) {
    return [
      {
        name: "쌀(업소용)",
        price: "20kg당 56,000원",
        trend: "전주 대비 -2.4%",
      },
      { name: "식용유", price: "18L당 52,500원", trend: "전주 대비 -1.8%" },
      {
        name: "돼지고기(앞다리)",
        price: "kg당 10,900원",
        trend: "전주 대비 +1.2%",
      },
    ];
  }

  return [
    { name: "계란(특란)", price: "30구당 7,200원", trend: "전주 대비 -2.1%" },
    { name: "양파", price: "kg당 1,350원", trend: "전주 대비 -4.0%" },
    { name: "밀가루", price: "20kg당 26,800원", trend: "전주 대비 +0.7%" },
  ];
}

function getCategoryInsight(
    label: string,
    answers: Record<string, string | string[]>,
    bizType: string,
) {
  if (label === "매출 성과") {
    return {
      title: "요즘의 위험요소",
      desc: "최근 확인된 실제 이슈와 곧 반영될 일정입니다.",
      bullets: [
        "주요 원재료(유제품/가공식품) 단가가 최근 2주 연속 상승해 원가 부담이 커졌습니다.",
        "인근 상권에 동종 프랜차이즈 매장이 다음 달 신규 개업 예정으로 확인되었습니다.",
        "배달 앱 동일 권역 내 할인 경쟁이 이번 주부터 확대되어 주문당 마진이 줄어드는 구간입니다.",
      ],
      ctaLabel: "",
      ctaPath: "",
    };
  }

  if (label === "마케팅 역량") {
    return {
      title: "마케팅 개선 포인트",
      desc: "지금 상태에서 성과를 끌어올리기 위한 핵심 포인트입니다.",
      bullets: [
        "채널별 목적을 분리해 메시지 일관성 확보",
        "리뷰/콘텐츠 운영 주기 고정",
        "광고는 전환 시간대 집중 집행",
      ],
      ctaLabel: "마케팅 도구 보러가기",
      ctaPath: "/tools",
    };
  }

  if (label === "단골 확보") {
    const customerPool = toText(
        answers.customerPool as string | string[] | undefined,
        "",
    );
    const repeat = toText(answers.repeat as string | string[] | undefined, "");
    const persona = getVisitorPersona(customerPool, repeat);

    return {
      title: "가게 성향 분석",
      desc: "질문 응답을 바탕으로 방문 고객 성향을 자연어로 정리했습니다.",
      bullets: [
        persona,
        "재방문 빈도가 높은 시간대에 맞춘 단골 혜택을 배치하면 전환이 빨라집니다.",
        "단골 고객군(연령/방문목적) 기준으로 안내 문구를 분리하면 반응률이 높아집니다.",
      ],
      ctaLabel: "커뮤니티 사례 보기",
      ctaPath: "/community",
    };
  }

  if (label === "평판 관리") {
    return {
      title: "주의해야 할 포인트",
      desc: "평판 관리에서 자주 놓치는 항목을 먼저 잡으세요.",
      bullets: [
        "부정 리뷰 초동 대응 지연",
        "같은 불편 리뷰 반복 노출",
        "긍정 리뷰 무응답으로 신뢰 기회 손실",
      ],
      ctaLabel: "응대 가이드 확인",
      ctaPath: "/community",
    };
  }

  if (label === "가격 경쟁력") {
    const marketItems = getRelevantMarketItems(bizType);
    return {
      title: "요즘 저렴한 품목",
      desc: "사장님 업종과 가장 관련 있는 품목 3개를 사이트 데이터 기준으로 추렸습니다.",
      bullets: marketItems.map(
          (item) => `${item.name} · ${item.price} (${item.trend})`,
      ),
      ctaLabel: "시세 사이트 바로가기",
      ctaPath: "/market-price",
    };
  }

  return {
    title: "추천 정책",
    desc: "운영 효율 향상을 위해 적용 가능한 정책입니다.",
    bullets: [
      "피크 시간대 인력 탄력 배치",
      "오픈/마감 체크리스트 표준화",
      "주간 운영 회고(30분) 정례화",
    ],
    ctaLabel: "지원사업 보러가기",
    ctaPath: "/support",
  };
}

export function ExistingResultReport({
                                       answers,
                                       onReset,
                                     }: {
  answers: Record<string, string | string[]>;
  onReset: () => void;
}) {
  const navigate = useNavigate();

  const [stage, setStage] = useState(0);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    type: "summary",
    title: "",
    text: "",
  });
  const [isAiLoading, setIsAiLoading] = useState(true);

  const bizType = (answers.bizType as string) || "카페/음료";
  const region = (answers.region as string) || "서울 마포구/용산구";
  const challenge = (answers.challenge as string) || "매출 정체";

  const revenue = (answers.revenue as string) || "500만~1,000만 원";
  const revenueScore = revenue.includes("2,000")
      ? 95
      : revenue.includes("1,000")
          ? 80
          : 60;
  const marketingScore = challenge.includes("마케팅") ? 85 : 65;
  const loyaltyScore = challenge.includes("마케팅") ? 60 : 72;
  const reviewScore = 70;
  const competitivenessScore = 76;
  const operationEfficiencyScore = 74;

  const operationScore = Math.round(
      (revenueScore +
          marketingScore +
          loyaltyScore +
          reviewScore +
          competitivenessScore +
          operationEfficiencyScore) /
      6,
  );

  const detailStats: ScoreItem[] = [
    {
      label: "매출 성과",
      value: revenueScore,
      desc: "매출 추세 및 성장 모멘텀",
    },
    { label: "마케팅", value: marketingScore, desc: "홍보 및 유입 확보 역량" },
    { label: "단골 확보", value: loyaltyScore, desc: "재방문 고객 유지 수준" },
    { label: "평판 관리", value: reviewScore, desc: "리뷰 및 고객 평판 대응" },
    {
      label: "가격 경쟁력",
      value: competitivenessScore,
      desc: "가격대와 고객층 적합도",
    },
    {
      label: "운영 효율",
      value: operationEfficiencyScore,
      desc: "피크 타임 운영 대응",
    },
  ];

  const CATEGORY_STAGE_COUNT = detailStats.length;
  const TOTAL_STAGES = 1 + CATEGORY_STAGE_COUNT + 2;

  const topStrengthItems = [...detailStats]
      .sort((a, b) => b.value - a.value)
      .slice(0, 2)
      .map((s) => ({ label: s.label, value: s.value }));

  // 가장 점수가 낮은 항목을 약점(단점)으로 추출합니다.
  const topWeaknessItem = [...detailStats]
      .sort((a, b) => a.value - b.value)
      .slice(0, 1)
      .map((s) => ({ label: s.label, value: s.value }))[0];

  const storeSize =
      operationScore >= 80
          ? "대규모"
          : operationScore >= 65
              ? "중규모"
              : "소규모";

  const aiData = useMemo(
      () => buildAiData(challenge, storeSize, operationScore),
      [challenge, storeSize, operationScore],
  );

  const categoryPages = useMemo(
      () =>
          detailStats.map((stat) => ({
            ...stat,
            avgScore: getCategoryAverageScore(stat.label),
            oneLiner: getCategoryOneLiner(
                stat.label,
                stat.value,
                getCategoryAverageScore(stat.label),
            ),
            qaItems: getCategoryQa(stat.label, answers),
            solutions: getCategorySolutions(stat.label, stat.value),
            supports: getCategorySupportItems(stat.label, region, bizType),
          })),
      [detailStats, region, bizType, answers],
  );

  const currentInsight = useMemo(
      () =>
          getCategoryInsight(
              categoryPages[Math.max(0, stage - 1)]?.label ?? "",
              answers,
              bizType,
          ),
      [categoryPages, stage, answers, bizType],
  );
  const isSalesRiskStage =
      stage >= 1 && stage <= 6 && categoryPages[stage - 1].label === "매출 성과";

  useEffect(() => {
    setStage(0);
  }, [answers]);

  useEffect(() => {
    setIsAiLoading(true);
    const timer = setTimeout(() => setIsAiLoading(false), 900);
    return () => clearTimeout(timer);
  }, [stage, aiData]);

  const movePrev = () => setStage((prev) => Math.max(0, prev - 1));
  const moveNext = () =>
      setStage((prev) => Math.min(TOTAL_STAGES - 1, prev + 1));

  return (
      <div
          className="min-h-screen pt-10 pb-20 px-4 sm:px-6 text-white"
          style={{
            background: "linear-gradient(to bottom, #141720 0%, #09090b 100%)",
          }}
      >
        <div className="max-w-[1100px] mx-auto">
          {/* 스케치에 맞춘 상단 헤더 레이아웃 (좌우 분할) */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
              <div>
                <div className="text-emerald-400 text-xs font-bold tracking-[0.2em] mb-2">
                  RESULT FLOW
                </div>
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    사장님 맞춤 분석 리포트
                  </h1>
                  <button
                      onClick={onReset}
                      className="px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 text-xs font-medium hover:border-emerald-400 hover:text-emerald-400 transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" /> 재분석
                  </button>
                </div>
              </div>

              {/* 우측의 단계 표시 */}
              <div className="text-xl sm:text-2xl font-bold text-zinc-500 pb-1">
                <span className="text-emerald-400">{stage + 1}</span> /{" "}
                {TOTAL_STAGES} 단계
              </div>
            </div>

            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all"
                  style={{ width: `${((stage + 1) / TOTAL_STAGES) * 100}%` }}
              />
            </div>
          </div>

          {/* 1/6단계 (종합 랭크) 화면 */}
          {stage === 0 && (
              <StageFrame showNext onNext={moveNext}>
                <div className="relative flex items-center justify-center">
                  <div className="w-full bg-gradient-to-br from-[#121214] to-emerald-400/20 border border-[#27272a] rounded-[24px] p-8 sm:p-10 flex flex-col min-h-[500px] relative overflow-hidden shadow-2xl">
                    <div className="flex-1 flex flex-col lg:flex-row justify-between items-center gap-10">
                      {/* 왼쪽 패널 */}
                      <div className="w-full lg:w-1/4 flex flex-col self-start mt-4 z-10">
                        <div className="text-xs text-emerald-400 font-bold mb-2">
                          카테고리 AI 솔루션
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">
                          종합 랭크
                        </h2>
                        <div className="text-sm font-bold text-zinc-400 mb-8">
                          현재 매장 규모:{" "}
                          <span className="text-white">{storeSize}</span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2">
                          소상공인 역량
                        </h3>
                        <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                          첫 화면에서는 핵심 역량 점수만
                          <br />
                          먼저 보여드립니다.
                        </p>

                        <div className="flex flex-col gap-4">
                          {detailStats.map((stat) => (
                              <div
                                  key={stat.label}
                                  className="flex items-center gap-3"
                              >
                          <span className="text-[13px] font-bold text-zinc-400 w-20 shrink-0">
                            {stat.label}
                          </span>
                                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                  <div
                                      className="h-full bg-zinc-600"
                                      style={{ width: `${stat.value}%` }}
                                  />
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>

                      {/* 중앙 패널 */}
                      <div className="w-full lg:w-2/4 flex justify-center z-10">
                        <HugeGradeGauge
                            score={operationScore}
                            topStrengths={topStrengthItems}
                            topWeakness={topWeaknessItem}
                        />
                      </div>

                      {/* 오른쪽 패널 */}
                      <div className="w-full lg:w-1/4 flex flex-col self-start mt-4 pr-4 lg:pr-10 z-10">
                        <h3 className="text-lg font-bold text-white mb-6 text-center lg:text-left">
                          소상공인 등급 가이드
                        </h3>
                        <div className="flex flex-col gap-3">
                          {[
                            {
                              g: "S",
                              color: "text-purple-400",
                              desc: "90점 이상 최우수",
                            },
                            {
                              g: "A",
                              color: "text-emerald-400",
                              desc: "80점 이상 우수",
                            },
                            {
                              g: "B",
                              color: "text-sky-400",
                              desc: "70점 이상 양호",
                            },
                            {
                              g: "C",
                              color: "text-zinc-400",
                              desc: "70점 미만 보통",
                            },
                          ].map((item) => (
                              <div
                                  key={item.g}
                                  className="flex items-center gap-4 bg-[#18181b] px-5 py-4 rounded-2xl border border-white/5"
                              >
                          <span
                              className={`text-2xl font-black w-6 text-center ${item.color}`}
                          >
                            {item.g}
                          </span>
                                <div className="flex-1 flex flex-col gap-2">
                                  <div className="text-[11px] font-bold text-zinc-400">
                                    {item.desc}
                                  </div>
                                  <div className="flex gap-1">
                                    <div className="h-1.5 w-full bg-white/10 rounded-full"></div>
                                    <div className="h-1.5 w-1/2 bg-white/5 rounded-full"></div>
                                  </div>
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 flex justify-center w-full z-10">
                      <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-8 py-3 text-sm font-bold text-emerald-200">
                        다음 단계에서 카테고리별 AI 솔루션을 6페이지로 나누어
                        보여드립니다.
                      </div>
                    </div>
                  </div>
                </div>
              </StageFrame>
          )}

          {/* 통합된 메인 컨텐츠 영역 */}
          {stage > 0 && stage <= CATEGORY_STAGE_COUNT && (
              <StageFrame showPrev showNext onPrev={movePrev} onNext={moveNext}>
                <div className="relative flex items-center justify-center">
                  <div className="w-full space-y-6">
                    <div className="bg-gradient-to-br from-[#121214] to-emerald-400/20 border border-[#27272a] rounded-[24px] p-6 lg:p-10 shadow-2xl">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
                        <div className="flex flex-col">
                          <h2 className="text-3xl font-extrabold mb-3 text-white">
                            {categoryPages[stage - 1].label}
                          </h2>
                          <div className="mb-6 text-zinc-400 text-sm flex items-center gap-2">
                        <span className="text-2xl font-black text-white">
                          {categoryPages[stage - 1].value}점
                        </span>
                          </div>

                          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-xs text-zinc-300 mb-1.5">
                                <span>내 점수</span>
                                <span className="text-emerald-400 font-bold">
                              {categoryPages[stage - 1].value}점
                            </span>
                              </div>
                              <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-emerald-400"
                                    style={{
                                      width: `${categoryPages[stage - 1].value}%`,
                                    }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between text-xs text-zinc-300 mb-1.5">
                                <span>다른 사장님 평균</span>
                                <span className="text-zinc-200 font-bold">
                              {categoryPages[stage - 1].avgScore}점
                            </span>
                              </div>
                              <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-sky-400"
                                    style={{
                                      width: `${categoryPages[stage - 1].avgScore}%`,
                                    }}
                                />
                              </div>
                            </div>

                            <div
                                className={`text-sm mt-4 font-bold ${categoryPages[stage - 1].value >= categoryPages[stage - 1].avgScore ? "text-emerald-400" : "text-amber-400"}`}
                            >
                              {categoryPages[stage - 1].value >=
                              categoryPages[stage - 1].avgScore
                                  ? `평균보다 +${categoryPages[stage - 1].value - categoryPages[stage - 1].avgScore}점 높아요`
                                  : `평균보다 ${categoryPages[stage - 1].avgScore - categoryPages[stage - 1].value}점 낮아요`}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs text-zinc-400 mb-3 font-semibold">
                              분석에 반영된 질문과 응답
                            </div>
                            <QaRadarChart
                                items={categoryPages[stage - 1].qaItems}
                                setTooltip={setTooltip}
                            />

                            <div className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-4 text-sm text-emerald-100 leading-relaxed">
                          <span className="font-bold text-emerald-300">
                            AI 한줄평:
                          </span>{" "}
                              {categoryPages[stage - 1].oneLiner}
                            </div>
                          </div>
                        </div>

                        {/* 오른쪽 컬럼 (AI 추천, 솔루션) */}
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                            <div className="text-lg font-bold text-emerald-300">
                              AI의 추천
                            </div>
                          </div>

                          {/* AI 상태 요약 박스 (추후 카테고리가 세분화 되면 ai세부 분석출력예정) */}
                          <div className="mb-6 rounded-[20px] border border-[#27272a] bg-[#121214]/70 backdrop-blur-md p-6 flex flex-col gap-3 text-[15px] tracking-wide text-emerald-400/90 font-medium shadow-lg">
                            <div>현재 상황 : 매출 규모 정상</div>
                            <div>지속 가능성 : 낮음</div>
                            <div>배달비 : 적정 수준 유지</div>
                            <div>지출 상황 : 긍정적</div>
                          </div>

                          <p className="text-sm text-zinc-300 leading-relaxed mb-5">
                            입력하신 응답을 바탕으로{" "}
                            <span className="font-bold text-emerald-400">
                          {categoryPages[stage - 1].label}
                        </span>{" "}
                            영역에서 가장 효과가 큰 실행안을 우선순위로
                            정리했습니다.
                          </p>

                          <div className="space-y-3">
                            {categoryPages[stage - 1].solutions.map(
                                (solution, idx) => (
                                    <div
                                        key={solution}
                                        className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-4"
                                    >
                              <span className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-500/20 text-[12px] font-bold text-emerald-300">
                                {idx + 1}
                              </span>
                                      <span className="text-zinc-100 text-sm leading-relaxed font-medium">
                                {solution}
                              </span>
                                    </div>
                                ),
                            )}
                          </div>

                          <div className="mt-6 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 text-sm text-emerald-100/80 leading-relaxed">
                            <div className="font-bold text-emerald-300 mb-1">
                              {categoryPages[stage - 1].desc}
                            </div>
                            실행은 한 번에 모두 진행하기보다 1순위부터 2주 단위로
                            점검해 적용하시는 것을 권장드립니다.
                          </div>
                        </div>
                      </div>
                      {/* 하단 인사이트 카드 (위험요소 등) */}
                      <div
                          className={`mt-4 rounded-[24px] p-6 lg:p-8 shadow-lg ${
                              isSalesRiskStage
                                  ? "bg-[#1a1111] border border-red-500/40"
                                  : "bg-[#121214] border border-[#27272a]"
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div>
                            <h3
                                className={`text-lg font-bold ${isSalesRiskStage ? "text-red-400" : "text-white"}`}
                            >
                              {currentInsight.title}
                            </h3>
                            <p
                                className={`text-[13px] mt-1 ${isSalesRiskStage ? "text-red-200/80" : "text-zinc-400"}`}
                            >
                              {currentInsight.desc}
                            </p>
                          </div>
                          {currentInsight.ctaLabel && currentInsight.ctaPath && (
                              <button
                                  onClick={() => navigate(currentInsight.ctaPath)}
                                  className={`rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all ${
                                      isSalesRiskStage
                                          ? "bg-red-500 hover:bg-red-600"
                                          : "bg-emerald-500 hover:bg-emerald-600"
                                  }`}
                              >
                                {currentInsight.ctaLabel}
                              </button>
                          )}
                        </div>

                        {categoryPages[stage - 1].label === "운영 효율" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {categoryPages[stage - 1].supports
                                  .slice(0, 2)
                                  .map((item) => (
                                      <div
                                          key={`${item.id}-${item.title}`}
                                          className="rounded-xl border border-white/10 bg-white/5 p-4"
                                      >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                          <div className="text-sm font-bold text-white leading-5">
                                            {item.title}
                                          </div>
                                          <span className="text-[11px] font-bold rounded px-2 py-1 bg-amber-500/15 text-amber-400 border border-amber-400/20 whitespace-nowrap">
                                  {item.status}
                                </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-zinc-400">
                                          <span>{item.org}</span>
                                          <span className="text-emerald-400 font-bold text-sm">
                                  {item.amount}
                                </span>
                                        </div>
                                      </div>
                                  ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {currentInsight.bullets.map((item) => (
                                  <div
                                      key={item}
                                      className={`rounded-xl p-4 text-sm leading-relaxed font-medium ${
                                          isSalesRiskStage
                                              ? "border border-red-400/35 bg-red-500/10 text-red-100"
                                              : "border border-white/10 bg-white/5 text-zinc-200"
                                      }`}
                                  >
                                    {item}
                                  </div>
                              ))}
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </StageFrame>
          )}

          {stage === CATEGORY_STAGE_COUNT + 1 && (
              <StageFrame showPrev showNext onPrev={movePrev} onNext={moveNext}>
                <div className="bg-gradient-to-br from-[#121214] to-emerald-400/20 border border-[#27272a] rounded-[20px] p-6 sm:p-8">
                  <div className="text-xs text-emerald-400 font-bold mb-2">
                    AI 솔루션 요약
                  </div>
                  {isAiLoading ? (
                      <div className="h-[240px] flex flex-col items-center justify-center text-zinc-500">
                        <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse mb-3" />
                        맞춤형 요약을 정리하고 있습니다...
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                          <h3 className="font-bold text-lg mb-3">종합 진단</h3>
                          <p className="text-zinc-300 leading-7">{aiData.summary}</p>
                          <ul className="mt-4 space-y-2">
                            {aiData.actions.map((action) => (
                                <li
                                    key={action}
                                    className="flex items-start gap-2 text-sm text-zinc-200"
                                >
                                  <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                  {action}
                                </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-zinc-300 leading-7 min-h-[220px]">
                          <TypewriterText text={aiData.detailed} speed={24} />
                        </div>
                      </div>
                  )}
                </div>
              </StageFrame>
          )}

          {stage === CATEGORY_STAGE_COUNT + 2 && (
              <StageFrame showPrev onPrev={movePrev}>
                <div className="bg-[#121214] border border-[#27272a] rounded-[20px] p-6 sm:p-8">
                  <div className="text-xs text-emerald-400 font-bold mb-2">
                    다른 기능도 이용해보세요
                  </div>
                  <h2 className="text-2xl font-bold mb-6">
                    사장님을 위한 추가 서비스
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        title: "사장님 커뮤니티",
                        desc: "운영 노하우와 실제 사례를 확인하세요.",
                        path: "/community",
                        btn: "커뮤니티 이동",
                      },
                      {
                        title: "시장 시세 확인",
                        desc: "식자재 및 주요 품목 시세를 살펴보세요.",
                        path: "/market-price",
                        btn: "시세 보기",
                      },
                      {
                        title: "서비스 도구",
                        desc: "운영 효율을 높이는 도구를 활용하세요.",
                        path: "/tools",
                        btn: "도구 열기",
                      },
                      {
                        title: "지원사업 모음",
                        desc: "지금 신청 가능한 사업을 한번에 확인하세요.",
                        path: "/support",
                        btn: "사업 보기",
                      },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col"
                        >
                          <div className="font-bold mb-2">{item.title}</div>
                          <div className="text-zinc-400 text-sm leading-6 flex-1">
                            {item.desc}
                          </div>
                          <button
                              onClick={() => navigate(item.path)}
                              className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all"
                          >
                            {item.btn}
                          </button>
                        </div>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => navigate("/")}
                        className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
                    >
                      <Store className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400" />
                      <span className="text-zinc-300 group-hover:text-emerald-400 font-semibold">
                    메인 화면으로 돌아가기
                  </span>
                    </button>
                  </div>
                </div>
              </StageFrame>
          )}
        </div>

        {tooltip.visible && (
            <div
                className="fixed z-[100] pointer-events-none"
                style={{
                  left: tooltip.x + 14,
                  top: tooltip.y + 14,
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  color: "white",
                  fontSize: "0.85rem",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                  whiteSpace: "nowrap",
                }}
            >
              {tooltip.type === "summary" ? (
                  <>
                    <span className="text-emerald-400 font-semibold mr-2">요약</span>
                    <span className="text-zinc-300">{tooltip.text}</span>
                  </>
              ) : (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-400">{tooltip.title}</span>
                    <span className="text-sm font-bold text-emerald-400">
                {tooltip.text}
              </span>
                  </div>
              )}
            </div>
        )}
      </div>
  );
}

/**
 * AI 분석 결과 타입 정의.
 * 실제 OpenAI 호출은 Spring 백엔드(LlmSynthesisNode)에서 처리.
 * 프론트는 POST /api/analysis/new 의 응답 report 필드를 이 타입으로 파싱한다.
 */
export interface AiAnalysisResult {
  fundingComparison: {
    method: string;
    amount: string;
    pros: string[];
    cons: string[];
    recommended: boolean;
    suitability: string;
  }[];
  sbizAnalysis: {
    summary: string;
    storeBreakdown: {
      category: string;
      count: number;
      competition: "높음" | "중간" | "낮음";
    }[];
    competitionLevel: string;
    overallScore: number;
    locationRecommendations: {
      rank: number;
      area: string;
      reason: string;
      score: number;
      pros: string[];
      cons: string[];
    }[];
  };
  riskFactors: {
    category: string;
    level: "높음" | "중간" | "낮음";
    description: string;
    mitigation: string;
  }[];
  actionPlan: {
    period: string;
    focus: string;
    tasks: string[];
  }[];
  profitability: {
    bizType: string;
    monthlyProfit: string;
    profitValue: number;
    isTarget: boolean;
    aiTip: string;
  }[];
  budgetBreakdown: {
    label: string;
    amount: string;
    note: string;
  }[];
  rentEstimation: {
    basis: string;
    estimatedDeposit: string;
    estimatedMonthlyRent: string;
    bySize: {
      size: string;
      deposit: string;
      monthlyRent: string;
      note: string;
    }[];
    tips: string[];
  };
  interiorPlan: {
    style: string;
    styleDesc: string;
    estimatedCost: string;
    items: {
      category: string;
      detail: string;
      cost: string;
      priority: "필수" | "권장" | "선택";
    }[];
    aiTips: string[];
  };
  trialRunPlan: {
    phases: {
      period: string;
      name: string;
      goals: string[];
      kpis: { metric: string; target: string }[];
    }[];
    feedbackChannels: string[];
    warningSignals: string[];
  };
}

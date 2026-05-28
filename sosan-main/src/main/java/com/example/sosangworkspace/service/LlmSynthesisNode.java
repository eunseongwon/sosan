package com.example.sosangworkspace.service;

import com.example.sosangworkspace.domain.SosangState;
import lombok.extern.slf4j.Slf4j;
import org.bsc.langgraph4j.action.AsyncNodeAction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.*;
import java.util.concurrent.CompletableFuture;

/**
 * LangGraph4j 노드 2: OpenAI 호출 → 창업 분석 보고서 생성
 * ApiRetrievalNode가 수집한 시장 데이터 + 사용자 6개 답변을 프롬프트로 조합하여
 * gpt-4o-mini에 전송하고 AiAnalysisResult JSON을 반환한다.
 */
@Slf4j
@Component
public class LlmSynthesisNode implements AsyncNodeAction<SosangState> {

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://api.openai.com")
            .build();

    @Override
    public CompletableFuture<Map<String, Object>> apply(SosangState state) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String apiContext = state.apiContext().orElse("");
                Map<String, String> answers = state.answers().orElse(Collections.emptyMap());

                log.info("[LlmSynthesisNode] 보고서 생성 시작 - 업종: {}", answers.get("bizType"));

                if (openaiApiKey == null || openaiApiKey.isBlank()) {
                    log.warn("[LlmSynthesisNode] OpenAI API 키 미설정 - application-local.properties 확인 필요");
                    return Map.of("report", buildFallbackReport(answers));
                }

                String prompt = buildPrompt(answers, apiContext);
                String report = callOpenAI(prompt);

                log.info("[LlmSynthesisNode] 보고서 생성 완료");
                return Map.of("report", report);

            } catch (Exception e) {
                log.error("[LlmSynthesisNode] 오류 발생", e);
                return Map.of("error", e.getMessage());
            }
        });
    }

    @SuppressWarnings("unchecked")
    private String callOpenAI(String prompt) throws Exception {
        Map<String, Object> requestBody = Map.of(
                "model", "gpt-4o-mini",
                "messages", List.of(Map.of("role", "user", "content", prompt)),
                "temperature", 0.7,
                "response_format", Map.of("type", "json_object")
        );

        Map<String, Object> response = restClient.post()
                .uri("/v1/chat/completions")
                .header("Authorization", "Bearer " + openaiApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }

    private String buildPrompt(Map<String, String> answers, String apiContext) {
        StringBuilder lines = new StringBuilder();
        answers.entrySet().stream()
                .filter(e -> e.getValue() != null && !e.getValue().isBlank())
                .forEach(e -> lines.append("- ").append(e.getKey()).append(": ").append(e.getValue()).append("\n"));

        String apiSection = apiContext.isBlank() ? "" :
                "\n[국토교통부 상업업무용 실거래가 데이터]\n" + apiContext + "\n";

        return """
                당신은 소상공인 창업 전문 AI 컨설턴트입니다. 음식·외식업 분야를 중심으로 분석합니다.

                아래는 신생 창업자의 설문 응답입니다:
                """ + lines + apiSection + """

                위 응답을 바탕으로 다음 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요:

                {
                  "fundingComparison": [
                    {
                      "method": "자금 조달 방법명 (예: 소상공인 정책자금, 은행 대출, 자기자본, 지인 투자)",
                      "amount": "조달 가능 금액 범위",
                      "pros": ["장점 2~3가지"],
                      "cons": ["단점 1~2가지"],
                      "recommended": true,
                      "suitability": "이 창업자에게 적합한 이유 한 문장"
                    }
                  ],
                  "sbizAnalysis": {
                    "summary": "해당 상권 전체 요약 한 문장",
                    "storeBreakdown": [{ "category": "업종명", "count": 12, "competition": "높음" }],
                    "competitionLevel": "경쟁 강도 한 문장",
                    "overallScore": 75,
                    "locationRecommendations": [
                      { "rank": 1, "area": "추천 입지 유형", "reason": "추천 이유", "score": 82, "pros": ["장점"], "cons": ["단점"] }
                    ]
                  },
                  "riskFactors": [
                    { "category": "위험 카테고리", "level": "높음", "description": "위험 설명", "mitigation": "대응 방안" }
                  ],
                  "actionPlan": [
                    { "period": "1~2개월차", "focus": "핵심 목표", "tasks": ["할 일 3~4가지"] }
                  ],
                  "profitability": [
                    { "bizType": "업종명", "monthlyProfit": "약 XXX만원", "profitValue": 320, "isTarget": true, "aiTip": "수익 조언" }
                  ],
                  "budgetBreakdown": [
                    { "label": "보증금", "amount": "XXXX만원", "note": "설명" }
                  ],
                  "rentEstimation": {
                    "basis": "추정 근거 한 문장",
                    "estimatedDeposit": "3,000~6,000만원",
                    "estimatedMonthlyRent": "월 120~200만원",
                    "bySize": [
                      { "size": "15평", "deposit": "2,000~3,000만원", "monthlyRent": "80~120만원", "note": "설명" },
                      { "size": "20평", "deposit": "3,000~5,000만원", "monthlyRent": "120~180만원", "note": "설명" },
                      { "size": "30평", "deposit": "5,000~8,000만원", "monthlyRent": "180~280만원", "note": "설명" }
                    ],
                    "tips": ["임대료 협상 팁 1", "팁 2", "팁 3"]
                  },
                  "interiorPlan": {
                    "style": "인테리어 스타일명",
                    "styleDesc": "스타일 설명",
                    "estimatedCost": "총 예상 비용",
                    "items": [{ "category": "카테고리", "detail": "세부 항목", "cost": "예상 비용", "priority": "필수" }],
                    "aiTips": ["절감 팁 1", "팁 2", "팁 3"]
                  },
                  "trialRunPlan": {
                    "phases": [
                      { "period": "소프트오픈 1~2주", "name": "단계명", "goals": ["목표1"], "kpis": [{ "metric": "지표", "target": "목표치" }] }
                    ],
                    "feedbackChannels": ["채널1", "채널2"],
                    "warningSignals": ["경고 신호1", "신호2", "신호3"]
                  }
                }

                규칙:
                - fundingComparison: 3~4가지, recommended 최대 1개만 true
                - sbizAnalysis.storeBreakdown: 3~5개 업종, competition은 "높음"/"중간"/"낮음"
                - sbizAnalysis.overallScore: 50~95, locationRecommendations 3개 (rank 1~3)
                - riskFactors: 4~5개, level은 "높음"/"중간"/"낮음"
                - actionPlan: 6단계 (1~2개월차 ~ 11~12개월차)
                - profitability: 창업자 업종 포함 3개 업종, profitValue는 100~600(만원), isTarget은 창업자 업종만 true
                - budgetBreakdown: 5~6개 항목
                - rentEstimation.bySize: 반드시 15평/20평/30평 3개
                - interiorPlan.items: 6~8개
                - trialRunPlan.phases: 3단계
                """;
    }

    private String buildFallbackReport(Map<String, String> answers) {
        String bizType   = answers.getOrDefault("bizType",   "미정");
        String opType    = answers.getOrDefault("opType",    "미정");
        String areaType  = answers.getOrDefault("areaType",  "미정");
        String budget    = answers.getOrDefault("budget",    "미정");
        String storeSize = answers.getOrDefault("storeSize", "미정");
        return String.format(
                "{\"error\":\"OpenAI API 키 미설정\",\"bizType\":\"%s\",\"opType\":\"%s\"," +
                "\"areaType\":\"%s\",\"budget\":\"%s\",\"storeSize\":\"%s\"}",
                bizType, opType, areaType, budget, storeSize
        );
    }
}

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
 * LangGraph4j 노드: 현재 답변으로 추가 질문을 하면 분석 품질이 향상되는지 AI가 판단.
 * _userType 값에 따라 신생 창업자 / 기존 사장님 컨텍스트를 구분한다.
 */
@Slf4j
@Component
public class EvaluateNode implements AsyncNodeAction<SosangState> {

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://api.openai.com")
            .build();

    // 신생 창업자: 이 중 하나라도 없으면 무조건 insufficient
    private static final Set<String> NEW_REQUIRED_EXTRA = Set.of(
            "hasExperience", "experience", "targetCustomer", "fundingMethod",
            "competitionLevel", "startupPurpose", "headcount", "dailyCustomers"
    );

    // 기존 사장님: 이 중 하나라도 없으면 무조건 insufficient
    private static final Set<String> EXISTING_REQUIRED_EXTRA = Set.of(
            "revenue", "sales", "repeat", "challenge", "marketing",
            "customerPool", "monthlyRevenue"
    );

    @Override
    public CompletableFuture<Map<String, Object>> apply(SosangState state) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Map<String, String> answers = state.answers().orElse(Collections.emptyMap());
                String userType = answers.getOrDefault("_userType", "new");
                log.info("[EvaluateNode] 판단 시작 - userType: {}, 답변 수: {}", userType, answers.size());

                // 1라운드(_forceGenerate=true): 무조건 추가 질문 생성
                if ("true".equals(answers.getOrDefault("_forceGenerate", "false"))) {
                    List<String> missing = "existing".equals(userType)
                            ? List.of("월 매출 규모", "주요 매출 채널")
                            : List.of("창업 경험 여부", "목표 고객층");
                    log.info("[EvaluateNode] 1라운드 강제 질문 생성 → insufficient, 부족: {}", missing);
                    return Map.of("evaluationStatus", "insufficient", "missingInfo", missing);
                }

                // 2라운드+: 핵심 추가 정보가 하나도 없으면 insufficient
                Set<String> requiredExtra = "existing".equals(userType)
                        ? EXISTING_REQUIRED_EXTRA : NEW_REQUIRED_EXTRA;
                boolean hasAnyExtra = answers.keySet().stream()
                        .anyMatch(k -> requiredExtra.contains(k));

                if (!hasAnyExtra) {
                    List<String> missing = "existing".equals(userType)
                            ? List.of("월 매출 규모", "주요 매출 채널")
                            : List.of("창업 경험 여부", "목표 고객층");
                    log.info("[EvaluateNode] 핵심 추가 정보 없음 → insufficient, 부족: {}", missing);
                    return Map.of("evaluationStatus", "insufficient", "missingInfo", missing);
                }

                if (openaiApiKey == null || openaiApiKey.isBlank()) {
                    log.warn("[EvaluateNode] OpenAI 키 미설정 - sufficient로 진행");
                    return Map.of("evaluationStatus", "sufficient", "missingInfo", List.of());
                }

                String result = callLlmEvaluate(answers, userType);
                log.info("[EvaluateNode] 판단 결과: {}", result);
                return parseEvaluationResult(result);

            } catch (Exception e) {
                log.error("[EvaluateNode] 오류 - sufficient로 진행", e);
                return Map.of("evaluationStatus", "sufficient", "missingInfo", List.of());
            }
        });
    }

    @SuppressWarnings("unchecked")
    private String callLlmEvaluate(Map<String, String> answers, String userType) throws Exception {
        StringBuilder answerLines = new StringBuilder();
        answers.entrySet().stream()
                .filter(e -> !e.getKey().startsWith("_"))
                .forEach(e -> answerLines.append("- ").append(e.getKey()).append(": ").append(e.getValue()).append("\n"));

        String prompt = "existing".equals(userType)
                ? buildExistingOwnerPrompt(answerLines.toString())
                : buildNewStartupPrompt(answerLines.toString());

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-4o-mini",
                "messages", List.of(Map.of("role", "user", "content", prompt)),
                "temperature", 0.3,
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

    private String buildNewStartupPrompt(String answerLines) {
        return """
                당신은 소상공인 창업 전문 AI 컨설턴트입니다.
                아래는 창업을 준비 중인 사람이 제공한 답변입니다.

                [현재 수집된 답변]
                """ + answerLines + """

                추가로 1~2개의 질문을 더 하면 훨씬 더 구체적이고 도움이 되는 창업 분석을 제공할 수 있는지 판단하세요.

                [판단 기준]
                - sufficient: 현재 정보로 충분히 좋은 창업 분석이 가능하고, 추가 질문이 분석 품질을 크게 향상시키지 않을 때
                - insufficient: 아래 중 하나 이상 해당될 때
                  · 목표 고객층, 경쟁 우려 정도, 기존 경험, 특정 위치 선호 등 핵심 맥락이 빠진 경우
                  · 더 물어보면 자금/입지/마케팅 전략을 훨씬 정확하게 제시할 수 있는 경우
                  · 업종 또는 지역이 너무 광범위해 구체적인 인사이트를 주기 어려운 경우

                JSON으로만 응답하세요:
                {
                  "status": "sufficient" 또는 "insufficient",
                  "reason": "판단 이유 한 문장",
                  "missingInfo": ["더 물어보면 좋을 정보 항목명 (한국어, insufficient일 때만 1~2개)"]
                }
                """;
    }

    private String buildExistingOwnerPrompt(String answerLines) {
        return """
                당신은 소상공인 운영 최적화 전문 AI 컨설턴트입니다.
                아래는 현재 가게를 운영 중인 사장님이 제공한 답변입니다.

                [현재 수집된 답변]
                """ + answerLines + """

                추가로 1~2개의 질문을 더 하면 훨씬 더 구체적이고 실행 가능한 운영 개선 분석을 제공할 수 있는지 판단하세요.

                [판단 기준]
                - sufficient: 현재 정보로 충분히 좋은 운영 진단이 가능하고, 추가 질문이 분석 품질을 크게 향상시키지 않을 때
                - insufficient: 아래 중 하나 이상 해당될 때
                  · 매출 규모, 주요 채널, 고객층, 경쟁 상황 등 핵심 운영 지표가 빠진 경우
                  · 더 물어보면 마케팅/원가/단골 전략을 훨씬 정확하게 제시할 수 있는 경우
                  · 현재 고민(challenge)에 대한 구체적인 배경 정보가 없어 맞춤 조언이 어려운 경우

                JSON으로만 응답하세요:
                {
                  "status": "sufficient" 또는 "insufficient",
                  "reason": "판단 이유 한 문장",
                  "missingInfo": ["더 물어보면 좋을 정보 항목명 (한국어, insufficient일 때만 1~2개)"]
                }
                """;
    }

    private Map<String, Object> parseEvaluationResult(String json) {
        try {
            boolean isSufficient = json.contains("\"status\": \"sufficient\"")
                    || json.contains("\"status\":\"sufficient\"");

            List<String> missingInfo = new ArrayList<>();
            int missingStart = json.indexOf("\"missingInfo\"");
            if (missingStart >= 0) {
                int arrStart = json.indexOf("[", missingStart);
                int arrEnd   = json.indexOf("]", arrStart);
                if (arrStart >= 0 && arrEnd > arrStart) {
                    String arrContent = json.substring(arrStart + 1, arrEnd);
                    for (String item : arrContent.split(",")) {
                        String cleaned = item.trim().replace("\"", "");
                        if (!cleaned.isBlank()) missingInfo.add(cleaned);
                    }
                }
            }

            return Map.of(
                    "evaluationStatus", isSufficient ? "sufficient" : "insufficient",
                    "missingInfo", missingInfo
            );
        } catch (Exception e) {
            log.warn("[EvaluateNode] 파싱 실패 - sufficient로 처리");
            return Map.of("evaluationStatus", "sufficient", "missingInfo", List.of());
        }
    }
}

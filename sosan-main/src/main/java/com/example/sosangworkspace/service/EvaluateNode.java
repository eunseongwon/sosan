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
 * LangGraph4j 노드: 현재 답변으로 더 나은 분석을 위해 추가 질문이 필요한지 AI가 판단.
 *
 * 단순히 "미정" 여부가 아니라, AI 관점에서 추가 질문을 하면
 * 분석 품질이 의미있게 향상되는지를 기준으로 판단한다.
 *
 * 반환값:
 *   - evaluationStatus: "sufficient" | "insufficient"
 *   - missingInfo: 더 물어보면 좋을 정보 목록 (insufficient일 때)
 */
@Slf4j
@Component
public class EvaluateNode implements AsyncNodeAction<SosangState> {

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://api.openai.com")
            .build();

    @Override
    public CompletableFuture<Map<String, Object>> apply(SosangState state) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Map<String, String> answers = state.answers().orElse(Collections.emptyMap());
                log.info("[EvaluateNode] 분석 품질 판단 시작 - 답변 수: {}", answers.size());

                if (openaiApiKey == null || openaiApiKey.isBlank()) {
                    log.warn("[EvaluateNode] OpenAI 키 미설정 - sufficient로 진행");
                    return Map.of("evaluationStatus", "sufficient", "missingInfo", List.of());
                }

                String result = callLlmEvaluate(answers);
                log.info("[EvaluateNode] 판단 결과: {}", result);
                return parseEvaluationResult(result);

            } catch (Exception e) {
                log.error("[EvaluateNode] 오류 - sufficient로 진행", e);
                return Map.of("evaluationStatus", "sufficient", "missingInfo", List.of());
            }
        });
    }

    @SuppressWarnings("unchecked")
    private String callLlmEvaluate(Map<String, String> answers) throws Exception {
        StringBuilder answerLines = new StringBuilder();
        answers.forEach((k, v) -> answerLines.append("- ").append(k).append(": ").append(v).append("\n"));

        String prompt = """
                당신은 소상공인 창업 전문 AI 컨설턴트입니다.
                아래는 창업을 준비 중인 사람이 제공한 답변입니다.

                [현재 수집된 답변]
                """ + answerLines + """

                지금 이 정보만으로도 분석 보고서를 작성할 수 있지만,
                추가로 1~3개의 질문을 더 하면 훨씬 더 구체적이고 도움이 되는 분석을 제공할 수 있는지 판단하세요.

                [판단 기준]
                - sufficient: 현재 정보로도 충분히 좋은 분석이 가능하고, 추가 질문이 분석 품질을 크게 향상시키지 않을 때
                - insufficient: 아래 중 하나라도 해당될 때
                  · 목표 고객층, 경쟁 우려 정도, 특정 선호 위치, 기존 운영 경험 등
                    핵심 맥락 정보가 빠져서 맞춤형 조언이 어려울 때
                  · 더 물어보면 훨씬 더 정확한 자금/입지/마케팅 전략을 제시할 수 있을 때
                  · 업종이나 지역이 너무 광범위해 구체적인 인사이트를 주기 어려울 때

                단, 이미 충분히 구체적인 정보가 있다면 굳이 추가 질문하지 않아도 됩니다.

                JSON으로만 응답하세요:
                {
                  "status": "sufficient" 또는 "insufficient",
                  "reason": "판단 이유 한 문장",
                  "missingInfo": ["더 물어보면 좋을 정보 (한국어, insufficient일 때만 1~3개 항목명)"]
                }
                """;

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

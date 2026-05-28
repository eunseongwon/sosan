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
 * LangGraph4j 노드: EvaluateNode가 "insufficient"를 반환했을 때
 * 부족한 정보를 채우기 위한 추가 질문을 LLM이 생성한다.
 *
 * 반환 형식:
 * generatedQuestions: [
 *   { "key": "targetCustomer", "category": "목표 고객층",
 *     "question": "주요 고객층은?", "options": ["선택지1", ...] }
 * ]
 */
@Slf4j
@Component
public class QuestionGeneratorNode implements AsyncNodeAction<SosangState> {

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://api.openai.com")
            .build();

    // 이미 고정 질문으로 수집된 키 — 재생성 방지
    private static final Set<String> ALREADY_ASKED = Set.of(
            "bizType", "opType", "region", "areaType", "budget", "storeSize"
    );

    @Override
    public CompletableFuture<Map<String, Object>> apply(SosangState state) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Map<String, String> answers = state.answers().orElse(Collections.emptyMap());
                List<String> missingInfo = state.missingInfo().orElse(List.of());

                log.info("[QuestionGeneratorNode] 추가 질문 생성 - 부족 항목: {}", missingInfo);

                if (openaiApiKey == null || openaiApiKey.isBlank()) {
                    return Map.of("generatedQuestions", buildFallbackQuestions(missingInfo));
                }

                String questionsJson = callLlmGenerateQuestions(answers, missingInfo);
                List<Map<String, Object>> questions = parseQuestions(questionsJson);

                log.info("[QuestionGeneratorNode] {}개 질문 생성 완료", questions.size());
                return Map.of("generatedQuestions", questions);

            } catch (Exception e) {
                log.error("[QuestionGeneratorNode] 오류", e);
                return Map.of("generatedQuestions", List.of());
            }
        });
    }

    @SuppressWarnings("unchecked")
    private String callLlmGenerateQuestions(Map<String, String> answers,
                                             List<String> missingInfo) throws Exception {
        StringBuilder answerLines = new StringBuilder();
        answers.forEach((k, v) -> answerLines.append("- ").append(k).append(": ").append(v).append("\n"));

        String alreadyAsked = String.join(", ", ALREADY_ASKED);
        String missing = missingInfo.isEmpty() ? "정보가 불충분함" : String.join(", ", missingInfo);

        String prompt = """
                소상공인 창업 상담 AI입니다. 창업 분석에 필요한 추가 정보를 수집하기 위한 질문을 생성하세요.

                [현재 수집된 답변]
                """ + answerLines + """

                [부족한 정보]
                """ + missing + """

                [이미 물어본 항목 - 중복 금지]
                """ + alreadyAsked + """

                위 정보를 바탕으로 1~2개의 추가 질문을 JSON 배열로 생성하세요.
                각 질문은 다음 형식을 정확히 따르세요:

                [
                  {
                    "key": "camelCase 영문 고유 키 (예: targetCustomer, priceRange, dailyCustomers)",
                    "category": "카테고리명 (예: 목표 고객층)",
                    "question": "질문 내용? (한국어, 창업자에게 친근한 말투)",
                    "options": ["선택지1", "선택지2", "선택지3", "선택지4", "아직 미정이에요"]
                  }
                ]

                규칙:
                - key는 영문 camelCase, 다른 답변 key와 절대 중복 금지
                - 선택지는 4~5개, 마지막은 "아직 미정이에요"로 통일
                - 한국어로 작성, JSON 배열만 출력 (다른 텍스트 없이)
                - 1~2개만 생성 (너무 많으면 사용자 피로도 증가)
                """;

        // JSON 배열은 직접 반환 불가라서 객체로 감싸서 요청
        String wrappedPrompt = prompt + "\n\n반드시 {\"questions\": [...]} 형식으로 감싸서 응답하세요.";
        Map<String, Object> wrappedBody = Map.of(
                "model", "gpt-4o-mini",
                "messages", List.of(Map.of("role", "user", "content", wrappedPrompt)),
                "temperature", 0.7,
                "response_format", Map.of("type", "json_object")
        );

        Map<String, Object> response = restClient.post()
                .uri("/v1/chat/completions")
                .header("Authorization", "Bearer " + openaiApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(wrappedBody)
                .retrieve()
                .body(Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }

    private List<Map<String, Object>> parseQuestions(String json) {
        try {
            // {"questions": [...]} 형식 파싱
            int arrStart = json.indexOf("[");
            int arrEnd = json.lastIndexOf("]");
            if (arrStart < 0 || arrEnd < 0) return List.of();

            String arrJson = json.substring(arrStart, arrEnd + 1);

            // 간단한 수동 파싱 — Jackson 없이 각 객체 추출
            List<Map<String, Object>> questions = new ArrayList<>();
            int depth = 0;
            int objStart = -1;

            for (int i = 0; i < arrJson.length(); i++) {
                char c = arrJson.charAt(i);
                if (c == '{') {
                    if (depth == 0) objStart = i;
                    depth++;
                } else if (c == '}') {
                    depth--;
                    if (depth == 0 && objStart >= 0) {
                        String objJson = arrJson.substring(objStart, i + 1);
                        Map<String, Object> q = parseQuestionObject(objJson);
                        if (q != null) questions.add(q);
                        objStart = -1;
                    }
                }
            }
            return questions;
        } catch (Exception e) {
            log.warn("[QuestionGeneratorNode] 파싱 실패: {}", e.getMessage());
            return List.of();
        }
    }

    private Map<String, Object> parseQuestionObject(String json) {
        try {
            String key      = extractStringValue(json, "key");
            String category = extractStringValue(json, "category");
            String question = extractStringValue(json, "question");
            List<String> options = extractArrayValues(json, "options");

            if (key.isBlank() || question.isBlank() || options.isEmpty()) return null;

            // 이미 물어본 키면 스킵
            if (ALREADY_ASKED.contains(key)) return null;

            Map<String, Object> q = new LinkedHashMap<>();
            q.put("key", key);
            q.put("category", category);
            q.put("question", question);
            q.put("options", options);
            return q;
        } catch (Exception e) {
            return null;
        }
    }

    private String extractStringValue(String json, String fieldName) {
        String search = "\"" + fieldName + "\"";
        int idx = json.indexOf(search);
        if (idx < 0) return "";
        int colon = json.indexOf(":", idx + search.length());
        if (colon < 0) return "";
        int quoteStart = json.indexOf("\"", colon + 1);
        if (quoteStart < 0) return "";
        int quoteEnd = json.indexOf("\"", quoteStart + 1);
        if (quoteEnd < 0) return "";
        return json.substring(quoteStart + 1, quoteEnd);
    }

    private List<String> extractArrayValues(String json, String fieldName) {
        String search = "\"" + fieldName + "\"";
        int idx = json.indexOf(search);
        if (idx < 0) return List.of();
        int arrStart = json.indexOf("[", idx);
        int arrEnd = json.indexOf("]", arrStart);
        if (arrStart < 0 || arrEnd < 0) return List.of();

        String arrContent = json.substring(arrStart + 1, arrEnd);
        List<String> values = new ArrayList<>();
        int pos = 0;
        while (pos < arrContent.length()) {
            int qStart = arrContent.indexOf("\"", pos);
            if (qStart < 0) break;
            int qEnd = arrContent.indexOf("\"", qStart + 1);
            if (qEnd < 0) break;
            values.add(arrContent.substring(qStart + 1, qEnd));
            pos = qEnd + 1;
        }
        return values;
    }

    /** OpenAI 키 없을 때 미싱 정보 기반 기본 질문 생성 */
    private List<Map<String, Object>> buildFallbackQuestions(List<String> missingInfo) {
        List<Map<String, Object>> fallback = new ArrayList<>();
        for (String info : missingInfo) {
            Map<String, Object> q = new LinkedHashMap<>();
            q.put("key", toCamelCase(info));
            q.put("category", info);
            q.put("question", info + "에 대해 알려주세요.");
            q.put("options", List.of("매우 낮음", "낮음", "보통", "높음", "아직 미정이에요"));
            fallback.add(q);
        }
        return fallback;
    }

    private String toCamelCase(String korean) {
        return "extraInfo" + Math.abs(korean.hashCode() % 1000);
    }
}

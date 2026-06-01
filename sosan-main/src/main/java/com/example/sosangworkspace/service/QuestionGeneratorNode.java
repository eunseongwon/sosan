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

                // 이미 답변된 key 집합 (고정 + 이전 동적 질문 포함)
                Set<String> answeredKeys = new HashSet<>();
                answeredKeys.addAll(ALREADY_ASKED);
                answers.keySet().stream()
                        .filter(k -> !k.startsWith("_"))
                        .forEach(answeredKeys::add);

                log.info("[QuestionGeneratorNode] 추가 질문 생성 - 부족: {}, 이미 답변된 key: {}",
                        missingInfo, answeredKeys);

                if (openaiApiKey == null || openaiApiKey.isBlank()) {
                    return Map.of("generatedQuestions", buildFallbackQuestions(missingInfo));
                }

                String questionsJson = callLlmGenerateQuestions(answers, missingInfo, answeredKeys);

                // LLM 생성 후 중복 key 필터링 (LLM이 무시했을 경우 대비)
                List<Map<String, Object>> questions = parseQuestions(questionsJson).stream()
                        .filter(q -> {
                            String key = String.valueOf(q.get("key"));
                            boolean isDuplicate = answeredKeys.contains(key);
                            if (isDuplicate) log.warn("[QuestionGeneratorNode] 중복 key 제거: {}", key);
                            return !isDuplicate;
                        })
                        .toList();

                log.info("[QuestionGeneratorNode] {}개 질문 생성 완료 (중복 제거 후)", questions.size());
                return Map.of("generatedQuestions", questions);

            } catch (Exception e) {
                log.error("[QuestionGeneratorNode] 오류", e);
                return Map.of("generatedQuestions", List.of());
            }
        });
    }

    @SuppressWarnings("unchecked")
    private String callLlmGenerateQuestions(Map<String, String> answers,
                                             List<String> missingInfo,
                                             Set<String> answeredKeys) throws Exception {
        String userType = answers.getOrDefault("_userType", "new");
        StringBuilder answerLines = new StringBuilder();
        answers.entrySet().stream()
                .filter(e -> !e.getKey().startsWith("_"))
                .forEach(e -> answerLines.append("- ").append(e.getKey()).append(": ").append(e.getValue()).append("\n"));

        // 고정 질문 + 이전 동적 질문 key 모두 포함
        String alreadyAsked = String.join(", ", answeredKeys);
        String missing = missingInfo.isEmpty() ? "정보가 불충분함" : String.join(", ", missingInfo);

        String goodTopicsNew = """
                ✅ 창업 분석에 실질적으로 도움이 되는 질문 주제:
                - 목표 고객층 (연령/직업군) → 입지·마케팅 전략에 직접 영향
                - 창업 경험 여부 → 리스크 평가, 정책자금 자격 여부에 영향
                - 경쟁 인식 수준 → 상권 분석, 차별화 전략에 영향
                - 창업 목적 (생계형 vs 성장형) → 자금 조달 방식, 수익 목표 설정에 영향
                - 예상 운영 인원 → 인건비·고정비 계산에 영향
                - 초기 자금 조달 방법 (본인자금/대출/지원금) → 자금 계획에 직접 영향
                - 하루 예상 목표 고객 수 → 수익성 추정에 영향
                """;
        String goodTopicsExisting = """
                ✅ 기존 운영 분석에 실질적으로 도움이 되는 질문 주제:
                - 월 평균 매출 규모 → 수익성·성장성 진단에 직접 영향
                - 주요 매출 채널 (매장/배달/포장) → 채널 최적화 전략에 영향
                - 주요 고객층 및 재방문율 → 단골 확보 전략에 영향
                - 가장 큰 운영 고민 → 맞춤 솔루션 제시에 영향
                - 현재 마케팅 방법 → 홍보 효율 개선에 영향
                - 인건비·임대료 부담 수준 → 비용 구조 개선에 영향
                """;
        String badTopics = """
                ❌ 분석 품질을 높이지 않는 질문 (절대 생성 금지):
                - 선호하는 메뉴, 인테리어 스타일, 브랜드 이미지 등 개인 취향
                - 구체적인 메뉴명이나 식재료 관련 질문
                - SNS 계정 보유 여부 등 즉시 확인 불가한 정보
                - 이미 답변된 내용을 다른 방식으로 다시 묻는 질문
                - 분석 결과에 영향을 미치지 않는 인구통계 정보
                """;

        String goodTopics = "existing".equals(userType) ? goodTopicsExisting : goodTopicsNew;

        String prompt = """
                소상공인 창업 상담 전문 AI입니다. 아래 기준에 따라 분석 품질을 높이는 핵심 질문만 생성하세요.

                """ + goodTopics + """

                """ + badTopics + """

                [현재 수집된 답변]
                """ + answerLines + """

                [부족한 정보]
                """ + missing + """

                [이미 물어본 항목 - 중복 금지]
                """ + alreadyAsked + """

                위 기준을 철저히 지켜 1~2개의 질문을 생성하세요.
                각 질문은 다음 형식을 정확히 따르세요:

                [
                  {
                    "key": "camelCase 영문 고유 키 (예: targetCustomer, hasExperience, fundingMethod)",
                    "category": "카테고리명 (예: 창업 경험)",
                    "question": "질문 내용? (한국어, 창업자에게 친근한 말투)",
                    "options": ["선택지1", "선택지2", "선택지3", "선택지4", "아직 미정이에요"]
                  }
                ]

                규칙:
                - key는 영문 camelCase, 이미 물어본 항목과 절대 중복 금지
                - 선택지는 4~5개, 마지막은 "아직 미정이에요"로 통일
                - 반드시 ✅ 목록에 해당하는 주제만 질문할 것
                - ❌ 목록에 해당하는 주제는 절대 질문하지 말 것
                - 1~2개만 생성
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

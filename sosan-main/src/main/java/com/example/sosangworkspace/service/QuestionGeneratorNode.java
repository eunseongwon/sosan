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
                log.info("[QuestionGeneratorNode] LLM 원시 응답 앞 300자: {}",
                        questionsJson != null ? questionsJson.substring(0, Math.min(300, questionsJson.length())) : "null");

                // LLM 생성 후 중복 key 필터링
                List<Map<String, Object>> questions = parseQuestions(questionsJson).stream()
                        .filter(q -> {
                            String key = String.valueOf(q.get("key"));
                            boolean isDuplicate = answeredKeys.contains(key);
                            if (isDuplicate) log.warn("[QuestionGeneratorNode] 중복 key 제거: {}", key);
                            return !isDuplicate;
                        })
                        .toList();

                // 파싱 실패 또는 빈 결과 → 기본 질문으로 폴백
                if (questions.isEmpty()) {
                    log.warn("[QuestionGeneratorNode] 파싱 결과 빈 배열 → 기본 질문 사용");
                    questions = defaultQuestions(answers.getOrDefault("_userType", "new"), answeredKeys);
                }

                log.info("[QuestionGeneratorNode] 최종 {}개 질문 반환", questions.size());
                Map<String, Object> result = new HashMap<>();
                result.put("generatedQuestions", questions);
                return result;

            } catch (Exception e) {
                log.error("[QuestionGeneratorNode] 오류 → 기본 질문 사용", e);
                Map<String, String> ans2 = state.answers().orElse(Collections.emptyMap());
                Map<String, Object> fallback = new HashMap<>();
                fallback.put("generatedQuestions", defaultQuestions(ans2.getOrDefault("_userType", "new"), new HashSet<>(ALREADY_ASKED)));
                return fallback;
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

        String roleGuide = "existing".equals(userType)
                ? "당신은 소상공인 운영 컨설턴트 AI입니다. 목표는 기존 매장의 매출·마케팅·운영 효율을 개선하는 실행 가능한 전략을 제시하는 것입니다."
                : "당신은 소상공인 창업 컨설턴트 AI입니다. 목표는 창업자의 자금 조달, 입지 선정, 수익성 예측, 리스크 대응 전략을 수립하는 데 필요한 비즈니스 정보를 수집하는 것입니다.";

        String businessFocus = "existing".equals(userType)
                ? "질문은 반드시 매출 규모, 매출 채널, 고객 재방문율, 마케팅 방법, 운영 비용 등 '사업 운영 지표'에 관한 것이어야 합니다."
                : "질문은 반드시 창업 경험, 목표 고객층, 자금 조달 방법, 경쟁 인식, 예상 운영 규모 등 '사업 분석에 직접 영향을 주는 비즈니스 정보'에 관한 것이어야 합니다. 메뉴 선호, 인테리어 취향 등 개인 취향은 절대 묻지 마세요.";

        String prompt = roleGuide + "\n\n"
                + businessFocus + "\n\n"
                + "[현재 수집된 사업 정보]\n" + answerLines + "\n"
                + "[부족한 비즈니스 정보]\n" + missing + "\n"
                + "[이미 질문한 항목 - 중복 금지]\n" + alreadyAsked + "\n\n"
                + "위 사업 정보를 바탕으로 컨설팅 품질 향상에 꼭 필요한 질문 1~2개를 생성하세요.\n"
                + "반드시 아래 JSON 형식으로만 응답하세요:\n"
                + "{\"questions\": [\n"
                + "  {\"key\": \"영문camelCase\", \"category\": \"카테고리명\", "
                + "\"question\": \"질문 내용?\", \"options\": [\"선택지1\",\"선택지2\",\"선택지3\",\"선택지4\",\"아직 미정이에요\"]}\n"
                + "]}\n"
                + "key는 중복 금지 목록에 없는 새 영문 camelCase, 선택지 마지막은 '아직 미정이에요'";

        Map<String, Object> wrappedBody = Map.of(
                "model", "gpt-4o-mini",
                "messages", List.of(Map.of("role", "user", "content", prompt)),
                "temperature", 0.5,
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

    /** LLM 파싱 실패 시 또는 항상 보여줄 기본 고정 질문 */
    private List<Map<String, Object>> defaultQuestions(String userType, Set<String> answeredKeys) {
        List<Map<String, Object>> all = "existing".equals(userType)
                ? defaultExistingQuestions()
                : defaultNewQuestions();
        return all.stream()
                .filter(q -> !answeredKeys.contains(String.valueOf(q.get("key"))))
                .toList();
    }

    private List<Map<String, Object>> defaultNewQuestions() {
        List<Map<String, Object>> qs = new ArrayList<>();

        Map<String, Object> q1 = new LinkedHashMap<>();
        q1.put("key", "hasExperience");
        q1.put("category", "창업 경험");
        q1.put("question", "관련 업종 경험이 있으신가요?");
        q1.put("options", List.of("경험 없음", "아르바이트 경험 있음", "유사업종 근무 경험 있음", "직접 운영해본 적 있음", "아직 미정이에요"));
        qs.add(q1);

        Map<String, Object> q2 = new LinkedHashMap<>();
        q2.put("key", "targetCustomer");
        q2.put("category", "목표 고객층");
        q2.put("question", "주요 목표 고객층은 어떻게 생각하고 계신가요?");
        q2.put("options", List.of("10~20대", "20~30대 직장인", "가족 단위", "시니어층", "아직 미정이에요"));
        qs.add(q2);

        return qs;
    }

    private List<Map<String, Object>> defaultExistingQuestions() {
        List<Map<String, Object>> qs = new ArrayList<>();

        Map<String, Object> q1 = new LinkedHashMap<>();
        q1.put("key", "monthlyRevenue");
        q1.put("category", "월 매출");
        q1.put("question", "현재 월 평균 매출 규모는 어느 정도인가요?");
        q1.put("options", List.of("500만 원 미만", "500만~1,000만 원", "1,000만~2,000만 원", "2,000만 원 이상", "아직 미정이에요"));
        qs.add(q1);

        Map<String, Object> q2 = new LinkedHashMap<>();
        q2.put("key", "mainChallenge");
        q2.put("category", "주요 고민");
        q2.put("question", "현재 가장 큰 경영 고민은 무엇인가요?");
        q2.put("options", List.of("매출 정체", "마케팅/홍보", "인건비/재료비 관리", "배달 플랫폼 수수료", "아직 미정이에요"));
        qs.add(q2);

        return qs;
    }
}

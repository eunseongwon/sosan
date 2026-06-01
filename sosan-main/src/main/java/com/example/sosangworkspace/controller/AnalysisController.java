package com.example.sosangworkspace.controller;

import com.example.sosangworkspace.domain.SosangState;
import com.example.sosangworkspace.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bsc.langgraph4j.CompiledGraph;
import org.bsc.langgraph4j.StateGraph;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

/**
 * 신생 창업자 AI 분석 API
 *
 * POST /api/analysis/evaluate  — 답변 충분성 판단 + 추가 질문 생성 (LangGraph 조건부 엣지)
 * POST /api/analysis/new       — 최종 창업 분석 보고서 생성
 * GET  /api/analysis/health    — 헬스 체크
 */
@Slf4j
@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final EvaluateNode evaluateNode;
    private final QuestionGeneratorNode questionGeneratorNode;
    private final ApiRetrievalNode apiRetrievalNode;
    private final LlmSynthesisNode llmSynthesisNode;

    // ── /evaluate ──────────────────────────────────────────────────────────────

    /**
     * 현재까지 수집된 답변이 창업 분석에 충분한지 LangGraph로 판단.
     *
     * 조건부 엣지:
     *   "sufficient"   → 바로 종료 (프론트가 /new 호출)
     *   "insufficient" → QuestionGeneratorNode → 추가 질문 반환
     *
     * Response (ready):
     *   { "status": "ready" }
     *
     * Response (needs_more):
     *   { "status": "needs_more",
     *     "questions": [ { "key", "category", "question", "options": [...] } ] }
     */
    @PostMapping("/evaluate")
    public ResponseEntity<Map<String, Object>> evaluate(
            @RequestBody Map<String, String> answers) {
        try {
            log.info("[AnalysisController] evaluate 요청 - forceGenerate: {}, 답변 수: {}",
                    answers.getOrDefault("_forceGenerate", "false"), answers.size());

            StateGraph<SosangState> workflow = new StateGraph<>(SosangState::new)
                    .addNode("evaluate", evaluateNode)
                    .addNode("generateQuestions", questionGeneratorNode)
                    .addEdge(StateGraph.START, "evaluate")
                    .addConditionalEdges(
                            "evaluate",
                            state -> CompletableFuture.completedFuture(
                                    "sufficient".equals(state.evaluationStatus().orElse("insufficient"))
                                            ? StateGraph.END
                                            : "generateQuestions"
                            ),
                            Map.of(
                                    StateGraph.END, StateGraph.END,
                                    "generateQuestions", "generateQuestions"
                            )
                    )
                    .addEdge("generateQuestions", StateGraph.END);

            CompiledGraph<SosangState> app = workflow.compile();
            Optional<SosangState> result = app.invoke(Map.of("answers", answers));

            if (result.isEmpty()) {
                return ResponseEntity.ok(Map.of("status", "ready"));
            }

            SosangState finalState = result.get();
            String status = finalState.evaluationStatus().orElse("sufficient");

            if ("sufficient".equals(status)) {
                log.info("[AnalysisController] 충분 판단 → 분석 진행");
                return ResponseEntity.ok(Map.of("status", "ready"));
            } else {
                List<Map<String, Object>> questions = finalState.generatedQuestions().orElse(List.of());
                log.info("[AnalysisController] 불충분 → 추가 질문 {}개 반환", questions.size());
                return ResponseEntity.ok(Map.of("status", "needs_more", "questions", questions));
            }

        } catch (Exception e) {
            log.error("[AnalysisController] evaluate 오류", e);
            return ResponseEntity.ok(Map.of("status", "ready"));
        }
    }

    // ── /new ───────────────────────────────────────────────────────────────────

    /**
     * 전체 답변을 바탕으로 창업 분석 보고서 생성.
     * LangGraph: ApiRetrievalNode → LlmSynthesisNode
     */
    @PostMapping("/new")
    public ResponseEntity<Map<String, Object>> analyzeNew(
            @RequestBody Map<String, String> answers) {
        try {
            log.info("[AnalysisController] 분석 요청 - 업종: {}, 지역: {}",
                    answers.get("bizType"), answers.get("region"));

            StateGraph<SosangState> workflow = new StateGraph<>(SosangState::new)
                    .addNode("apiRetrieval", apiRetrievalNode)
                    .addNode("llmSynthesis", llmSynthesisNode)
                    .addEdge(StateGraph.START, "apiRetrieval")
                    .addEdge("apiRetrieval", "llmSynthesis")
                    .addEdge("llmSynthesis", StateGraph.END);

            CompiledGraph<SosangState> app = workflow.compile();
            Optional<SosangState> result = app.invoke(Map.of("answers", answers));

            if (result.isEmpty()) {
                return ResponseEntity.internalServerError()
                        .body(Map.of("error", "분석 결과를 생성하지 못했습니다."));
            }

            SosangState finalState = result.get();
            return ResponseEntity.ok(Map.of(
                    "report",     finalState.report().orElse(""),
                    "apiContext", finalState.apiContext().orElse(""),
                    "answers",    answers
            ));

        } catch (Exception e) {
            log.error("[AnalysisController] 분석 오류", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── /health ────────────────────────────────────────────────────────────────

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}

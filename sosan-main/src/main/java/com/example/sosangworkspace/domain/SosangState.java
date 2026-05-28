package com.example.sosangworkspace.domain;

import org.bsc.langgraph4j.state.AgentState;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * LangGraph4j 그래프 전체에서 공유되는 상태 객체.
 * 각 노드는 이 상태를 읽고, Map<String, Object>를 반환해 상태를 업데이트한다.
 */
public class SosangState extends AgentState {

    public SosangState(Map<String, Object> initData) {
        super(initData);
    }

    /** 프론트에서 받은 고정 + 동적 질문 응답 전체 */
    @SuppressWarnings("unchecked")
    public Optional<Map<String, String>> answers() {
        return value("answers");
    }

    // ── EvaluateNode 결과 ──────────────────────────────────

    /** "sufficient" 또는 "insufficient" */
    public Optional<String> evaluationStatus() {
        return value("evaluationStatus");
    }

    /** 부족한 정보 목록 (insufficient일 때) */
    @SuppressWarnings("unchecked")
    public Optional<List<String>> missingInfo() {
        return value("missingInfo");
    }

    // ── QuestionGeneratorNode 결과 ─────────────────────────

    /**
     * AI가 생성한 추가 질문 목록.
     * 각 항목: { "key": "...", "category": "...", "question": "...", "options": [...] }
     */
    @SuppressWarnings("unchecked")
    public Optional<List<Map<String, Object>>> generatedQuestions() {
        return value("generatedQuestions");
    }

    // ── ApiRetrievalNode 결과 ──────────────────────────────

    /** 외부 API에서 수집한 시장 데이터 문자열 */
    public Optional<String> apiContext() {
        return value("apiContext");
    }

    // ── LlmSynthesisNode 결과 ─────────────────────────────

    /** 최종 분석 보고서 JSON 문자열 */
    public Optional<String> report() {
        return value("report");
    }

    /** 파이프라인 에러 메시지 */
    public Optional<String> error() {
        return value("error");
    }
}

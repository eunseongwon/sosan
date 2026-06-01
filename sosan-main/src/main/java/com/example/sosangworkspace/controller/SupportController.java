package com.example.sosangworkspace.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.*;

/**
 * 중소벤처24 (smes.go.kr) 정부 지원사업 공고 API 프록시.
 *
 * GET /api/support/programs  — 프론트용 정규화 응답
 * GET /api/support/debug     — 원시 API 응답 확인용 (개발 중 사용)
 */
@Slf4j
@RestController
@RequestMapping("/api/support")
public class SupportController {

    @Value("${smes.api.key:}")
    private String smesApiKey;

    private final RestClient restClient = RestClient.create();

    // ── /programs ─────────────────────────────────────────────────────────────

    @GetMapping("/programs")
    public ResponseEntity<Map<String, Object>> getPrograms(
            @RequestParam(defaultValue = "") String bizType,
            @RequestParam(defaultValue = "") String region) {
        try {
            if (smesApiKey == null || smesApiKey.isBlank()) {
                return ResponseEntity.ok(Map.of("programs", List.of(), "error", "SMES API 키 미설정"));
            }

            List<Map<String, Object>> programs = fetchSmesPrograms();
            log.info("[SupportController] 지원사업 {}건 조회", programs.size());
            return ResponseEntity.ok(Map.of("programs", programs, "total", programs.size()));

        } catch (Exception e) {
            log.error("[SupportController] SMES API 오류", e);
            return ResponseEntity.ok(Map.of("programs", List.of(), "error", e.getMessage()));
        }
    }

    // ── /debug ─────────────────────────────────────────────────────────────────
    /** 원시 API 응답을 그대로 반환 — 응답 구조 파악용 */
    @GetMapping("/debug")
    @SuppressWarnings("unchecked")
    public ResponseEntity<Map<String, Object>> debug() {
        if (smesApiKey == null || smesApiKey.isBlank()) {
            return ResponseEntity.ok(Map.of("error", "SMES API 키 미설정"));
        }
        try {
            String url = buildSmesUrl();
            log.info("[SupportController] DEBUG 호출 URL: {}", url);

            // Map으로 직접 수신
            Map<String, Object> parsed = restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(Map.class);

            if (parsed == null) {
                return ResponseEntity.ok(Map.of("error", "응답 null"));
            }

            log.info("[SupportController] DEBUG 최상위 키: {}", parsed.keySet());

            return ResponseEntity.ok(Map.of(
                    "topKeys", new ArrayList<>(parsed.keySet()),
                    "raw", parsed
            ));
        } catch (Exception e) {
            log.error("[SupportController] DEBUG 오류: {}", e.getMessage());
            return ResponseEntity.ok(Map.of("error", e.getMessage()));
        }
    }

    // ── 내부 메서드 ────────────────────────────────────────────────────────────

    private String buildSmesUrl() {
        return "https://www.smes.go.kr/fnct/apiReqst/extPblancInfo"
                + "?token=" + smesApiKey
                + "&pageIndex=1&pageUnit=20";
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchSmesPrograms() {
        try {
            String url = buildSmesUrl();
            log.info("[SupportController] SMES 호출: {}", url);

            Map<String, Object> response = restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(Map.class);

            if (response == null) {
                log.warn("[SupportController] 응답 null");
                return List.of();
            }

            log.info("[SupportController] 응답 최상위 키: {}", response.keySet());

            // resultCd / resultMsg 로깅
            Object resultCd  = response.get("resultCd");
            Object resultMsg = response.get("resultMsg");
            log.info("[SupportController] resultCd={}, resultMsg={}", resultCd, resultMsg);

            // data 필드 내용 상세 로깅
            Object dataField = response.get("data");
            if (dataField != null) {
                log.info("[SupportController] data 타입: {}", dataField.getClass().getSimpleName());
                if (dataField instanceof Map) {
                    log.info("[SupportController] data 내부 키: {}", ((Map<?, ?>) dataField).keySet());
                } else if (dataField instanceof List) {
                    log.info("[SupportController] data 직접 리스트: {}건", ((List<?>) dataField).size());
                } else {
                    log.info("[SupportController] data 값: {}", dataField);
                }
            } else {
                log.warn("[SupportController] data 필드가 null");
            }

            List<Map<String, Object>> items = extractItems(response);
            log.info("[SupportController] 추출된 항목 수: {}", items.size());

            return items.isEmpty() ? List.of() : normalizePrograms(items);

        } catch (Exception e) {
            log.warn("[SupportController] SMES 호출 실패: {}", e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> extractItems(Map<String, Object> response) {
        // 알려진 키 목록으로 탐색
        // 1. 최상위 리스트 직접 탐색
        for (Map.Entry<String, Object> entry : response.entrySet()) {
            if (entry.getValue() instanceof List && !((List<?>) entry.getValue()).isEmpty()) {
                log.info("[SupportController] 최상위 '{}' 에서 리스트 발견: {}건",
                        entry.getKey(), ((List<?>) entry.getValue()).size());
                return (List<Map<String, Object>>) entry.getValue();
            }
        }

        // 2. 중첩 Map 내부 탐색 (모든 키 시도)
        for (Map.Entry<String, Object> entry : response.entrySet()) {
            if (entry.getValue() instanceof Map) {
                Map<?, ?> inner = (Map<?, ?>) entry.getValue();
                log.info("[SupportController] '{}' 내부 키 탐색: {}", entry.getKey(), inner.keySet());
                for (Map.Entry<?, ?> innerEntry : inner.entrySet()) {
                    if (innerEntry.getValue() instanceof List && !((List<?>) innerEntry.getValue()).isEmpty()) {
                        log.info("[SupportController] '{}.{}' 에서 리스트 발견: {}건",
                                entry.getKey(), innerEntry.getKey(), ((List<?>) innerEntry.getValue()).size());
                        return (List<Map<String, Object>>) innerEntry.getValue();
                    }
                }
            }
        }

        log.warn("[SupportController] 어떤 경로에서도 리스트를 찾지 못함. 응답 전체: {}", response);
        return List.of();
    }

    private List<Map<String, Object>> normalizePrograms(List<Map<String, Object>> items) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> item : items) {
            Map<String, Object> normalized = new LinkedHashMap<>();
            normalized.put("id",       getStr(item, "pblancId", "id", "sn", "bizId"));
            normalized.put("title",    getStr(item, "pblancNm", "title", "sj", "bizNm", "taskNm"));
            normalized.put("org",      getStr(item, "insttNm", "org", "rceptInsttNm", "mnstNm"));
            normalized.put("amount",   getStr(item, "sprtScl", "amount", "aplySclCn", "sprtSclCn"));
            normalized.put("deadline", getStr(item, "rceptEndDt", "deadline", "pblancEndDt", "endDt"));
            normalized.put("status",   getStr(item, "pblancSttsCd", "status", "sttsCd", "bizSttsCd"));
            normalized.put("desc",     getStr(item, "pblancCn", "desc", "cn", "taskCn"));
            normalized.put("url",      getStr(item, "detlPageUrl", "url", "pblancUrl", "bizUrl"));
            if (!normalized.get("title").toString().isBlank()) {
                result.add(normalized);
            }
        }
        return result;
    }

    private String getStr(Map<String, Object> map, String... keys) {
        for (String key : keys) {
            Object val = map.get(key);
            if (val != null && !val.toString().isBlank()) return val.toString();
        }
        return "";
    }
}

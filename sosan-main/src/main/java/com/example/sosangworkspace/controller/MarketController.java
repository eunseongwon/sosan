package com.example.sosangworkspace.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.*;

/**
 * KAMIS (농산물유통정보) API 프록시.
 * 식재료 실시간 시세를 반환한다.
 *
 * GET /api/market/ingredients?category=채소
 * GET /api/market/ingredients/daily  — 오늘 주요 품목 시세
 */
@Slf4j
@RestController
@RequestMapping("/api/market")
public class MarketController {

    @Value("${kamis.api.key:}")
    private String kamisApiKey;

    private final RestClient restClient = RestClient.create();

    // KAMIS 품목 코드 (소매가 기준 주요 식재료)
    private static final List<Map<String, String>> ITEMS = List.of(
        Map.of("code", "211", "name", "배추",     "unit", "포기", "category", "채소"),
        Map.of("code", "214", "name", "무",       "unit", "개",   "category", "채소"),
        Map.of("code", "215", "name", "당근",     "unit", "개",   "category", "채소"),
        Map.of("code", "216", "name", "시금치",   "unit", "100g", "category", "채소"),
        Map.of("code", "218", "name", "상추",     "unit", "100g", "category", "채소"),
        Map.of("code", "221", "name", "대파",     "unit", "kg",   "category", "채소"),
        Map.of("code", "222", "name", "쪽파",     "unit", "kg",   "category", "채소"),
        Map.of("code", "225", "name", "양파",     "unit", "kg",   "category", "채소"),
        Map.of("code", "226", "name", "마늘",     "unit", "kg",   "category", "채소"),
        Map.of("code", "227", "name", "고추",     "unit", "100g", "category", "채소"),
        Map.of("code", "242", "name", "사과",     "unit", "개",   "category", "과일"),
        Map.of("code", "244", "name", "배",       "unit", "개",   "category", "과일"),
        Map.of("code", "246", "name", "포도",     "unit", "kg",   "category", "과일"),
        Map.of("code", "248", "name", "수박",     "unit", "개",   "category", "과일"),
        Map.of("code", "252", "name", "딸기",     "unit", "100g", "category", "과일"),
        Map.of("code", "111", "name", "쌀",       "unit", "20kg", "category", "곡물"),
        Map.of("code", "112", "name", "찹쌀",     "unit", "kg",   "category", "곡물"),
        Map.of("code", "141", "name", "계란",     "unit", "10개", "category", "축산물"),
        Map.of("code", "151", "name", "닭고기",   "unit", "kg",   "category", "축산물"),
        Map.of("code", "152", "name", "돼지고기", "unit", "100g", "category", "축산물"),
        Map.of("code", "153", "name", "쇠고기",   "unit", "100g", "category", "축산물")
    );

    @GetMapping("/ingredients")
    public ResponseEntity<Map<String, Object>> getIngredients(
            @RequestParam(defaultValue = "전체") String category) {
        try {
            if (kamisApiKey == null || kamisApiKey.isBlank()) {
                return ResponseEntity.ok(Map.of("items", List.of(), "error", "KAMIS API 키 미설정"));
            }

            String today = LocalDate.now().toString().replace("-", "");
            List<Map<String, Object>> result = new ArrayList<>();

            for (Map<String, String> item : ITEMS) {
                if (!"전체".equals(category) && !category.equals(item.get("category"))) continue;
                try {
                    Map<String, Object> priceData = fetchKamisPrice(item.get("code"), today);
                    if (priceData != null) {
                        priceData.put("name",     item.get("name"));
                        priceData.put("unit",     item.get("unit"));
                        priceData.put("category", item.get("category"));
                        result.add(priceData);
                    }
                } catch (Exception e) {
                    log.debug("[MarketController] {} 시세 조회 실패: {}", item.get("name"), e.getMessage());
                }
            }

            log.info("[MarketController] 식재료 시세 {}건 조회", result.size());
            return ResponseEntity.ok(Map.of("items", result, "updatedAt", today));

        } catch (Exception e) {
            log.error("[MarketController] KAMIS 오류", e);
            return ResponseEntity.ok(Map.of("items", List.of(), "error", e.getMessage()));
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> fetchKamisPrice(String itemCode, String regDay) {
        // KAMIS 소매가격 조회 API
        String url = "https://www.kamis.or.kr/service/price/xml.do"
                + "?action=dailyPriceList"
                + "&p_cert_key=" + kamisApiKey
                + "&p_cert_id=2024"          // KAMIS 인증 ID
                + "&p_returntype=json"
                + "&p_itemcategorycode=100"  // 100: 전체
                + "&p_itemcode=" + itemCode
                + "&p_kindcode=00"           // 00: 전체
                + "&p_graderank=1"           // 1: 상품
                + "&p_countycode=1101"       // 1101: 서울 (전국 대표)
                + "&p_yyyy=" + regDay.substring(0, 4)
                + "&p_regday=" + regDay.substring(4, 6) + "/" + regDay.substring(6, 8);

        Map<String, Object> response = restClient.get()
                .uri(url)
                .retrieve()
                .body(Map.class);

        if (response == null) return null;

        // 응답에서 가격 추출
        return extractPriceFromResponse(response);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> extractPriceFromResponse(Map<String, Object> response) {
        try {
            Object data = response.get("data");
            if (!(data instanceof Map)) return null;

            Object item = ((Map<?, ?>) data).get("item");
            if (!(item instanceof List)) return null;

            List<Map<String, Object>> items = (List<Map<String, Object>>) item;
            if (items.isEmpty()) return null;

            Map<String, Object> priceItem = items.get(0);
            String priceStr = getStr(priceItem, "price", "dpr1", "value");
            String prevStr  = getStr(priceItem, "prevPrice", "dpr2", "prev");

            if (priceStr.isBlank() || priceStr.equals("-")) return null;

            long price = parseLong(priceStr);
            long prev  = parseLong(prevStr);
            long change = price - prev;

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("price", price);
            result.put("prevPrice", prev);
            result.put("change", change);
            result.put("changePercent", prev > 0 ? Math.round(change * 100.0 / prev * 10.0) / 10.0 : 0.0);
            result.put("direction", change > 0 ? "up" : change < 0 ? "down" : "stable");
            return result;

        } catch (Exception e) {
            return null;
        }
    }

    private String getStr(Map<String, Object> map, String... keys) {
        for (String key : keys) {
            Object val = map.get(key);
            if (val != null && !val.toString().isBlank() && !val.toString().equals("-")) {
                return val.toString().replace(",", "");
            }
        }
        return "";
    }

    private long parseLong(String s) {
        try { return Long.parseLong(s.replace(",", "").replace(" ", "")); }
        catch (NumberFormatException e) { return 0; }
    }
}

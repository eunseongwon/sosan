package com.example.sosangworkspace.service;

import com.example.sosangworkspace.domain.SosangState;
import lombok.extern.slf4j.Slf4j;
import org.bsc.langgraph4j.action.AsyncNodeAction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.CompletableFuture;

/**
 * LangGraph4j 노드 1: 외부 API 데이터 수집
 *
 * - 국토교통부 상업업무용 실거래가 API (MOLIT) → XML 파싱
 * - 소상공인시장진흥공단 상가정보 API (SBIZ) → 승인 대기 중 (TODO)
 * - 한국부동산원 R-ONE 임대료 지수 API → TODO
 */
@Slf4j
@Component
public class ApiRetrievalNode implements AsyncNodeAction<SosangState> {

    @Value("${molit.api.key:}")
    private String molitApiKey;

    @Value("${sbiz.api.key:}")
    private String sbizApiKey;

    @Value("${rone.api.key:}")
    private String roneApiKey;

    /** 중소벤처24 - 정부 지원사업 공고 */
    @Value("${smes.api.key:}")
    private String smesApiKey;

    /** 국세청 - 사업자등록정보 진위확인 및 상태조회 */
    @Value("${nts.api.key:}")
    private String ntsApiKey;

    /** KAMIS - 농산물유통정보 (식재료 시세) */
    @Value("${kamis.api.key:}")
    private String kamisApiKey;

    private final RestClient restClient = RestClient.create();

    // 지역명 → 5자리 법정동 코드
    private static final Map<String, String> SIGUNGU_CODE_MAP = new HashMap<>();
    static {
        // 서울
        SIGUNGU_CODE_MAP.put("서울 종로구","11110"); SIGUNGU_CODE_MAP.put("서울 중구","11140");
        SIGUNGU_CODE_MAP.put("서울 용산구","11170"); SIGUNGU_CODE_MAP.put("서울 성동구","11200");
        SIGUNGU_CODE_MAP.put("서울 광진구","11215"); SIGUNGU_CODE_MAP.put("서울 동대문구","11230");
        SIGUNGU_CODE_MAP.put("서울 중랑구","11260"); SIGUNGU_CODE_MAP.put("서울 성북구","11290");
        SIGUNGU_CODE_MAP.put("서울 강북구","11305"); SIGUNGU_CODE_MAP.put("서울 도봉구","11320");
        SIGUNGU_CODE_MAP.put("서울 노원구","11350"); SIGUNGU_CODE_MAP.put("서울 은평구","11380");
        SIGUNGU_CODE_MAP.put("서울 서대문구","11410"); SIGUNGU_CODE_MAP.put("서울 마포구","11440");
        SIGUNGU_CODE_MAP.put("서울 양천구","11470"); SIGUNGU_CODE_MAP.put("서울 강서구","11500");
        SIGUNGU_CODE_MAP.put("서울 구로구","11530"); SIGUNGU_CODE_MAP.put("서울 금천구","11545");
        SIGUNGU_CODE_MAP.put("서울 영등포구","11560"); SIGUNGU_CODE_MAP.put("서울 동작구","11590");
        SIGUNGU_CODE_MAP.put("서울 관악구","11620"); SIGUNGU_CODE_MAP.put("서울 서초구","11650");
        SIGUNGU_CODE_MAP.put("서울 강남구","11680"); SIGUNGU_CODE_MAP.put("서울 송파구","11710");
        SIGUNGU_CODE_MAP.put("서울 강동구","11740");
        // 부산
        SIGUNGU_CODE_MAP.put("부산 중구","26110"); SIGUNGU_CODE_MAP.put("부산 서구","26140");
        SIGUNGU_CODE_MAP.put("부산 동구","26170"); SIGUNGU_CODE_MAP.put("부산 영도구","26200");
        SIGUNGU_CODE_MAP.put("부산 부산진구","26230"); SIGUNGU_CODE_MAP.put("부산 동래구","26260");
        SIGUNGU_CODE_MAP.put("부산 남구","26290"); SIGUNGU_CODE_MAP.put("부산 북구","26320");
        SIGUNGU_CODE_MAP.put("부산 해운대구","26350"); SIGUNGU_CODE_MAP.put("부산 사하구","26380");
        SIGUNGU_CODE_MAP.put("부산 금정구","26410"); SIGUNGU_CODE_MAP.put("부산 강서구","26440");
        SIGUNGU_CODE_MAP.put("부산 연제구","26470"); SIGUNGU_CODE_MAP.put("부산 수영구","26500");
        SIGUNGU_CODE_MAP.put("부산 사상구","26530"); SIGUNGU_CODE_MAP.put("부산 기장군","26710");
        // 대구
        SIGUNGU_CODE_MAP.put("대구 중구","27110"); SIGUNGU_CODE_MAP.put("대구 동구","27140");
        SIGUNGU_CODE_MAP.put("대구 서구","27170"); SIGUNGU_CODE_MAP.put("대구 남구","27200");
        SIGUNGU_CODE_MAP.put("대구 북구","27230"); SIGUNGU_CODE_MAP.put("대구 수성구","27260");
        SIGUNGU_CODE_MAP.put("대구 달서구","27290"); SIGUNGU_CODE_MAP.put("대구 달성군","27710");
        // 인천
        SIGUNGU_CODE_MAP.put("인천 중구","28110"); SIGUNGU_CODE_MAP.put("인천 동구","28140");
        SIGUNGU_CODE_MAP.put("인천 미추홀구","28177"); SIGUNGU_CODE_MAP.put("인천 연수구","28185");
        SIGUNGU_CODE_MAP.put("인천 남동구","28245"); SIGUNGU_CODE_MAP.put("인천 부평구","28237");
        SIGUNGU_CODE_MAP.put("인천 계양구","28247"); SIGUNGU_CODE_MAP.put("인천 서구","28260");
        // 광주
        SIGUNGU_CODE_MAP.put("광주 동구","29110"); SIGUNGU_CODE_MAP.put("광주 서구","29140");
        SIGUNGU_CODE_MAP.put("광주 남구","29155"); SIGUNGU_CODE_MAP.put("광주 북구","29170");
        SIGUNGU_CODE_MAP.put("광주 광산구","29200");
        // 대전
        SIGUNGU_CODE_MAP.put("대전 동구","30110"); SIGUNGU_CODE_MAP.put("대전 중구","30140");
        SIGUNGU_CODE_MAP.put("대전 서구","30170"); SIGUNGU_CODE_MAP.put("대전 유성구","30230");
        SIGUNGU_CODE_MAP.put("대전 대덕구","30200");
        // 경기
        SIGUNGU_CODE_MAP.put("수원 장안구","41111"); SIGUNGU_CODE_MAP.put("수원 권선구","41113");
        SIGUNGU_CODE_MAP.put("수원 팔달구","41115"); SIGUNGU_CODE_MAP.put("수원 영통구","41117");
        SIGUNGU_CODE_MAP.put("성남 수정구","41131"); SIGUNGU_CODE_MAP.put("성남 중원구","41133");
        SIGUNGU_CODE_MAP.put("성남 분당구","41135"); SIGUNGU_CODE_MAP.put("의정부시","41150");
        SIGUNGU_CODE_MAP.put("고양 덕양구","41281"); SIGUNGU_CODE_MAP.put("고양 일산동구","41285");
        SIGUNGU_CODE_MAP.put("고양 일산서구","41287"); SIGUNGU_CODE_MAP.put("용인 처인구","41461");
        SIGUNGU_CODE_MAP.put("용인 기흥구","41463"); SIGUNGU_CODE_MAP.put("용인 수지구","41465");
        SIGUNGU_CODE_MAP.put("부천시","41190"); SIGUNGU_CODE_MAP.put("안양 만안구","41171");
        SIGUNGU_CODE_MAP.put("안양 동안구","41173"); SIGUNGU_CODE_MAP.put("안산 상록구","41271");
        SIGUNGU_CODE_MAP.put("안산 단원구","41273"); SIGUNGU_CODE_MAP.put("남양주시","41360");
        SIGUNGU_CODE_MAP.put("화성시","41590"); SIGUNGU_CODE_MAP.put("파주시","41480");
        // 전북
        SIGUNGU_CODE_MAP.put("전주 완산구","45111"); SIGUNGU_CODE_MAP.put("전주 덕진구","45113");
        SIGUNGU_CODE_MAP.put("군산시","45130"); SIGUNGU_CODE_MAP.put("익산시","45140");
        // 경남
        SIGUNGU_CODE_MAP.put("창원 의창구","48121"); SIGUNGU_CODE_MAP.put("창원 성산구","48123");
        SIGUNGU_CODE_MAP.put("창원 마산합포구","48125"); SIGUNGU_CODE_MAP.put("창원 마산회원구","48127");
        SIGUNGU_CODE_MAP.put("진주시","48170"); SIGUNGU_CODE_MAP.put("김해시","48250");
        // 제주
        SIGUNGU_CODE_MAP.put("제주시","50110"); SIGUNGU_CODE_MAP.put("서귀포시","50130");
        // 세종
        SIGUNGU_CODE_MAP.put("세종시","36110");
    }

    @Override
    public CompletableFuture<Map<String, Object>> apply(SosangState state) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Map<String, String> answers = state.answers().orElse(Collections.emptyMap());
                String region  = answers.getOrDefault("region",   "");
                String bizType = answers.getOrDefault("bizType",  "");
                String budget  = answers.getOrDefault("budget",   "");
                String areaType = answers.getOrDefault("areaType","");

                log.info("[ApiRetrievalNode] 데이터 수집 시작 - 지역: {}, 업종: {}", region, bizType);

                StringBuilder context = new StringBuilder();

                // 1. 국토교통부 실거래가 API
                String molitData = fetchMolitData(region);
                if (!molitData.isBlank()) context.append(molitData).append("\n");

                // 2. 중소벤처24 정부 지원사업 공고
                String smesData = fetchSmesPrograms(bizType);
                if (!smesData.isBlank()) context.append(smesData).append("\n");

                // 3. SBIZ 상가정보 API (TODO: 승인 후 활성화)
                // String sbizData = fetchSbizData(region, bizType);

                // 기본 컨텍스트
                context.append(String.format(
                    "[창업 기본 정보] 지역: %s | 업종: %s | 상권: %s | 예산: %s",
                    region, bizType, areaType, budget
                ));

                log.info("[ApiRetrievalNode] 데이터 수집 완료");
                return Map.of("apiContext", context.toString());

            } catch (Exception e) {
                log.error("[ApiRetrievalNode] 오류 발생", e);
                return Map.of("apiContext", "", "error", e.getMessage());
            }
        });
    }

    private String fetchMolitData(String regionText) {
        if (molitApiKey == null || molitApiKey.isBlank()) return "";

        String sigunguCode = getSigunguCode(regionText);
        if (sigunguCode == null) {
            log.warn("[ApiRetrievalNode] 시군구 코드 조회 실패 - 지역: {}", regionText);
            return "";
        }

        LocalDate now = LocalDate.now();
        // 이번 달, 지난 달 순으로 시도
        for (int offset = 0; offset <= 1; offset++) {
            LocalDate target = now.minusMonths(offset);
            String dealYMD = String.format("%d%02d", target.getYear(), target.getMonthValue());
            try {
                String url = "https://apis.data.go.kr/1613000/RTMSDataSvcNrgTrade/getRTMSDataSvcNrgTrade"
                    + "?serviceKey=" + molitApiKey
                    + "&LAWD_CD=" + sigunguCode
                    + "&DEAL_YMD=" + dealYMD
                    + "&numOfRows=20&pageNo=1";

                String xml = restClient.get().uri(url).retrieve().body(String.class);
                String parsed = parseMolitXml(xml, regionText, dealYMD);
                if (!parsed.isBlank()) return parsed;

            } catch (Exception e) {
                log.warn("[ApiRetrievalNode] MOLIT API 호출 실패 ({}) - {}", dealYMD, e.getMessage());
            }
        }
        return "";
    }

    private String parseMolitXml(String xml, String regionName, String dealYMD) throws Exception {
        Document doc = DocumentBuilderFactory.newInstance()
                .newDocumentBuilder()
                .parse(new InputSource(new StringReader(xml)));

        NodeList items = doc.getElementsByTagName("item");
        if (items.getLength() == 0) return "";

        StringBuilder sb = new StringBuilder();
        sb.append(String.format("[국토교통부 상업업무용 실거래가 - %s %s년 %s월]\n",
                regionName,
                dealYMD.substring(0, 4),
                Integer.parseInt(dealYMD.substring(4, 6))));

        long totalPerPyeong = 0;
        int validCount = 0;

        for (int i = 0; i < Math.min(items.getLength(), 10); i++) {
            org.w3c.dom.Element item = (org.w3c.dom.Element) items.item(i);
            String buildingName = getText(item, "buildingName");
            String amount       = getText(item, "dealAmount");
            String area         = getText(item, "buildingArea");
            String floor        = getText(item, "floor");
            String dong         = getText(item, "umdNm");

            sb.append(String.format("  · %s (%s, %s층) - %s만원, 면적 %s㎡\n",
                    buildingName.isBlank() ? "건물명미상" : buildingName,
                    dong, floor, amount, area));

            try {
                long amt = Long.parseLong(amount.replace(",", ""));
                double areaVal = Double.parseDouble(area);
                if (amt > 0 && areaVal > 0) {
                    totalPerPyeong += (long)(amt / (areaVal / 3.3));
                    validCount++;
                }
            } catch (NumberFormatException ignored) {}
        }

        if (validCount > 0) {
            sb.append(String.format("- 평균 평당 거래금액: 약 %,d만원 (샘플 %d건)\n",
                    totalPerPyeong / validCount, items.getLength()));
        }

        return sb.toString();
    }

    private String getText(org.w3c.dom.Element el, String tag) {
        org.w3c.dom.NodeList nodes = el.getElementsByTagName(tag);
        if (nodes.getLength() == 0) return "";
        String text = nodes.item(0).getTextContent();
        return text == null ? "" : text.trim();
    }

    @SuppressWarnings("unchecked")
    private String fetchSmesPrograms(String bizType) {
        if (smesApiKey == null || smesApiKey.isBlank()) return "";
        try {
            String url = "https://www.smes.go.kr/fnct/apiReqst/extPblancInfo"
                    + "?token=" + smesApiKey
                    + "&pageIndex=1&pageUnit=10"
                    + "&pblancSttsCd=ing";

            Map<String, Object> response = restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(Map.class);

            if (response == null) return "";

            // 응답에서 항목 추출
            List<Map<String, Object>> items = extractSmesItems(response);
            if (items.isEmpty()) return "";

            StringBuilder sb = new StringBuilder("[중소벤처24 정부 지원사업 현황 (진행중)]\n");
            int count = 0;
            for (Map<String, Object> item : items) {
                if (count++ >= 5) break;
                String title  = getFieldStr(item, "pblancNm", "title", "sj");
                String org    = getFieldStr(item, "insttNm", "org", "rceptInsttNm");
                String amount = getFieldStr(item, "sprtScl", "amount", "aplySclCn");
                String end    = getFieldStr(item, "rceptEndDt", "deadline", "pblancEndDt");
                sb.append(String.format("  · %s (%s) | 지원규모: %s | 마감: %s\n", title, org, amount, end));
            }
            sb.append("(위 지원사업 정보를 자금 조달 분석에 반영해주세요.)\n");
            log.info("[ApiRetrievalNode] SMES 지원사업 {}건 수집", Math.min(count, 5));
            return sb.toString();

        } catch (Exception e) {
            log.warn("[ApiRetrievalNode] SMES 호출 실패: {}", e.getMessage());
            return "";
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> extractSmesItems(Map<String, Object> response) {
        for (String key : List.of("items", "data", "list", "pblancList", "result")) {
            Object val = response.get(key);
            if (val instanceof List) return (List<Map<String, Object>>) val;
            if (val instanceof Map) {
                Object inner = ((Map<?, ?>) val).get("items");
                if (inner instanceof List) return (List<Map<String, Object>>) inner;
            }
        }
        return List.of();
    }

    private String getFieldStr(Map<String, Object> map, String... keys) {
        for (String key : keys) {
            Object val = map.get(key);
            if (val != null && !val.toString().isBlank()) return val.toString();
        }
        return "-";
    }

    String getSigunguCode(String regionText) {
        String normalized = regionText
                .replace("특별시", "").replace("광역시", "").replace("특별자치시", "")
                .replace("특별자치도", "").replaceAll("[도]\\s", " ").replace("도", "")
                .replaceAll("\\s+", " ").trim();

        if (SIGUNGU_CODE_MAP.containsKey(normalized)) return SIGUNGU_CODE_MAP.get(normalized);

        String[] parts = normalized.split("\\s+");
        String last = parts[parts.length - 1];

        // 단독 시 (예: "수원시")
        if (SIGUNGU_CODE_MAP.containsKey(last)) return SIGUNGU_CODE_MAP.get(last);

        // 앞 두 단어 조합 (예: "서울 강남구")
        if (parts.length >= 2) {
            String twoWord = parts[0] + " " + last;
            if (SIGUNGU_CODE_MAP.containsKey(twoWord)) return SIGUNGU_CODE_MAP.get(twoWord);
        }

        // 도시명 + 구 (예: "수원시 장안구" → "수원 장안구")
        if (parts.length >= 2) {
            String cityBase = parts[0].replaceAll("시$", "");
            String key = cityBase + " " + last;
            if (SIGUNGU_CODE_MAP.containsKey(key)) return SIGUNGU_CODE_MAP.get(key);
        }

        // 중간 단어 + 마지막 (예: "경기도 수원시 장안구" → "수원 장안구")
        if (parts.length >= 3) {
            String midBase = parts[parts.length - 2].replaceAll("시$", "");
            String key = midBase + " " + last;
            if (SIGUNGU_CODE_MAP.containsKey(key)) return SIGUNGU_CODE_MAP.get(key);
        }

        // 구 없이 시만 입력한 경우 (예: "전주시" → "전주 완산구" 45111)
        // 지도에서 같은 도시명으로 시작하는 첫 번째 항목 반환
        for (String candidate : new String[]{last, last.replaceAll("시$", ""), parts[0].replaceAll("시$", "")}) {
            if (candidate.isBlank()) continue;
            String finalCandidate = candidate;
            String found = SIGUNGU_CODE_MAP.entrySet().stream()
                    .filter(e -> e.getKey().startsWith(finalCandidate + " "))
                    .map(Map.Entry::getValue)
                    .findFirst()
                    .orElse(null);
            if (found != null) {
                log.info("[ApiRetrievalNode] 구 미지정 → '{}' 첫 번째 일치 코드 사용: {}", candidate, found);
                return found;
            }
        }

        return null;
    }
}

package com.example.sosangworkspace.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 분석 결과를 DB에 저장하는 JPA 엔티티.
 * 프론트의 6개 고정 질문 답변 + LLM이 생성한 보고서를 함께 저장한다.
 */
@Entity
@Table(name = "analysis_reports")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 업종 (예: "카페 > 테이크아웃") */
    private String bizType;

    /** 운영 형태 (예: "매장+배달 혼합형") */
    private String opType;

    /** 지역 (예: "서울특별시 강남구") */
    private String region;

    /** 상권 유형 (예: "역세권") */
    private String areaType;

    /** 창업 예산 (예: "3천만~7천만 원") */
    private String budget;

    /** 점포 형태 (예: "소형 매장") */
    private String storeSize;

    /** LLM이 생성한 최종 보고서 (JSON 문자열) */
    @Lob
    @Column(columnDefinition = "TEXT")
    private String reportContent;

    /** 외부 API에서 수집한 시장 데이터 요약 */
    @Lob
    @Column(columnDefinition = "TEXT")
    private String apiContext;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

package com.example.sosangworkspace.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS 전역 설정.
 * allowed.origins 프로퍼티로 허용 출처를 관리한다.
 * 로컬: application-local.properties
 * 운영: 환경변수 ALLOWED_ORIGINS
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${allowed.origins:http://localhost:5173,http://localhost:3000}")
    private String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }
}

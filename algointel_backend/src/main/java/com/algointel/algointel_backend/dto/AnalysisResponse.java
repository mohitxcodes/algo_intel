package com.algointel.algointel_backend.dto;

import lombok.Data;

@Data
public class AnalysisResponse {
    private String approach;
    private String timeComplexity;
    private String spaceComplexity;
}

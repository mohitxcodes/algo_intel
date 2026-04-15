package com.algointel.algointel_backend.dto;

import java.util.List;

import lombok.Data;

@Data
public class AnalysisResponse {
    private String approach;
    private String timeComplexity;
    private String spaceComplexity;
    private String summary;
    private List<String> improvements;

}

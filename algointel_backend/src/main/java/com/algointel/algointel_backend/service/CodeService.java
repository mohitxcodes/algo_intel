package com.algointel.algointel_backend.service;

import org.springframework.stereotype.Service;

import com.algointel.algointel_backend.dto.AnalysisResponse;
import com.algointel.algointel_backend.dto.CodeRequest;

@Service
public class CodeService {

    public AnalysisResponse analyzeCode(CodeRequest request) {
        AnalysisResponse response = new AnalysisResponse();
        response.setApproach("Linear Approach");
        response.setTimeComplexity("o(n)");
        response.setSpaceComplexity("o(1)");
        return response;
    }

}

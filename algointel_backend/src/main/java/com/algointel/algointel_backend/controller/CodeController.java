package com.algointel.algointel_backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.algointel.algointel_backend.dto.AnalysisResponse;
import com.algointel.algointel_backend.dto.CodeRequest;
import com.algointel.algointel_backend.service.AIService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CodeController {

    // private final CodeService codeService;
    private final AIService aiService;

    public CodeController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze")
    public AnalysisResponse analyzeCode(@RequestBody CodeRequest request) {
        return aiService.analyzeCode(request.getCode());
    }

}

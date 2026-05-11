package com.algointel.algointel_backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.algointel.algointel_backend.dto.AnalysisResponse;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
public class AIService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.create("https://api.groq.com/openai/v1");
    private final ObjectMapper mapper = new ObjectMapper();

    public AnalysisResponse analyzeCode(String code) {

        String prompt = """
                You are AlgoIntel, an expert algorithm analyzer. Analyze the given code.
                
                Respond with ONLY valid JSON with no markdown formatting. Do not include ```json or ``` tags. The JSON should have exactly the following structure:
                {
                  "approach": "A clear, concise explanation of the algorithmic approach used (2-3 sentences max).",
                  "timeComplexity": "ONLY the Big O notation of the CURRENT code, e.g. O(n), O(n log n), O(n^2). Nothing else.",
                  "suggestedTimeComplexity": "ONLY the Big O notation of the BEST OPTIMIZED version achievable, e.g. O(n), O(log n). If already optimal, return the same as timeComplexity.",
                  "spaceComplexity": "ONLY the Big O notation of the CURRENT code, e.g. O(1), O(n). Nothing else.",
                  "suggestedSpaceComplexity": "ONLY the Big O notation of the BEST OPTIMIZED version achievable, e.g. O(1). If already optimal, return the same as spaceComplexity.",
                  "summary": "A brief 1-2 sentence summary of what the code does.",
                  "improvements": ["short improvement suggestion 1", "short improvement suggestion 2"]
                }

                IMPORTANT RULES:
                - timeComplexity, suggestedTimeComplexity, spaceComplexity, suggestedSpaceComplexity must contain ONLY Big O notation like O(n), O(1), O(n^2), O(n log n). No other text.
                - suggestedTimeComplexity is the best possible time complexity if the code is optimized using a better algorithm/data structure.
                - suggestedSpaceComplexity is the best possible space complexity if the code is optimized.
                - Keep improvements concise (one sentence each).
                - Keep approach to 2-3 sentences maximum.
                
                Code to analyze:
                """ + code;

        Map<String, Object> requestMap = new HashMap<>();
        requestMap.put("model", "llama-3.3-70b-versatile");
        requestMap.put("messages", List.of(Map.of("role", "user", "content", prompt)));

        String requestBody;
        try {
            requestBody = mapper.writeValueAsString(requestMap);
        } catch (Exception e) {
            throw new RuntimeException("Error converting request to JSON", e);
        }

        try {
            String response = webClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return parseResponse(response);
            
        } catch (WebClientResponseException.TooManyRequests e) {
            System.err.println("Rate limit reached on OpenRouter API: " + e.getMessage());
            return fallbackResponse("AI Rate Limit Exceeded. Please try again in a few moments.");
        } catch (Exception e) {
            System.err.println("Error calling AI API: " + e.getMessage());
            return fallbackResponse("Analysis currently unavailable. Please try again later. Reason: " + e.getMessage());
        }
    }

    private AnalysisResponse fallbackResponse(String message) {
        AnalysisResponse response = new AnalysisResponse();
        response.setSummary(message);
        response.setApproach("N/A");
        response.setTimeComplexity("N/A");
        response.setSuggestedTimeComplexity("N/A");
        response.setSpaceComplexity("N/A");
        response.setSuggestedSpaceComplexity("N/A");
        response.setImprovements(List.of("Service temporarily overloaded"));
        return response;
    }

    private AnalysisResponse parseResponse(String response) {
        try {
            // Strip any whitespace padding OpenRouter sometimes prepends to keep connections alive
            response = response.trim();
            int firstBrace = response.indexOf('{');
            if (firstBrace > 0) {
                response = response.substring(firstBrace);
            }

            JsonNode root = mapper.readTree(response);

            String content = root
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

            // Strip possible markdown blocks generated by the LLM
            content = content.trim();
            if (content.startsWith("```json")) {
                content = content.substring(7);
            } else if (content.startsWith("```")) {
                content = content.substring(3);
            }
            if (content.endsWith("```")) {
                content = content.substring(0, content.length() - 3);
            }
            content = content.trim();

            // Convert JSON string back to the AnalysisResponse object
            return mapper.readValue(content, AnalysisResponse.class);

        } catch (Exception e) {
            throw new RuntimeException("Error parsing AI response: " + e.getMessage() + "\nRaw Response: " + response, e);
        }
    }
}
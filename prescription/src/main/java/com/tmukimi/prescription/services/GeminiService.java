package com.tmukimi.prescription.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String extractMedicineData(MultipartFile file) throws Exception {
        String base64Content = Base64.getEncoder().encodeToString(file.getBytes());
        String mimeType = file.getContentType();

        String prompt = "Extract medicine brand names, dosages, and durations from this prescription. " +
                "Return a JSON array of objects strictly in this format: " +
                "[{\"brandName\": \"NAME\", \"dosage\": \"1+0+1\", \"durationDays\": 7}]. " +
                "If duration is '10 days', just return the number 10. " +
                "Do not include markdown or extra text.";

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt),
                                Map.of("inline_data", Map.of(
                                        "mime_type", mimeType,
                                        "data", base64Content
                                ))
                        ))
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                apiUrl + "?key=" + apiKey, entity, String.class);

        return parseGeminiResponse(response.getBody());
    }

    private String parseGeminiResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        String text = root.path("candidates").get(0)
                .path("content").path("parts").get(0)
                .path("text").asText();

        return text.replace("```json", "").replace("```", "").trim();
    }
}
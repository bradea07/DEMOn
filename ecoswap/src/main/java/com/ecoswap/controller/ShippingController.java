package com.ecoswap.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@RestController
@RequestMapping("/api/shipping")
@CrossOrigin(origins = "*")
public class ShippingController {

    private final String SHIPPO_API_KEY = "shippo_test_b71c4d7eda1b61250f65ca1a1ede65f87a1f5bdc";
    private final String SHIPPO_API_BASE_URL = "https://api.goshippo.com";
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    @PostMapping("/shipments")
    public ResponseEntity<?> createShipment(@RequestBody Map<String, Object> shipmentRequest) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "ShippoToken " + SHIPPO_API_KEY);
            
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(shipmentRequest, headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                SHIPPO_API_BASE_URL + "/shipments/",
                HttpMethod.POST,
                requestEntity,
                Map.class
            );
            
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/rates/{shipmentId}")
    public ResponseEntity<?> getShipmentRates(@PathVariable String shipmentId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "ShippoToken " + SHIPPO_API_KEY);
            
            HttpEntity<?> requestEntity = new HttpEntity<>(headers);
            
            String url = UriComponentsBuilder
                .fromHttpUrl(SHIPPO_API_BASE_URL + "/shipments/" + shipmentId + "/rates/")
                .toUriString();
                
            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                Map.class
            );
            
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
}

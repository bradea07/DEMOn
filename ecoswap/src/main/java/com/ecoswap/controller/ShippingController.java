package com.ecoswap.controller;

import com.ecoswap.dto.ShippingTransactionDTO;
import com.ecoswap.service.ShippingService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shipping")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "*")
public class ShippingController {

    private final String SHIPPO_API_KEY = "shippo_test_b71c4d7eda1b61250f65ca1a1ede65f87a1f5bdc";
    private final String SHIPPO_API_BASE_URL = "https://api.goshippo.com";
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ShippingService shippingService;
    
    public ShippingController(ShippingService shippingService) {
        this.shippingService = shippingService;
    }
    // Create a new shipment through Shippo API
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
    // Get shipping rates for a specific shipment
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
    // Create and save shipping transaction with email confirmation
    @PostMapping("/transactions")
    public ResponseEntity<?> createShippingTransaction(@RequestBody ShippingTransactionDTO transactionDTO) {
        try {
            // Log the incoming transaction for debugging
            System.out.println("Creating shipping transaction: " + transactionDTO);
            
            ShippingTransactionDTO created = shippingService.createShippingTransaction(transactionDTO);
            
            // Return the created transaction with additional message about email
            return ResponseEntity.ok(Map.of(
                "transaction", created,
                "message", "Shipping transaction created. Confirmation email sent to " + 
                           (transactionDTO.getFromEmail() != null ? transactionDTO.getFromEmail() : "no email provided")
            ));
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
     // Get all shipping transactions
    @GetMapping("/transactions")
    public ResponseEntity<List<ShippingTransactionDTO>> getAllShippingTransactions() {
        List<ShippingTransactionDTO> transactions = shippingService.getAllShippingTransactions();
        return ResponseEntity.ok(transactions);
    }
    // Get shipping transaction by ID
    @GetMapping("/transactions/{id}")
    public ResponseEntity<?> getShippingTransactionById(@PathVariable Long id) {
        try {
            ShippingTransactionDTO transaction = shippingService.getShippingTransactionById(id);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
     // Get shipping transaction by Shippo shipment ID
    @GetMapping("/transactions/shipment/{shipmentId}")
    public ResponseEntity<?> getShippingTransactionByShipmentId(@PathVariable String shipmentId) {
        try {
            ShippingTransactionDTO transaction = shippingService.getShippingTransactionByShipmentId(shipmentId);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        }
    }
}

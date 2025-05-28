package com.ecoswap.controller;

import com.ecoswap.model.Product;
import com.ecoswap.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {
    private static final Logger logger = Logger.getLogger(RecommendationController.class.getName());

    @Autowired
    private RecommendationService recommendationService;    /**
     * Records a user search to be used for future recommendations
     */
    @PostMapping("/record-search")
    public ResponseEntity<?> recordSearch(
            @RequestParam String userId,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String minPrice,
            @RequestParam(required = false) String maxPrice) {
            
        try {
            logger.info("Recording search for userId: " + userId + ", query: " + query);
            Long userIdLong = Long.parseLong(userId);
            recommendationService.recordSearch(userIdLong, query, category, brand, condition, location, minPrice, maxPrice);            return ResponseEntity.ok().build();
        } catch (NumberFormatException e) {
            logger.warning("Invalid user ID format: " + userId);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid user ID format");
        } catch (Exception e) {
            logger.severe("Error recording search: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error recording search: " + e.getMessage());
        }
    }    /**
     * Get personalized product recommendations for a user
     */    @GetMapping("/{userId}")
    public ResponseEntity<?> getRecommendations(@PathVariable String userId) {
        try {
            logger.info("Fetching recommendations for userId: " + userId);
            
            if (userId == null || userId.trim().isEmpty()) {
                logger.warning("Received null or empty user ID");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID cannot be null or empty");
            }
            
            Long userIdLong = Long.parseLong(userId);
            logger.info("Parsed user ID: " + userIdLong);
            
            List<Product> recommendations = recommendationService.getRecommendationsForUser(userIdLong);
            logger.info("Found " + recommendations.size() + " recommendations for userId: " + userId);
            
            if (recommendations.isEmpty()) {
                // Even if no recommendations are found, return an empty list with 200 OK
                logger.warning("No recommendations found for userId: " + userId);
                return ResponseEntity.ok(recommendations);
            }
            
            return ResponseEntity.ok(recommendations);
        } catch (NumberFormatException e) {
            logger.warning("Invalid user ID format: " + userId);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid user ID format");
        } catch (Exception e) {
            logger.severe("Error fetching recommendations: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching recommendations: " + e.getMessage() + " at " + e.getStackTrace()[0]);
        }
    }
}

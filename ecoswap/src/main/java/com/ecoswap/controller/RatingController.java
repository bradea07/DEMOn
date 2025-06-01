package com.ecoswap.controller;

import com.ecoswap.dto.RatingDTO;
import com.ecoswap.service.RatingService;
import com.ecoswap.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*") // Match UserController CORS config
public class RatingController {    private final RatingService ratingService;
    private final NotificationService notificationService;

    public RatingController(RatingService ratingService, NotificationService notificationService) {
        this.ratingService = ratingService;
        this.notificationService = notificationService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RatingDTO>> getUserRatings(@PathVariable Long userId) {
        List<RatingDTO> ratings = ratingService.getRatingsForUser(userId);
        return ResponseEntity.ok(ratings);
    }    @PostMapping
    public ResponseEntity<?> createRating(@RequestBody RatingDTO ratingDTO) {
        try {
            RatingDTO createdRating = ratingService.createRating(ratingDTO);
            
            // Create notification for the user who received the rating
            notificationService.createRatingReceivedNotification(
                createdRating.getSellerId(),
                createdRating.getReviewerId(),
                createdRating.getScore()
            );
            
            return ResponseEntity.ok(createdRating);
        } catch (RuntimeException e) {
            // Return 400 Bad Request with the error message when a duplicate rating is attempted
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long ratingId, @RequestParam Long userId) {
        ratingService.deleteRating(ratingId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/update-shipment/{ratingId}")
    public ResponseEntity<?> updateShipmentInfo(
            @PathVariable Long ratingId,
            @RequestBody RatingDTO ratingDTO) {
        try {
            RatingDTO updatedRating = ratingService.updateShipmentInfo(ratingId, ratingDTO);
            return ResponseEntity.ok(updatedRating);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

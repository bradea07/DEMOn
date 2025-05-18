package com.ecoswap.controller;

import com.ecoswap.dto.RatingDTO;
import com.ecoswap.service.RatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*") // Match UserController CORS config
public class RatingController {    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RatingDTO>> getUserRatings(@PathVariable Long userId) {
        List<RatingDTO> ratings = ratingService.getRatingsForUser(userId);
        return ResponseEntity.ok(ratings);
    }    @PostMapping
    public ResponseEntity<?> createRating(@RequestBody RatingDTO ratingDTO) {
        try {
            RatingDTO createdRating = ratingService.createRating(ratingDTO);
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
}

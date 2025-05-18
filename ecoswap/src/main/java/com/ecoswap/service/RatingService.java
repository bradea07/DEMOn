package com.ecoswap.service;

import com.ecoswap.dto.RatingDTO;
import com.ecoswap.model.Rating;
import com.ecoswap.model.User;
import com.ecoswap.repository.RatingRepository;
import com.ecoswap.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;

    public RatingService(RatingRepository ratingRepository, UserRepository userRepository) {
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
    }    public List<RatingDTO> getRatingsForUser(Long userId) {
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        List<Rating> ratings = ratingRepository.findBySellerIdAndActiveTrue(userId);
        return ratings.stream()
                .map(RatingDTO::new)
                .collect(Collectors.toList());
    }    public RatingDTO createRating(RatingDTO ratingDTO) {
        User seller = userRepository.findById(ratingDTO.getSellerId())
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        
        User reviewer = userRepository.findById(ratingDTO.getReviewerId())
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));
        
        // Check if the user has already rated this seller
        Rating existingRating = ratingRepository.findBySellerIdAndReviewerId(
                ratingDTO.getSellerId(), ratingDTO.getReviewerId());
        
        if (existingRating != null) {
            // Prevent editing existing ratings
            throw new RuntimeException("You have already rated this user and cannot modify your rating.");
        }
        
        // Create new rating if one doesn't exist
        Rating rating = new Rating();
        rating.setSeller(seller);
        rating.setReviewer(reviewer);
        rating.setScore(ratingDTO.getScore());
        rating.setComment(ratingDTO.getComment());
        rating.setActive(true);
        // Since we don't need verification
        rating.setVerified(true);
        rating.setRaterId(ratingDTO.getRaterId());
        
        Rating savedRating = ratingRepository.save(rating);
        return new RatingDTO(savedRating);
    }
    
    public void deleteRating(Long ratingId, Long userId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new RuntimeException("Rating not found"));
        
        if (!rating.getReviewer().getId().equals(userId)) {
            throw new RuntimeException("User is not authorized to delete this rating");
        }
        
        ratingRepository.delete(rating);
    }
}

package com.ecoswap.repository;

import com.ecoswap.model.Product;
import com.ecoswap.model.User;
import com.ecoswap.model.UserRecommendationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRecommendationHistoryRepository extends JpaRepository<UserRecommendationHistory, Long> {
    
    /**
     * Find all recommendation history entries for a specific user
     */
    List<UserRecommendationHistory> findByUser(User user);
    
    /**
     * Find all recommendation history entries for a specific user ordered by most recent
     */
    List<UserRecommendationHistory> findByUserOrderByRecommendedAtDesc(User user);
    
    /**
     * Find a specific recommendation history entry for a user and product
     */
    Optional<UserRecommendationHistory> findByUserAndProduct(User user, Product product);
    
    /**
     * Find products that have been recommended to a user more than a certain number of times
     */
    List<UserRecommendationHistory> findByUserAndRecommendationCountGreaterThanEqual(User user, int count);
}

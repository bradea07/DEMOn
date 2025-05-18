package com.ecoswap.repository;

import com.ecoswap.model.Rating;
import com.ecoswap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findBySeller(User seller);
    List<Rating> findByReviewer(User reviewer);
    List<Rating> findBySellerIdAndActiveTrue(Long sellerId);
}

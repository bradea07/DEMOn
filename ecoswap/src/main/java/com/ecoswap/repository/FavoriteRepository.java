package com.ecoswap.repository;

import com.ecoswap.model.Favorite;
import com.ecoswap.model.User;
import com.ecoswap.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);
    List<Favorite> findByUserId(Long userId);
    Optional<Favorite> findByUserAndProduct(User user, Product product);
    Optional<Favorite> findByUserIdAndProductId(Long userId, Long productId);
    void deleteByUserAndProduct(User user, Product product);
    void deleteByUserIdAndProductId(Long userId, Long productId);
    boolean existsByUserIdAndProductId(Long userId, Long productId);
}

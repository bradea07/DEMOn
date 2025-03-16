package com.ecoswap.repository;

import com.ecoswap.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // ✅ Search ONLY by product title (case insensitive)
    List<Product> findByTitleContainingIgnoreCase(String title);
}

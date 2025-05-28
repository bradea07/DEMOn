package com.ecoswap.repository;

import com.ecoswap.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Date;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // 🔍 Căutare după titlu (search bar)
    List<Product> findByTitleContainingIgnoreCase(String keyword);

    // 👤 Produse postate de un anumit user
    List<Product> findByUserId(Long userId);
    
    // For recommendations
    List<Product> findByCategoryOrderByIdDesc(String category);
    
    // For recommendations
    List<Product> findByBrandIgnoreCaseOrderByIdDesc(String brand);
    
    // 🔍 Advanced search with filters
    @Query("SELECT p FROM Product p WHERE " +
           "(:query IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:category IS NULL OR :category = '' OR p.category = :category) AND " +
           "(:condition IS NULL OR :condition = '' OR p.productCondition = :condition) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:brand IS NULL OR :brand = '' OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    List<Product> searchProducts(
            @Param("query") String query,
            @Param("category") String category,
            @Param("condition") String condition,
            @Param("location") String location,
            @Param("brand") String brand,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );
    
    // Find products ordered by creation date (newest first)
    List<Product> findByOrderByCreatedAtDesc();
    
    // Find products created after a specific date
    List<Product> findByCreatedAtAfterOrderByCreatedAtDesc(Date date);
}

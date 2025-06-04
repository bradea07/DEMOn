package com.ecoswap.service;

import com.ecoswap.model.Product;
import com.ecoswap.repository.ProductRepository;
import com.ecoswap.repository.FavoriteRepository;
import com.ecoswap.repository.UserRecommendationHistoryRepository;
import com.ecoswap.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private FavoriteRepository favoriteRepository;
    
    @Autowired
    private UserRecommendationHistoryRepository userRecommendationHistoryRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;

    // ✅ Add a new product
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // ✅ Retrieve all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    


    // ✅ Search ONLY by product title (case insensitive)
    public List<Product> searchProductsByTitle(String keyword) {
        return productRepository.findByTitleContainingIgnoreCase(keyword);
    }
    

    
    // ✅ Advanced search with filters
    public List<Product> searchProductsWithFilters(
            String query,
            String category,
            String condition,
            String location,
            String brand,
            Double minPrice,
            Double maxPrice) {
        
        return productRepository.searchProducts(
                query, category, condition, location, brand, minPrice, maxPrice);
    }

    // ✅ Get product by ID (for product details page)
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // ✅ Get all products for a specific user
    public List<Product> getProductsByUserId(Long userId) {
        return productRepository.findByUserId(userId);
    }
    

    
@Transactional
public void deleteProductById(Long id) {
    if (id == null) {
        throw new IllegalArgumentException("Product ID cannot be null");
    }
    
    Optional<Product> product = productRepository.findById(id);
    if (product.isPresent()) {
        System.out.println("🧹 Cleaning up related records for product ID: " + id);
        
        // 1. Delete all favorites for this product
        try {
            favoriteRepository.deleteByProductId(id);
            System.out.println("✅ Deleted favorites for product ID: " + id);
        } catch (Exception e) {
            System.out.println("⚠️ Warning: Could not delete favorites for product ID " + id + ": " + e.getMessage());
        }
        
        // 2. Delete all recommendation history for this product
        try {
            userRecommendationHistoryRepository.deleteByProductId(id);
            System.out.println("✅ Deleted recommendation history for product ID: " + id);
        } catch (Exception e) {
            System.out.println("⚠️ Warning: Could not delete recommendation history for product ID " + id + ": " + e.getMessage());
        }
        
        // 3. Delete all notifications related to this product
        try {
            notificationRepository.deleteByProductId(id);
            System.out.println("✅ Deleted notifications for product ID: " + id);
        } catch (Exception e) {
            System.out.println("⚠️ Warning: Could not delete notifications for product ID " + id + ": " + e.getMessage());
        }
        
        // 4. Delete the product itself (this will also cascade delete product_images)
        productRepository.deleteById(id);
        System.out.println("✅ Deleted product with ID: " + id);
    } else {
        throw new RuntimeException("Product with ID " + id + " does not exist.");
    }
}


}

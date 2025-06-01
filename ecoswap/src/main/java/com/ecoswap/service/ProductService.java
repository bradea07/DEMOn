package com.ecoswap.service;

import com.ecoswap.model.Product;
import com.ecoswap.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

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

public void deleteProductById(Long id) {
    if (id == null) {
        throw new IllegalArgumentException("Product ID cannot be null");
    }
    
    Optional<Product> product = productRepository.findById(id);
    if (product.isPresent()) {
        productRepository.deleteById(id);
    } else {
        throw new RuntimeException("Product with ID " + id + " does not exist.");
    }
}


}

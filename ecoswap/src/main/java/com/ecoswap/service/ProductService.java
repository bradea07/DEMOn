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

    // ✅ Get product by ID (for product details page)
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
}

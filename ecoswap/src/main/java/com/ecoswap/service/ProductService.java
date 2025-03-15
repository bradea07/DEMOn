package com.ecoswap.service;

import com.ecoswap.model.Product;
import com.ecoswap.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> searchProductsByTitle(String keyword) {
        return productRepository.findByTitleContainingIgnoreCase(keyword);
    }

    public List<Product> filterProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }
}

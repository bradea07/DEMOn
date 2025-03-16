package com.ecoswap.controller;

import com.ecoswap.model.Product;
import com.ecoswap.repository.UserRepository;
import com.ecoswap.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ecoswap.model.User;

import java.util.Collections; // ✅ FIX: Import for Collections
import java.util.List;
import java.util.Map; // ✅ FIX: Import for Map
import java.util.Optional;
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
public ResponseEntity<?> addProduct(@RequestBody Product product) {
    System.out.println("🟢 Debugging: Received Product Data: " + product);

    if (product.getUser() == null || product.getUser().getId() == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of("error", "user_id is required!"));
    }

    Optional<User> user = userRepository.findById(product.getUser().getId());
    if (user.isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of("error", "Invalid user_id! User does not exist."));
    }

    product.setUser(user.get()); // 🔥 Ensure User object is properly set
    Product savedProduct = productService.addProduct(product);
    return ResponseEntity.ok(Map.of("message", "Product added successfully!"));
}

    

    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String keyword) {
        return productService.searchProductsByTitle(keyword);
    }

    @GetMapping("/filter")
    public List<Product> filterByCategory(@RequestParam String category) {
        return productService.filterProductsByCategory(category);
    }
}

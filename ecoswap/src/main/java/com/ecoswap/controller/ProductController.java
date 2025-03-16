package com.ecoswap.controller;

import com.ecoswap.model.Product;
import com.ecoswap.model.User;
import com.ecoswap.repository.UserRepository;
import com.ecoswap.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")  // Ensure frontend access
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Add a new product with multiple image support
     */
    @PostMapping(value = "/add", consumes = "multipart/form-data")
    public ResponseEntity<?> addProduct(
        @RequestParam("title") String title,
        @RequestParam("category") String category,
        @RequestParam("description") String description,
        @RequestParam("location") String location,
        @RequestParam("price") Double price,  // Ensure it is Double
        @RequestParam("brand") String brand,
        @RequestParam("product_condition") String productCondition,
        @RequestParam("user_id") Long userId,
        @RequestParam("images") List<MultipartFile> images) {  // Handle file uploads

        System.out.println("🟢 Debugging: Received Product Data");

        // Validate user existence
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Invalid user_id! User does not exist."));
        }

        // Process uploaded images (for now, just log them)
        List<String> imageNames = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    imageNames.add(image.getOriginalFilename());
                    System.out.println("📷 Received Image: " + image.getOriginalFilename());
                }
            }
        }

        // Create and save product
        Product product = new Product();
        product.setTitle(title);
        product.setCategory(category);
        product.setDescription(description);
        product.setLocation(location);
        product.setPrice(price);
        product.setBrand(brand);
        product.setProductCondition(productCondition);
        product.setUser(user.get());

        productService.addProduct(product);

        return ResponseEntity.ok(Map.of(
            "message", "✅ Product added successfully!",
            "uploadedImages", imageNames
        ));
    }

    /**
     * Get all products
     */
    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    /**
     * Search products by keyword in title
     */
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String keyword) {
        return productService.searchProductsByTitle(keyword);
    }

    /**
     * Filter products by category
     */
    @GetMapping("/filter")
    public List<Product> filterByCategory(@RequestParam String category) {
        return productService.filterProductsByCategory(category);
    }
}

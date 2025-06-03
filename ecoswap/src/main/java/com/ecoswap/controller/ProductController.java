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

import java.io.File;
import java.io.IOException;
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
        @RequestParam("price") Double price,
        @RequestParam("brand") String brand,
        @RequestParam("product_condition") String productCondition,
        @RequestParam("phone") String phone,
        @RequestParam("user_id") Long userId,
        @RequestParam(value = "images", required = false) List<MultipartFile> images) {

    System.out.println("🟢 Debugging: Received Product Data");

    Optional<User> user = userRepository.findById(userId);
    if (user.isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Invalid user_id! User does not exist."));
    }

    // Validate that at least one image is provided
    if (images == null || images.isEmpty() || images.stream().allMatch(MultipartFile::isEmpty)) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "At least one product image is required."));
    }

    // ✅ Use an absolute path for the uploads directory
    String uploadDirPath = System.getProperty("user.dir") + "/uploads/";
    File uploadDir = new File(uploadDirPath);

    // ✅ Ensure the upload directory exists
    if (!uploadDir.exists()) {
        boolean created = uploadDir.mkdirs();
        if (!created) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create upload directory."));
        }
    }

    // ✅ Save multiple images correctly
    List<String> imagePaths = new ArrayList<>();
    if (images != null) {
        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                try {
                    String fileName = UUID.randomUUID() + "-" + image.getOriginalFilename();
                    String filePath = uploadDirPath + fileName;
                    File file = new File(filePath);
                    image.transferTo(file);

                    // ✅ Store relative path in DB for easy access
                    imagePaths.add("/uploads/" + fileName);
                    System.out.println("📷 Image saved: " + filePath);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of("error", "Failed to save image: " + e.getMessage()));
                }
            }
        }
    }

    // ✅ Save product with multiple image URLs
    Product product = new Product();
    product.setTitle(title);
    product.setCategory(category);
    product.setDescription(description);
    product.setLocation(location);
    product.setPrice(price);
    product.setBrand(brand);
    product.setProductCondition(productCondition);
    product.setPhone(phone);
    product.setUser(user.get());
    product.setImageUrls(imagePaths); // ✅ Save all images

    productService.addProduct(product);

    return ResponseEntity.ok(Map.of(
            "message", "✅ Product added successfully!",
            "uploadedImages", imagePaths
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
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        List<Product> matchingProducts = productService.searchProductsByTitle(keyword);
        return ResponseEntity.ok(matchingProducts);
    }
    
    /**
     * Advanced search with filters
     */
    @GetMapping("/search-with-filters")
    public ResponseEntity<List<Product>> searchProductsWithFilters(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        
        List<Product> filteredProducts = productService.searchProductsWithFilters(
                query, category, condition, location, brand, minPrice, maxPrice);
        
        return ResponseEntity.ok(filteredProducts);
    }

    /**
     * Get a product by ID (for detailed product view)
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            Optional<Product> product = productService.getProductById(id);
            if (product.isPresent()) {
                return ResponseEntity.ok(product.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Product not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getProductsByUser(@PathVariable Long userId) {
        try {
            List<Product> userProducts = productService.getProductsByUserId(userId);
            return ResponseEntity.ok(userProducts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get products for user: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable("id") Long id) {
        try {
            // First, check if the product exists
            Optional<Product> productOpt = productService.getProductById(id);
            if (productOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Product with ID " + id + " does not exist."));
            }
            
            productService.deleteProductById(id);
            // Return a proper JSON response
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete product: " + e.getMessage()));
        }
    }
    
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
public ResponseEntity<?> updateProduct(
        @PathVariable Long id,
        @RequestParam("title") String title,
        @RequestParam("category") String category,
        @RequestParam("description") String description,
        @RequestParam("location") String location,
        @RequestParam("price") Double price,
        @RequestParam("brand") String brand,
        @RequestParam("product_condition") String productCondition,
        @RequestParam("phone") String phone,
        @RequestParam(value = "images", required = false) List<MultipartFile> images
) {
    Optional<Product> optionalProduct = productService.getProductById(id);
    if (optionalProduct.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Product not found"));
    }

    Product product = optionalProduct.get();

    // actualizează câmpurile
    product.setTitle(title);
    product.setCategory(category);
    product.setDescription(description);
    product.setLocation(location);
    product.setPrice(price);
    product.setBrand(brand);
    product.setProductCondition(productCondition);
    product.setPhone(phone);

    // dacă trimiți noi imagini, le înlocuim
    if (images != null && !images.isEmpty()) {
        String uploadDirPath = System.getProperty("user.dir") + "/uploads/";
        File uploadDir = new File(uploadDirPath);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        List<String> imagePaths = new ArrayList<>();
        for (MultipartFile image : images) {
            try {
                String fileName = UUID.randomUUID() + "-" + image.getOriginalFilename();
                File file = new File(uploadDirPath + fileName);
                image.transferTo(file);
                imagePaths.add("/uploads/" + fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Failed to save image: " + e.getMessage()));
            }
        }
        product.setImageUrls(imagePaths);
    }

    Product updated = productService.addProduct(product);
    return ResponseEntity.ok(Map.of("message", "Product updated", "product", updated));
}

/**
     * Toggle product active status (disable/enable instead of delete)
     */
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleProductStatus(@PathVariable("id") Long id) {
        try {
            Optional<Product> productOpt = productService.getProductById(id);
            if (productOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Product with ID " + id + " does not exist."));
            }
            
            Product product = productOpt.get();
            boolean newStatus = !product.isActive();
            product.setActive(newStatus);
            productService.addProduct(product); // This will update the existing product
            
            String statusMessage = newStatus ? "enabled" : "disabled";
            return ResponseEntity.ok(Map.of(
                "message", "Product " + statusMessage + " successfully.",
                "active", newStatus
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to toggle product status: " + e.getMessage()));
        }
    }
    

}

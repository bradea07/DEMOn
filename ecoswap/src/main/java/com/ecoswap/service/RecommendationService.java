package com.ecoswap.service;

import com.ecoswap.model.Product;
import com.ecoswap.model.SearchHistory;
import com.ecoswap.model.User;
import com.ecoswap.repository.ProductRepository;
import com.ecoswap.repository.SearchHistoryRepository;
import com.ecoswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.regex.Pattern;

@Service
public class RecommendationService {
    @Autowired
    private SearchHistoryRepository searchHistoryRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
      /**
     * Records a user search to the search history
     */
    public void recordSearch(Long userId, String query, String category, String brand, 
                           String condition, String location, String minPrice, String maxPrice) {
        if (userId == null) {
            return; // Don't record if userId is null
        }
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return; // Don't record if user doesn't exist
        }
        
        User user = userOpt.get();
        SearchHistory searchHistory = new SearchHistory();        searchHistory.setUser(user);
        searchHistory.setQuery(query);
        searchHistory.setCategory(category);
        searchHistory.setBrand(brand);
        searchHistory.setCondition(condition);
        searchHistory.setLocation(location);
        
        if (minPrice != null && !minPrice.isEmpty()) {
            try {
                searchHistory.setMinPrice(Double.parseDouble(minPrice));
            } catch (NumberFormatException e) {
                // Ignore invalid number
            }
        }
        
        if (maxPrice != null && !maxPrice.isEmpty()) {
            try {
                searchHistory.setMaxPrice(Double.parseDouble(maxPrice));
            } catch (NumberFormatException e) {
                // Ignore invalid number
            }
        }
        
        searchHistoryRepository.save(searchHistory);
    }
      /**
     * Generate product recommendations based on user search history
     */
    public List<Product> getRecommendationsForUser(Long userId) {
        if (userId == null) {
            return Collections.emptyList();
        }
        
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return Collections.emptyList(); // Return empty list if user doesn't exist
            }
            
            User user = userOpt.get();
            
            // Get user's recent search history
            List<SearchHistory> searchHistories = searchHistoryRepository.findTop10ByUserOrderByTimestampDesc(user);
            
            if (searchHistories.isEmpty()) {
                return Collections.emptyList(); // Return empty list if no search history
            }
        
        // Extract keywords, categories, and brands from search history
        Set<String> keywords = new HashSet<>();
        Map<String, Integer> categoryFrequency = new HashMap<>();
        Map<String, Integer> brandFrequency = new HashMap<>();
          for (SearchHistory search : searchHistories) {
            // Extract keywords from queries
            if (search.getQuery() != null && !search.getQuery().isEmpty()) {
                Arrays.stream(search.getQuery().toLowerCase().split("\\s+"))
                      .filter(word -> word.length() > 2)
                      .forEach(keywords::add);
            }
            
            // Count categories
            if (search.getCategory() != null && !search.getCategory().isEmpty()) {
                categoryFrequency.put(
                    search.getCategory(), 
                    categoryFrequency.getOrDefault(search.getCategory(), 0) + 1
                );
            }
            
            // Count brands
            if (search.getBrand() != null && !search.getBrand().isEmpty()) {
                brandFrequency.put(
                    search.getBrand(), 
                    brandFrequency.getOrDefault(search.getBrand(), 0) + 1
                );
            }
        }
        
        // Find top category
        String topCategory = categoryFrequency.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
                
        // Find top brand
        String topBrand = brandFrequency.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
                
        // Create search patterns
        List<Product> recommendedProducts = new ArrayList<>();
        
        // Category-based recommendations
        if (topCategory != null) {
            List<Product> categoryProducts = productRepository.findByCategoryOrderByIdDesc(topCategory);
            recommendedProducts.addAll(categoryProducts.stream()
                .filter(product -> !product.getUser().getId().equals(userId))
                .limit(5)
                .collect(Collectors.toList()));
        }
        
        // Brand-based recommendations
        if (topBrand != null) {
            List<Product> brandProducts = productRepository.findByBrandIgnoreCaseOrderByIdDesc(topBrand);
            recommendedProducts.addAll(brandProducts.stream()
                .filter(product -> !product.getUser().getId().equals(userId))
                .limit(5)
                .collect(Collectors.toList()));
        }
          // Keyword-based recommendations
        if (!keywords.isEmpty()) {
            try {
                // Create regex pattern from keywords
                String keywordPattern = String.join("|", keywords);
                Pattern pattern = Pattern.compile(keywordPattern, Pattern.CASE_INSENSITIVE);
                
                // Get all products and filter by keywords
                List<Product> allProducts = productRepository.findAll();
                List<Product> keywordProducts = allProducts.stream()
                    .filter(product -> 
                        (product.getTitle() != null && pattern.matcher(product.getTitle()).find()) ||
                        (product.getDescription() != null && pattern.matcher(product.getDescription()).find()))
                    .filter(product -> !product.getUser().getId().equals(userId))
                    .limit(10)
                    .collect(Collectors.toList());
                    
                recommendedProducts.addAll(keywordProducts);
            } catch (Exception e) {
                // Log the error but continue with other recommendations
                System.err.println("Error generating keyword-based recommendations: " + e.getMessage());
            }
        }
              // Remove duplicates
            return recommendedProducts.stream()
                .distinct()
                .limit(8) // Limit to 8 recommendations
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error generating recommendations: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}

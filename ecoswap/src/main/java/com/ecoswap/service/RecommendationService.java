package com.ecoswap.service;

import com.ecoswap.model.Product;
import com.ecoswap.model.SearchHistory;
import com.ecoswap.model.User;
import com.ecoswap.model.UserRecommendationHistory;
import com.ecoswap.repository.ProductRepository;
import com.ecoswap.repository.SearchHistoryRepository;
import com.ecoswap.repository.UserRepository;
import com.ecoswap.repository.UserRecommendationHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {
    @Autowired
    private SearchHistoryRepository searchHistoryRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserRecommendationHistoryRepository recommendationHistoryRepository;
      // Un factor pentru diversificarea recomandărilor (redus pentru mai multă consistență)
    //private static final double DIVERSIFICATION_FACTOR = 0.15; // 15% șansa de a include produse noi/diverse
    
    // Numărul maxim de recomandări pentru același produs
    private static final int MAX_RECOMMENDATION_REPETITIONS = 5;
    
    // Numărul maxim de recomandări returnate
    private static final int MAX_RECOMMENDATIONS_COUNT = 8;
    
    // Lista de cuvinte comune care să fie ignorate în căutări
    private static final Set<String> STOP_WORDS = new HashSet<>(Arrays.asList(
        "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by", 
        "about", "as", "of", "from", "like", "de", "si", "sau", "în", "pe", "la", "cu", "despre"
    ));
    
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
        SearchHistory searchHistory = new SearchHistory();
        searchHistory.setUser(user);
        searchHistory.setQuery(query);
        searchHistory.setCategory(category);
        searchHistory.setBrand(brand);
        searchHistory.setCondition(condition); // Folosește setCondition, care este mapat la coloana "item_condition"
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
    }    /**
     * Get personalized product recommendations for a user based on search history
     */
    public List<Product> getRecommendationsForUser(Long userId) {
        System.out.println("Generating recommendations for userId: " + userId);
        
        // Validate userId to prevent errors
        if (userId == null) {
            System.out.println("UserId is null, returning random recommendations");
            return getRandomRecommendations(MAX_RECOMMENDATIONS_COUNT);
        }
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            System.out.println("User with ID " + userId + " not found, returning random recommendations");
            return getRandomRecommendations(MAX_RECOMMENDATIONS_COUNT); // Return random recommendations if user doesn't exist
        }
        User user = userOpt.get();
        
        // Verifică mai întâi dacă utilizatorul are deja recomandări în istoric
        List<UserRecommendationHistory> recentRecommendations = 
            recommendationHistoryRepository.findByUserOrderByRecommendedAtDesc(user);
        
        // Colectează produsele din istoricul de recomandări, indiferent de câte sunt
        List<Product> recentProducts = recentRecommendations.stream()
            .map(UserRecommendationHistory::getProduct)
            .distinct()
            .collect(Collectors.toList());
            
        // Obține istoricul de căutare al utilizatorului, ordonat după timestamp (cele mai recente)
        List<SearchHistory> searchHistories = searchHistoryRepository.findByUserOrderByTimestampDesc(user);
        
        // If user has no search history, return random recommendations
        if (searchHistories.isEmpty()) {
            return getRandomRecommendations(MAX_RECOMMENDATIONS_COUNT);
        }
        
        // Collect keywords from user's search history
        Map<String, Integer> keywordFrequency = new HashMap<>();
        for (SearchHistory search : searchHistories) {
            // Process search query terms
            if (search.getQuery() != null && !search.getQuery().isEmpty()) {
                String[] queryTerms = search.getQuery().toLowerCase().split("\\s+");
                for (String term : queryTerms) {
                    if (!isCommonStopWord(term) && term.length() > 2) {
                        keywordFrequency.put(term, keywordFrequency.getOrDefault(term, 0) + 1);
                    }
                }
            }
            
            // Process categories
            if (search.getCategory() != null && !search.getCategory().isEmpty()) {
                keywordFrequency.put(search.getCategory().toLowerCase(), 
                    keywordFrequency.getOrDefault(search.getCategory().toLowerCase(), 0) + 2); // Higher weight for categories
            }
            
            // Process brands
            if (search.getBrand() != null && !search.getBrand().isEmpty()) {
                keywordFrequency.put(search.getBrand().toLowerCase(), 
                    keywordFrequency.getOrDefault(search.getBrand().toLowerCase(), 0) + 2); // Higher weight for brands
            }
        }
          // Sort keywords by frequency (descending)
        List<Map.Entry<String, Integer>> sortedKeywords = keywordFrequency.entrySet()
            .stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .collect(Collectors.toList());
            
        // Introduce some randomness when selecting keywords
        // This ensures different users see slightly different recommendations
        Collections.shuffle(sortedKeywords.subList(
            Math.min(3, sortedKeywords.size()), 
            sortedKeywords.size()
        ));
            
        // Collect recommended products based on top keywords
        Set<Product> recommendedProducts = new HashSet<>();
        int maxKeywordsToUse = Math.min(8, sortedKeywords.size());
        
        for (int i = 0; i < maxKeywordsToUse; i++) {
            String keyword = sortedKeywords.get(i).getKey();
            
            // Find products matching the keyword in title
            List<Product> matchingProducts = productRepository.findByTitleContainingIgnoreCase(keyword);
            recommendedProducts.addAll(matchingProducts);
            
            // Try to find by category if keyword matches a category
            List<Product> categoryProducts = productRepository.findByCategoryOrderByIdDesc(keyword);
            recommendedProducts.addAll(categoryProducts);
            
            // Try to find by brand if keyword matches a brand
            List<Product> brandProducts = productRepository.findByBrandIgnoreCaseOrderByIdDesc(keyword);
            recommendedProducts.addAll(brandProducts);
            
            // Dacă avem deja suficiente produse recomandate, ieșim din buclă
            if (recommendedProducts.size() > MAX_RECOMMENDATIONS_COUNT * 2) {
                break;
            }
        }
          // Add some recent products for diversity
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.WEEK_OF_YEAR, -1); // One week ago
        Date oneWeekAgo = cal.getTime();
        
        // Use a different variable name to avoid conflicts with the earlier recentProducts
        List<Product> newProducts = new ArrayList<>();
        try {
            newProducts = productRepository.findByCreatedAtAfterOrderByCreatedAtDesc(oneWeekAgo);
        } catch (Exception e) {
            System.err.println("Error fetching recent products: " + e.getMessage());
            // Fallback to empty list
            newProducts = new ArrayList<>();
        }
          // Asigură-te că recomandările vechi au prioritate pentru a menține consistența
        // dar adaugă și produse noi bazate pe căutările recente
        List<Product> finalRecommendationsList = new ArrayList<>();
          // Adaugă mai întâi produsele bazate pe keywords (cele mai relevante)
        finalRecommendationsList.addAll(
            recommendedProducts.stream()
            .filter(p -> p.getUser() != null && !p.getUser().getId().equals(userId)) // Exclude produsele utilizatorului
            .limit(MAX_RECOMMENDATIONS_COUNT)
            .collect(Collectors.toList())
        );        // Adaugă produse recente dacă nu avem suficiente
        if (finalRecommendationsList.size() < MAX_RECOMMENDATIONS_COUNT && newProducts != null && !newProducts.isEmpty()) {
            newProducts.stream()
                .filter(p -> p.getUser() != null && !p.getUser().getId().equals(userId)) // Filter out user's own products
                .filter(p -> !finalRecommendationsList.contains(p)) // Filter out products already in recommendations
                .limit(MAX_RECOMMENDATIONS_COUNT - finalRecommendationsList.size())
                .forEach(finalRecommendationsList::add);
        }
        
        // Adaugă produse aleatorii pentru a ajunge la exact MAX_RECOMMENDATIONS_COUNT
        if (finalRecommendationsList.size() < MAX_RECOMMENDATIONS_COUNT) {
            List<Product> randomRecs = getRandomRecommendations(MAX_RECOMMENDATIONS_COUNT - finalRecommendationsList.size(), userId);
            randomRecs.stream()
                .filter(p -> !finalRecommendationsList.contains(p))
                .forEach(finalRecommendationsList::add);
        }
        
        // Limitează la exact MAX_RECOMMENDATIONS_COUNT
        List<Product> limitedRecommendations = finalRecommendationsList;
        if (finalRecommendationsList.size() > MAX_RECOMMENDATIONS_COUNT) {
            limitedRecommendations = finalRecommendationsList.subList(0, MAX_RECOMMENDATIONS_COUNT);
        }
        
        // Apply diversification and update recommendation history
        List<Product> diversifiedRecommendations = diversifyRecommendations(user, limitedRecommendations);
        
        // Asigură-te că returnăm exact MAX_RECOMMENDATIONS_COUNT produse, adăugând produse aleatorii dacă este necesar
        if (diversifiedRecommendations.size() < MAX_RECOMMENDATIONS_COUNT) {
            int remaining = MAX_RECOMMENDATIONS_COUNT - diversifiedRecommendations.size();
            List<Product> additionalRecs = getRandomRecommendations(remaining, userId);
            
            for (Product p : additionalRecs) {
                if (!diversifiedRecommendations.contains(p)) {
                    diversifiedRecommendations.add(p);
                    if (diversifiedRecommendations.size() >= MAX_RECOMMENDATIONS_COUNT) {
                        break;
                    }
                }
            }
        } else if (diversifiedRecommendations.size() > MAX_RECOMMENDATIONS_COUNT) {
            diversifiedRecommendations = diversifiedRecommendations.subList(0, MAX_RECOMMENDATIONS_COUNT);
        }
          // Actualizează istoricul de recomandări pentru toate produsele returnate
        updateUserRecommendationHistory(user, diversifiedRecommendations);
        
        // Final check to ensure we always return exactly MAX_RECOMMENDATIONS_COUNT products
        if (diversifiedRecommendations.size() < MAX_RECOMMENDATIONS_COUNT) {
            int needed = MAX_RECOMMENDATIONS_COUNT - diversifiedRecommendations.size();
            List<Product> finalRandomProducts = getRandomRecommendations(needed * 3, userId);
            
            for (Product p : finalRandomProducts) {
                if (!diversifiedRecommendations.contains(p)) {
                    diversifiedRecommendations.add(p);
                    if (diversifiedRecommendations.size() >= MAX_RECOMMENDATIONS_COUNT) {
                        break;
                    }
                }
            }
        }
        
        // Final limit to ensure we never return more than MAX_RECOMMENDATIONS_COUNT
        if (diversifiedRecommendations.size() > MAX_RECOMMENDATIONS_COUNT) {
            diversifiedRecommendations = diversifiedRecommendations.subList(0, MAX_RECOMMENDATIONS_COUNT);
        }
        
        return diversifiedRecommendations;
    }
    
    /**
     * Check if a word is a common stop word that should be ignored
     */
    private boolean isCommonStopWord(String word) {
        return STOP_WORDS.contains(word.toLowerCase());
    }
      /**
     * Diversify recommendations to avoid showing the same products repeatedly
     * but menține mereu numărul maxim de recomandări
     */
    private List<Product> diversifyRecommendations(User user, List<Product> recommendations) {
        if (recommendations.isEmpty()) {
            return recommendations;
        }
        
        List<UserRecommendationHistory> history = recommendationHistoryRepository.findByUserOrderByRecommendedAtDesc(user);
        Map<Long, Integer> productRecommendationCount = new HashMap<>();
        
        // Build a map of product IDs to recommendation counts
        for (UserRecommendationHistory rec : history) {
            productRecommendationCount.put(rec.getProduct().getId(), rec.getRecommendationCount());
        }
        
        // Filter out products that have been recommended too many times
        List<Product> diversifiedList = recommendations.stream()
            .filter(p -> productRecommendationCount.getOrDefault(p.getId(), 0) < MAX_RECOMMENDATION_REPETITIONS)
            .collect(Collectors.toList());
        
        // Dacă am filtrat prea multe, încercăm să păstrăm numărul exact de recomandări
        int neededProducts = MAX_RECOMMENDATIONS_COUNT - diversifiedList.size();
        if (neededProducts > 0) {
            // Folosește produse din istoricul de recomandări pentru diversificare
            // dar doar cele cu număr mic de recomandări
            List<Product> historyProducts = history.stream()
                .filter(h -> h.getRecommendationCount() < MAX_RECOMMENDATION_REPETITIONS)
                .filter(h -> !diversifiedList.contains(h.getProduct()))
                .map(UserRecommendationHistory::getProduct)
                .distinct()
                .limit(neededProducts)
                .collect(Collectors.toList());
                
            diversifiedList.addAll(historyProducts);
                
            // Dacă tot nu avem suficiente, adaugă produse aleatorii
            int remainingNeeded = neededProducts - historyProducts.size();
            if (remainingNeeded > 0) {
                List<Product> randomProducts = getRandomRecommendations(remainingNeeded, user.getId());
                randomProducts.stream()
                    .filter(p -> !diversifiedList.contains(p))
                    .forEach(diversifiedList::add);
            }
        }
        
        // Asigură-te că returnăm exact MAX_RECOMMENDATIONS_COUNT produse
        if (diversifiedList.size() > MAX_RECOMMENDATIONS_COUNT) {
            return diversifiedList.subList(0, MAX_RECOMMENDATIONS_COUNT);
        }
        
        return diversifiedList;
    }
      /**
     * Get random product recommendations
     */
    public List<Product> getRandomRecommendations(int count) {
        List<Product> allProducts = productRepository.findAll();
        
        if (allProducts.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Use a mix of the current time and a base seed for better randomness
        // while still maintaining some consistency within a short time period
        long timeSeed = System.currentTimeMillis() % (1000 * 60 * 60); // Changes every hour
        Random random = new Random(timeSeed + 12345L);
        
        // Folosește random pentru a amesteca lista
        List<Product> shuffledProducts = new ArrayList<>(allProducts);
        for (int i = shuffledProducts.size() - 1; i > 0; i--) {
            int index = random.nextInt(i + 1);
            // Schimbă elementele
            Product temp = shuffledProducts.get(index);
            shuffledProducts.set(index, shuffledProducts.get(i));
            shuffledProducts.set(i, temp);
        }
        
        // Return up to count products
        return shuffledProducts.stream()
            .limit(count)
            .collect(Collectors.toList());
    }
      /**
     * Get random product recommendations excluding products by a specific user
     */
    public List<Product> getRandomRecommendations(int count, Long excludeUserId) {
        List<Product> allProducts = productRepository.findAll();
        
        if (allProducts.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Mix userId with current time for better randomness 
        // This creates different results for different users while maintaining
        // some consistency for the same user within a short time period
        long timeSeed = System.currentTimeMillis() % (1000 * 60 * 60); // Changes every hour
        long userSeed = excludeUserId != null ? excludeUserId : 12345L;
        Random random = new Random((timeSeed + userSeed) % Integer.MAX_VALUE);
          // Filter out products by the excluded user
        List<Product> filteredProducts = allProducts.stream()
            .filter(p -> p.getUser() != null && (excludeUserId == null || !excludeUserId.equals(p.getUser().getId())))
            .collect(Collectors.toList());
        
        // Folosește random pentru a amesteca lista
        for (int i = filteredProducts.size() - 1; i > 0; i--) {
            int index = random.nextInt(i + 1);
            // Schimbă elementele
            Product temp = filteredProducts.get(index);
            filteredProducts.set(index, filteredProducts.get(i));
            filteredProducts.set(i, temp);
        }
        
        // Return up to count products
        return filteredProducts.stream()
            .limit(count)
            .collect(Collectors.toList());
    }
    
    /**
     * Update the user recommendation history with newly recommended products
     */
    private void updateUserRecommendationHistory(User user, List<Product> recommendedProducts) {
        for (Product product : recommendedProducts) {
            Optional<UserRecommendationHistory> existingRec = 
                recommendationHistoryRepository.findByUserAndProduct(user, product);
            
            if (existingRec.isPresent()) {
                // Update existing record
                UserRecommendationHistory rec = existingRec.get();
                rec.incrementCount();
                recommendationHistoryRepository.save(rec);
            } else {
                // Create new record
                UserRecommendationHistory newRec = new UserRecommendationHistory(user, product);
                recommendationHistoryRepository.save(newRec);
            }
        }
    }
}

package com.ecoswap.service;

import com.ecoswap.dto.FavoriteDTO;
import com.ecoswap.model.Favorite;
import com.ecoswap.model.User;
import com.ecoswap.model.Product;
import com.ecoswap.repository.FavoriteRepository;
import com.ecoswap.repository.UserRepository;
import com.ecoswap.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final NotificationService notificationService;

    public FavoriteService(FavoriteRepository favoriteRepository, 
                          UserRepository userRepository, 
                          ProductRepository productRepository,
                          NotificationService notificationService) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.notificationService = notificationService;
    }

    public List<FavoriteDTO> getUserFavorites(Long userId) {
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        return favorites.stream()
                .map(FavoriteDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public FavoriteDTO addToFavorites(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if already favorited
        if (favoriteRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new RuntimeException("Product is already in favorites");
        }

        // Don't allow users to favorite their own products
        if (product.getUser().getId().equals(userId)) {
            throw new RuntimeException("Cannot favorite your own product");
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setProduct(product);
        
        Favorite savedFavorite = favoriteRepository.save(favorite);        // Create notification for the product owner
        notificationService.createProductFavoritedNotification(
            product.getUser().getId(),
            userId,
            product
        );

        return new FavoriteDTO(savedFavorite);
    }

    @Transactional
    public void removeFromFavorites(Long userId, Long productId) {
        if (!favoriteRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new RuntimeException("Product is not in favorites");
        }
        
        favoriteRepository.deleteByUserIdAndProductId(userId, productId);
    }

    public boolean isFavorited(Long userId, Long productId) {
        return favoriteRepository.existsByUserIdAndProductId(userId, productId);
    }
}

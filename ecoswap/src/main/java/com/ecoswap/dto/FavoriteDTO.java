package com.ecoswap.dto;

import com.ecoswap.model.Favorite;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteDTO {
    private Long id;
    private Long userId;
    private Long productId;
    private String productTitle;
    private String productImageUrl;
    private Double productPrice;
    private LocalDateTime createdAt;

    public FavoriteDTO(Favorite favorite) {
        this.id = favorite.getId();
        this.userId = favorite.getUser().getId();
        this.productId = favorite.getProduct().getId();
        this.productTitle = favorite.getProduct().getTitle();
        this.productPrice = favorite.getProduct().getPrice();
        this.createdAt = favorite.getCreatedAt();
        
        // Get first image URL if available
        if (favorite.getProduct().getImageUrls() != null && !favorite.getProduct().getImageUrls().isEmpty()) {
            this.productImageUrl = favorite.getProduct().getImageUrls().get(0);
        }
    }
}

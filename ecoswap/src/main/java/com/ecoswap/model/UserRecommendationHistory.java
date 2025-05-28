package com.ecoswap.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "user_recommendation_history")
public class UserRecommendationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "recommended_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date recommendedAt;

    @Column(name = "recommendation_count")
    private int recommendationCount;

    // Constructors
    public UserRecommendationHistory() {
    }

    public UserRecommendationHistory(User user, Product product) {
        this.user = user;
        this.product = product;
        this.recommendedAt = new Date();
        this.recommendationCount = 1;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Date getRecommendedAt() {
        return recommendedAt;
    }

    public void setRecommendedAt(Date recommendedAt) {
        this.recommendedAt = recommendedAt;
    }

    public int getRecommendationCount() {
        return recommendationCount;
    }

    public void setRecommendationCount(int recommendationCount) {
        this.recommendationCount = recommendationCount;
    }

    public void incrementCount() {
        this.recommendationCount++;
        this.recommendedAt = new Date(); // Update timestamp
    }
}

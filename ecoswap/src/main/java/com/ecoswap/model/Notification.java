package com.ecoswap.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // The user who will receive the notification
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "trigger_user_id", nullable = false)
    private User triggerUser; // The user who triggered the notification
    
    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private NotificationType type;
    
    @Column(nullable = false, length = 500)
    private String message;
      @Column(name = "is_read", nullable = false)
    @JsonProperty("read")
    private Boolean isRead = false;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;
    
    @Column(name = "rating_score")
    private Integer ratingScore;
    
    // Constructors
    public Notification() {}
    
    public Notification(User user, User triggerUser, NotificationType type, String message) {
        this.user = user;
        this.triggerUser = triggerUser;
        this.type = type;
        this.message = message;
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }
    
    public Notification(User user, User triggerUser, NotificationType type, String message, Product product) {
        this(user, triggerUser, type, message);
        this.product = product;
    }
    
    public Notification(User user, User triggerUser, NotificationType type, String message, Integer ratingScore) {
        this(user, triggerUser, type, message);
        this.ratingScore = ratingScore;
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
    
    public User getTriggerUser() {
        return triggerUser;
    }
    
    public void setTriggerUser(User triggerUser) {
        this.triggerUser = triggerUser;
    }
    
    public NotificationType getType() {
        return type;
    }
    
    public void setType(NotificationType type) {
        this.type = type;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public Boolean getIsRead() {
        return isRead;
    }
    
    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Product getProduct() {
        return product;
    }
    
    public void setProduct(Product product) {
        this.product = product;
    }
    
    public Integer getRatingScore() {
        return ratingScore;
    }
    
    public void setRatingScore(Integer ratingScore) {
        this.ratingScore = ratingScore;
    }
    
    // Enum for notification types
    public enum NotificationType {
        PRODUCT_FAVORITED,
        NEW_MESSAGE,
        RATING_RECEIVED
    }
}

package com.ecoswap.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String category;
    private String description;
    private String location;
    private Double price;
    private String brand;
    private String productCondition;
    private String phone;

    // Add timestamp field to track when products were created
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    // Add field to track if product is active/enabled (not deleted)
    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ✅ Store multiple image URLs
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;
    
    // Auto-initialize creation date for new products
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = new Date();
        }
    }

    // ✅ Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getProductCondition() { return productCondition; }
    public void setProductCondition(String productCondition) { this.productCondition = productCondition; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Date getCreatedAt() { return createdAt; }  // ✅ Get product creation timestamp
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }  // ✅ Set product creation timestamp

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<String> getImageUrls() { return imageUrls; }  // ✅ Store multiple images
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}

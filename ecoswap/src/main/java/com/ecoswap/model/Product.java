package com.ecoswap.model;

import jakarta.persistence.*;

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
    private String brand;  // ✅ Add brand
    private String productCondition; // ✅ Add productCondition

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // ✅ Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {  // ✅ Ensure price is a Double
        this.price = price;
    }

    public String getBrand() {  // ✅ New Getter
        return brand;
    }

    public void setBrand(String brand) {  // ✅ New Setter
        this.brand = brand;
    }

    public String getProductCondition() {  // ✅ New Getter
        return productCondition;
    }

    public void setProductCondition(String productCondition) {  // ✅ New Setter
        this.productCondition = productCondition;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

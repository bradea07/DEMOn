package com.ecoswap.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "search_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SearchHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column
    private String query;
    
    @Column
    private String category;
    
    @Column
    private String brand;
    
    @Column(name = "item_condition")
    private String condition;
    
    @Column
    private String location;
    
    @Column
    private Double minPrice;
    
    @Column
    private Double maxPrice;
    
    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}

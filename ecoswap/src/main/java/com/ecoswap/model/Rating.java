 package com.ecoswap.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// Entity representing a rating given by a user to a seller
@Entity
@Table(name = "ratings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;
    
    @ManyToOne
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;
    
    @Column(name = "rater_id")
    private Long raterId;

    @Column(nullable = false)
    private Integer score;

    @Column(length = 1000)
    private String comment;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false, name = "is_active")
    private boolean active = true;
    
    // Field to mark inappropriate ratings
    @Column(nullable = false)
    private boolean flagged = false;
    
    // Field to indicate if this rating has been reviewed by admin
    @Column(nullable = false)
    private boolean reviewed = false;
    
    // Field to indicate if this rating has been verified (e.g., tied to a transaction)
    @Column(nullable = false)
    private boolean verified = true;
    
    // Field to store shipment tracking ID
    @Column(name = "shipment_tracking_id")
    private String shipmentTrackingId;
    
    // Field to store the selected delivery option
    @Column(name = "selected_delivery_option")
    private String selectedDeliveryOption;
    
    // Field to indicate if delivery has been confirmed
    @Column(nullable = false)
    private boolean deliveryConfirmed = false;
}

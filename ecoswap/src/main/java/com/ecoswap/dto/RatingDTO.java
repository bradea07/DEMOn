package com.ecoswap.dto;

import com.ecoswap.model.Rating;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RatingDTO {
    private Long id;
    private Long sellerId;
    private Long reviewerId;    private Long raterId; 
    private String reviewerUsername;
    private Integer score;
    private String comment;
    private LocalDateTime createdAt;
    private boolean active;
    private String shipmentTrackingId;
    private String selectedDeliveryOption;
    private boolean deliveryConfirmed;

    public RatingDTO(Rating rating) {
        this.id = rating.getId();
        if (rating.getSeller() != null) {
            this.sellerId = rating.getSeller().getId();
        }
        if (rating.getReviewer() != null) {
            this.reviewerId = rating.getReviewer().getId();
            this.reviewerUsername = rating.getReviewer().getUsername();
        }
        this.raterId = rating.getRaterId();        this.score = rating.getScore();
        this.comment = rating.getComment();
        this.createdAt = rating.getCreatedAt();
        this.active = rating.isActive();
        this.shipmentTrackingId = rating.getShipmentTrackingId();
        this.selectedDeliveryOption = rating.getSelectedDeliveryOption();
        this.deliveryConfirmed = rating.isDeliveryConfirmed();
    }
}

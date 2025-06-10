package com.ecoswap.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipping_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Transaction details
    private String transactionNumber;
    private String amount;
    private String currency;
    private LocalDateTime createdAt;
    
    // Shipment details
    private String shipmentId;
    private String rateId;
    private String provider;
    private String service;
    private Integer estimatedDays;
    
    // Sender details
    private String fromName;
    private String fromStreet;
    private String fromCity;
    private String fromState;
    private String fromZip;
    private String fromCountry;
    private String fromPhone;
    private String fromEmail;
    
    // Recipient details
    private String toName;
    private String toStreet;
    private String toCity;
    private String toState;
    private String toZip;
    private String toCountry;
    private String toPhone;
    private String toEmail;
    
    // Parcel details
    private String parcelLength;
    private String parcelWidth;
    private String parcelHeight;
    private String parcelWeight;
}
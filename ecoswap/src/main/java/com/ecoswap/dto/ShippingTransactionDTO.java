package com.ecoswap.dto;

import com.ecoswap.model.ShippingTransaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingTransactionDTO {
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
    
    public ShippingTransactionDTO(ShippingTransaction shippingTransaction) {
        this.id = shippingTransaction.getId();
        this.transactionNumber = shippingTransaction.getTransactionNumber();
        this.amount = shippingTransaction.getAmount();
        this.currency = shippingTransaction.getCurrency();
        this.createdAt = shippingTransaction.getCreatedAt();
        this.shipmentId = shippingTransaction.getShipmentId();
        this.rateId = shippingTransaction.getRateId();
        this.provider = shippingTransaction.getProvider();
        this.service = shippingTransaction.getService();
        this.estimatedDays = shippingTransaction.getEstimatedDays();
        this.fromName = shippingTransaction.getFromName();
        this.fromStreet = shippingTransaction.getFromStreet();
        this.fromCity = shippingTransaction.getFromCity();
        this.fromState = shippingTransaction.getFromState();
        this.fromZip = shippingTransaction.getFromZip();
        this.fromCountry = shippingTransaction.getFromCountry();
        this.fromPhone = shippingTransaction.getFromPhone();
        this.fromEmail = shippingTransaction.getFromEmail();
        this.toName = shippingTransaction.getToName();
        this.toStreet = shippingTransaction.getToStreet();
        this.toCity = shippingTransaction.getToCity();
        this.toState = shippingTransaction.getToState();
        this.toZip = shippingTransaction.getToZip();
        this.toCountry = shippingTransaction.getToCountry();
        this.toPhone = shippingTransaction.getToPhone();
        this.toEmail = shippingTransaction.getToEmail();
        this.parcelLength = shippingTransaction.getParcelLength();
        this.parcelWidth = shippingTransaction.getParcelWidth();
        this.parcelHeight = shippingTransaction.getParcelHeight();
        this.parcelWeight = shippingTransaction.getParcelWeight();
    }
}
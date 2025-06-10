package com.ecoswap.repository;

import com.ecoswap.model.ShippingTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShippingTransactionRepository extends JpaRepository<ShippingTransaction, Long> {
    // Find shipping transaction by shipment ID
    ShippingTransaction findByShipmentId(String shipmentId);
    
    // Find shipping transactions by from email
    java.util.List<ShippingTransaction> findByFromEmail(String fromEmail);
    
    // Find shipping transactions by to email
    java.util.List<ShippingTransaction> findByToEmail(String toEmail);
}
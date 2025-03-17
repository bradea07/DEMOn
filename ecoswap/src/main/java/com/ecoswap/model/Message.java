package com.ecoswap.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @ManyToOne  // ✅ Added Product Relationship
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private String content;
    private LocalDateTime timestamp = LocalDateTime.now(); // Auto-assign timestamp

    // ✅ Getter for Sender ID
    public Long getSenderId() {
        return sender != null ? sender.getId() : null;
    }

    // ✅ Getter for Receiver ID
    public Long getReceiverId() {
        return receiver != null ? receiver.getId() : null;
    }

    // ✅ Getter for Product ID
    public Long getProductId() {
        return product != null ? product.getId() : null;
    }
}

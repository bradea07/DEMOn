package com.ecoswap.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import com.ecoswap.model.User;
import com.ecoswap.model.Product;

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
    private User sender;    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;
    
    @ManyToOne  // ✅ Added Product Relationship
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    private String content;
    private LocalDateTime timestamp = LocalDateTime.now(); // Auto-assign timestamp
    private boolean isRead = false; // Flag to track if a message has been read

    // ✅ Getter for Sender ID
    public Long getSenderId() {
        return sender != null ? sender.getId() : null;
    }

    // ✅ Getter for Receiver ID
    public Long getReceiverId() {
        return receiver != null ? receiver.getId() : null;
    }    // ✅ Getter for Product ID
    public Long getProductId() {
        return product != null ? product.getId() : null;
    }
    
    // Getter for isRead field
    public boolean isRead() {
        return isRead;
    }
    
    // Setter for isRead field
    public void setRead(boolean isRead) {
        this.isRead = isRead;
    }
}

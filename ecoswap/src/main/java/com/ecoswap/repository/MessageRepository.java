package com.ecoswap.repository;

import com.ecoswap.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE m.product.id = :productId")
    List<Message> findByProductId(@Param("productId") Long productId);

    // ✅ corect: accesează id-urile nested
    List<Message> findBySender_IdOrReceiver_Id(Long senderId, Long receiverId);
    
    // Find unread messages for a specific user
    List<Message> findByReceiver_IdAndIsReadFalse(Long receiverId);
    
    // Find unread messages between two users for a specific product
    List<Message> findByReceiver_IdAndSender_IdAndProduct_IdAndIsReadFalse(
        Long receiverId, Long senderId, Long productId);
        
    // Mark messages as read for a conversation
    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.isRead = true WHERE m.receiver.id = :receiverId AND m.sender.id = :senderId AND m.product.id = :productId AND m.isRead = false")
    void markMessagesAsRead(@Param("receiverId") Long receiverId, @Param("senderId") Long senderId, @Param("productId") Long productId);
}

package com.ecoswap.repository;

import com.ecoswap.model.Notification;
import com.ecoswap.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Find all notifications for a specific user, ordered by creation date (newest first)
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    
    // Find all unread notifications for a specific user
    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);
    
    // Count unread notifications for a specific user
    Long countByUserAndIsReadFalse(User user);
    
    // Mark a notification as read
@Modifying(clearAutomatically = true, flushAutomatically = true)
@Transactional
@Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :notificationId")
void markAsRead(@Param("notificationId") Long notificationId);    // Mark all notifications as read for a specific user
  @Modifying(clearAutomatically = true, flushAutomatically = true)
@Transactional
@Query("UPDATE Notification n SET n.isRead = true WHERE n.user = :user AND n.isRead = false")
void markAllAsReadForUser(@Param("user") User user);

    
    // Delete old notifications (older than 30 days)
    @Modifying
    @Transactional
    @Query("DELETE FROM Notification n WHERE n.createdAt < :cutoffDate")
    void deleteOldNotifications(@Param("cutoffDate") java.time.LocalDateTime cutoffDate);
}

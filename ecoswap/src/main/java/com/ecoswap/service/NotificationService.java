package com.ecoswap.service;

import com.ecoswap.model.Notification;
import com.ecoswap.model.Notification.NotificationType;
import com.ecoswap.model.Product;
import com.ecoswap.model.User;
import com.ecoswap.repository.NotificationRepository;
import com.ecoswap.repository.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    @PersistenceContext
private EntityManager entityManager;

    // Create a notification when a product is favorited
    public void createProductFavoritedNotification(Long productOwnerId, Long favoriterUserId, Product product) {
        try {
            Optional<User> productOwner = userRepository.findById(productOwnerId);
            Optional<User> favoriter = userRepository.findById(favoriterUserId);
            
            if (productOwner.isPresent() && favoriter.isPresent()) {
                // Don't notify if user favorites their own product
                if (!productOwnerId.equals(favoriterUserId)) {
                    String message = String.format("%s added your product \"%s\" to their favorites", 
                                                 favoriter.get().getUsername(), 
                                                 product.getTitle());
                    
                    Notification notification = new Notification(
                        productOwner.get(),
                        favoriter.get(),
                        NotificationType.PRODUCT_FAVORITED,
                        message,
                        product
                    );
                    
                    notificationRepository.save(notification);
                }
            }
        } catch (Exception e) {
            System.err.println("Error creating product favorited notification: " + e.getMessage());
        }
    }
    
    // Create a notification when a new message is received
    public void createNewMessageNotification(Long receiverId, Long senderId, Product product) {
        try {
            Optional<User> receiver = userRepository.findById(receiverId);
            Optional<User> sender = userRepository.findById(senderId);
            
            if (receiver.isPresent() && sender.isPresent()) {
                String message = String.format("%s sent you a message about \"%s\"", 
                                             sender.get().getUsername(), 
                                             product.getTitle());
                
                Notification notification = new Notification(
                    receiver.get(),
                    sender.get(),
                    NotificationType.NEW_MESSAGE,
                    message,
                    product
                );
                
                notificationRepository.save(notification);
            }
        } catch (Exception e) {
            System.err.println("Error creating new message notification: " + e.getMessage());
        }
    }
    
    // Create a notification when a rating is received
    public void createRatingReceivedNotification(Long ratedUserId, Long raterUserId, Integer ratingScore) {
        try {
            Optional<User> ratedUser = userRepository.findById(ratedUserId);
            Optional<User> rater = userRepository.findById(raterUserId);
            
            if (ratedUser.isPresent() && rater.isPresent()) {
                String message = String.format("%s gave you a %d-star rating", 
                                             rater.get().getUsername(), 
                                             ratingScore);
                
                Notification notification = new Notification(
                    ratedUser.get(),
                    rater.get(),
                    NotificationType.RATING_RECEIVED,
                    message,
                    ratingScore
                );
                
                notificationRepository.save(notification);
            }
        } catch (Exception e) {
            System.err.println("Error creating rating received notification: " + e.getMessage());
        }
    }
    
    // Get all notifications for a user
    public List<Notification> getNotificationsForUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return notificationRepository.findByUserOrderByCreatedAtDesc(user.get());
        }
        return List.of();
    }
    
    // Get unread notifications for a user
    public List<Notification> getUnreadNotificationsForUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user.get());
        }
        return List.of();
    }
    
    // Get count of unread notifications for a user
    public Long getUnreadNotificationCount(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return notificationRepository.countByUserAndIsReadFalse(user.get());
        }
        return 0L;
    }
      @Transactional
   public void markNotificationAsRead(Long notificationId) {
    try {
        Notification n = entityManager.find(Notification.class, notificationId);
        if (n != null) {
            n.setIsRead(true);
            entityManager.merge(n);
            entityManager.flush(); // Force immediate database update
        }
    } catch (Exception e) {
        System.err.println("Error marking notification as read: " + e.getMessage());
    }
}

@Transactional
public void markAllNotificationsAsRead(Long userId) {
    try {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            notificationRepository.markAllAsReadForUser(user.get());
            entityManager.flush(); // Force immediate database update
        }
    } catch (Exception e) {
        System.err.println("Error marking all notifications as read: " + e.getMessage());
    }
}


    
    // Delete a specific notification
    public void deleteNotification(Long notificationId) {
        try {
            notificationRepository.deleteById(notificationId);
        } catch (Exception e) {
            System.err.println("Error deleting notification: " + e.getMessage());
        }
    }

    // Clean up old notifications (can be called periodically)
    public void cleanupOldNotifications() {
        try {
            LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
            notificationRepository.deleteOldNotifications(cutoffDate);
        } catch (Exception e) {
            System.err.println("Error cleaning up old notifications: " + e.getMessage());
        }
    }
}

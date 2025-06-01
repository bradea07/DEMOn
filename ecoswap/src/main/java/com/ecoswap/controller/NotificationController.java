package com.ecoswap.controller;

import com.ecoswap.model.Notification;
import com.ecoswap.model.Product;
import com.ecoswap.service.NotificationService;
import com.ecoswap.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private ProductService productService;
    
    // Get all notifications for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable Long userId) {
        try {
            List<Notification> notifications = notificationService.getNotificationsForUser(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            System.err.println("Error fetching notifications: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }
    
    // Get unread notifications for a user
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable Long userId) {
        try {
            List<Notification> notifications = notificationService.getUnreadNotificationsForUser(userId);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            System.err.println("Error fetching unread notifications: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }
    
    // Get count of unread notifications for a user
    @GetMapping("/user/{userId}/unread/count")
    public ResponseEntity<Map<String, Long>> getUnreadNotificationCount(@PathVariable Long userId) {
        try {
            Long count = notificationService.getUnreadNotificationCount(userId);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            System.err.println("Error fetching unread notification count: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body(Map.of("count", 0L));
        }
    }
    
    // Get count of unread notifications for a user (alternative endpoint for navbar)
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> getUnreadNotificationCountSimple(@PathVariable Long userId) {
        try {
            Long count = notificationService.getUnreadNotificationCount(userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            System.err.println("Error fetching unread notification count: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0L);
        }
    }
      // Get unread notification count for a user (alternative endpoint - returns integer)
    @GetMapping("/unread/{userId}")
    public ResponseEntity<Integer> getUnreadNotificationCountInteger(@PathVariable Long userId) {
        try {
            List<Notification> unreadNotifications = notificationService.getUnreadNotificationsForUser(userId);
            return ResponseEntity.ok(unreadNotifications.size());
        } catch (Exception e) {
            System.err.println("Error fetching unread notification count: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0);
        }
    }
    
    // Mark a specific notification as read
    @PostMapping("/{notificationId}/mark-read")
    public ResponseEntity<Map<String, String>> markNotificationAsRead(@PathVariable Long notificationId) {
        try {
            notificationService.markNotificationAsRead(notificationId);
            return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
        } catch (Exception e) {
            System.err.println("Error marking notification as read: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body(Map.of("error", "Failed to mark notification as read"));
        }
    }
    
    // Mark all notifications as read for a user
    @PostMapping("/user/{userId}/mark-all-read")
    public ResponseEntity<Map<String, String>> markAllNotificationsAsRead(@PathVariable Long userId) {
        try {
            notificationService.markAllNotificationsAsRead(userId);
            return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
        } catch (Exception e) {
            System.err.println("Error marking all notifications as read: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body(Map.of("error", "Failed to mark all notifications as read"));
        }
    }    // Test endpoint for creating a product favorited notification
    @PostMapping("/test/product-favorited")
    public ResponseEntity<Map<String, String>> testProductFavoritedNotification(
            @RequestParam Long productOwnerId,
            @RequestParam Long favoriterUserId,
            @RequestParam Long productId) {
        try {
            // Get the Product entity from ProductService
            Optional<Product> productOpt = productService.getProductById(productId);
            if (productOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Product with ID " + productId + " not found"));
            }
            
            notificationService.createProductFavoritedNotification(productOwnerId, favoriterUserId, productOpt.get());
            return ResponseEntity.ok(Map.of("message", "Test product favorited notification created successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body(Map.of("error", "Failed to create test notification: " + e.getMessage()));
        }
    }
      // Test endpoint to create a rating notification
    @PostMapping("/test/rating-received")
    public ResponseEntity<Map<String, String>> testRatingReceivedNotification(
            @RequestParam Long recipientUserId,
            @RequestParam(required = false) Long raterUserId,
            @RequestParam int ratingScore) {
        try {
            // For anonymous ratings, use null for raterUserId (will be handled by service)
            notificationService.createRatingReceivedNotification(recipientUserId, raterUserId, ratingScore);
            return ResponseEntity.ok(Map.of("message", "Test rating notification created successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body(Map.of("error", "Failed to create test rating notification: " + e.getMessage()));
        }
    }
      // Test endpoint to create a message notification
    @PostMapping("/test/new-message")
    public ResponseEntity<Map<String, String>> testNewMessageNotification(
            @RequestParam Long recipientUserId,
            @RequestParam Long senderUserId,
            @RequestParam Long productId) {
        try {
            // Get the Product entity from ProductService
            Optional<Product> productOpt = productService.getProductById(productId);
            if (productOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Product with ID " + productId + " not found"));
            }
            
            notificationService.createNewMessageNotification(recipientUserId, senderUserId, productOpt.get());
            return ResponseEntity.ok(Map.of("message", "Test message notification created successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                               .body(Map.of("error", "Failed to create test message notification: " + e.getMessage()));
        }
    }
}

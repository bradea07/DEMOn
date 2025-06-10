package com.ecoswap.controller;

import com.ecoswap.model.Message;
import com.ecoswap.model.Product;
import com.ecoswap.model.User;
import com.ecoswap.repository.MessageRepository;
import com.ecoswap.repository.ProductRepository;
import com.ecoswap.repository.UserRepository;
import com.ecoswap.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

public class MessageControllerTest {

    @InjectMocks
    private MessageController messageController;

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private NotificationService notificationService;

    private User sender;
    private User receiver;
    private Product product;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        sender = new User();
        sender.setId(1L);
        receiver = new User();
        receiver.setId(2L);
        product = new Product();
        product.setId(3L);
    }

    @Test
    public void testSendMessage_Success() {
        Message msg = new Message();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setProduct(product);

        when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
        when(userRepository.findById(2L)).thenReturn(Optional.of(receiver));
        when(productRepository.findById(3L)).thenReturn(Optional.of(product));

        ResponseEntity<?> response = messageController.sendMessage(msg);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("Message sent successfully.", response.getBody());
    }

    @Test
    public void testSendMessage_InvalidUsers() {
        Message msg = new Message();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setProduct(product);

        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = messageController.sendMessage(msg);
        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    public void testGetMessagesByProduct_NoMessages() {
        when(messageRepository.findByProductId(5L)).thenReturn(List.of());
        ResponseEntity<List<Message>> response = messageController.getMessagesByProduct(5L);
        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    public void testGetMessagesByProduct_Success() {
        when(messageRepository.findByProductId(5L)).thenReturn(List.of(new Message()));
        ResponseEntity<List<Message>> response = messageController.getMessagesByProduct(5L);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    public void testCountUnreadMessages_UserValid() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(receiver));
        when(messageRepository.findByReceiver_IdAndIsReadFalse(2L)).thenReturn(List.of(new Message(), new Message()));

        ResponseEntity<Integer> response = messageController.countUnreadMessages(2L);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(2, response.getBody());
    }

    @Test
    public void testCountUnreadMessages_InvalidUser() {
        when(userRepository.findById(2L)).thenReturn(Optional.empty());
        ResponseEntity<Integer> response = messageController.countUnreadMessages(2L);
        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    public void testMarkMessagesAsRead_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
        when(userRepository.findById(2L)).thenReturn(Optional.of(receiver));
        when(productRepository.findById(3L)).thenReturn(Optional.of(product));

        ResponseEntity<?> response = messageController.markMessagesAsRead(1L, 2L, 3L);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("Messages marked as read", response.getBody());
    }

    @Test
    public void testMarkMessagesAsRead_InvalidParams() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        ResponseEntity<?> response = messageController.markMessagesAsRead(1L, 2L, 3L);
        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    public void testCountUnreadMessagesForConversation_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
        when(userRepository.findById(2L)).thenReturn(Optional.of(receiver));
        when(productRepository.findById(3L)).thenReturn(Optional.of(product));

        when(messageRepository.findByReceiver_IdAndSender_IdAndProduct_IdAndIsReadFalse(1L, 2L, 3L))
            .thenReturn(List.of(new Message()));

        ResponseEntity<Integer> response = messageController.countUnreadMessagesForConversation(1L, 2L, 3L);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody());
    }

    @Test
    public void testCountUnreadMessagesForConversation_Invalid() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        ResponseEntity<Integer> response = messageController.countUnreadMessagesForConversation(1L, 2L, 3L);
        assertEquals(400, response.getStatusCode().value());
    }

@Test
public void testGetConversationsForUser_Success() {
    Message m1 = new Message();
    m1.setSender(sender);
    m1.setReceiver(receiver);
    m1.setProduct(product);
    m1.setTimestamp(LocalDateTime.now().minusMinutes(5));

    Message m2 = new Message();
    m2.setSender(receiver);
    m2.setReceiver(sender);
    m2.setProduct(product);
    m2.setTimestamp(LocalDateTime.now());

    when(messageRepository.findBySender_IdOrReceiver_Id(1L, 1L))
        .thenReturn(List.of(m1, m2));

    ResponseEntity<?> response = messageController.getConversationsForUser(1L);
    assertEquals(200, response.getStatusCode().value());

    List<?> body = (List<?>) response.getBody();
    assertEquals(1, body.size()); // doar o conversație
}


@Test
public void testSendMessage_ProductInvalid() {
    Message msg = new Message();
    msg.setSender(sender);
    msg.setReceiver(receiver);
    msg.setProduct(product);

    when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
    when(userRepository.findById(2L)).thenReturn(Optional.of(receiver));
    when(productRepository.findById(3L)).thenReturn(Optional.empty());

    ResponseEntity<?> response = messageController.sendMessage(msg);
    assertEquals(400, response.getStatusCode().value());
}


@Test
public void testCountUnreadMessagesForConversation_Exception() {
    when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
    when(userRepository.findById(2L)).thenReturn(Optional.of(receiver));
    when(productRepository.findById(3L)).thenReturn(Optional.of(product));
    when(messageRepository.findByReceiver_IdAndSender_IdAndProduct_IdAndIsReadFalse(1L, 2L, 3L))
        .thenThrow(new RuntimeException("fail"));

    ResponseEntity<Integer> response = messageController.countUnreadMessagesForConversation(1L, 2L, 3L);
    assertEquals(500, response.getStatusCode().value());
    assertEquals(0, response.getBody());
}


@Test
public void testCountUnreadMessages_Exception() {
    when(userRepository.findById(2L)).thenReturn(Optional.of(receiver));
    when(messageRepository.findByReceiver_IdAndIsReadFalse(2L)).thenThrow(new RuntimeException("fail"));

    ResponseEntity<Integer> response = messageController.countUnreadMessages(2L);
    assertEquals(500, response.getStatusCode().value());
    assertEquals(0, response.getBody());
}


@Test
public void testMarkMessagesAsRead_Exception() {
    when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
    when(userRepository.findById(2L)).thenReturn(Optional.of(receiver));
    when(productRepository.findById(3L)).thenReturn(Optional.of(product));
    doThrow(new RuntimeException("fail")).when(messageRepository).markMessagesAsRead(anyLong(), anyLong(), anyLong());

    ResponseEntity<?> response = messageController.markMessagesAsRead(1L, 2L, 3L);
    assertEquals(500, response.getStatusCode().value());
}

@Test
public void testMarkMessagesAsRead_ProductInvalid() {
    when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
    when(userRepository.findById(2L)).thenReturn(Optional.of(receiver));
    when(productRepository.findById(3L)).thenReturn(Optional.empty());

    ResponseEntity<?> response = messageController.markMessagesAsRead(1L, 2L, 3L);
    assertEquals(400, response.getStatusCode().value());
}

@Test
public void testSendMessage_InternalError() {
    Message msg = new Message();
    msg.setSender(sender);
    msg.setReceiver(receiver);
    msg.setProduct(product);

    when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
    when(userRepository.findById(2L)).thenReturn(Optional.of(receiver));
    when(productRepository.findById(3L)).thenReturn(Optional.of(product));
    doThrow(new RuntimeException("fail")).when(messageRepository).save(any());

    ResponseEntity<?> response = messageController.sendMessage(msg);
    assertEquals(500, response.getStatusCode().value());
    assertTrue(response.getBody().toString().contains("Error sending message"));
}



}

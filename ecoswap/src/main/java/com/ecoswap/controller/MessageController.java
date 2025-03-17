package com.ecoswap.controller;

import com.ecoswap.model.Message;
import com.ecoswap.model.Product;
import com.ecoswap.model.User;
import com.ecoswap.repository.MessageRepository;
import com.ecoswap.repository.ProductRepository;
import com.ecoswap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/messages")
@CrossOrigin(origins = "http://localhost:3000") // ✅ Allow frontend requests
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // ✅ Send a message
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Message message) {
        Optional<User> sender = userRepository.findById(message.getSender().getId());
        Optional<User> receiver = userRepository.findById(message.getReceiver().getId());
        Optional<Product> product = productRepository.findById(message.getProduct().getId());

        if (sender.isEmpty() || receiver.isEmpty() || product.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid sender, receiver, or product.");
        }

        message.setSender(sender.get());
        message.setReceiver(receiver.get());
        message.setProduct(product.get());
        messageRepository.save(message);

        return ResponseEntity.ok("Message sent successfully.");
    }

    // ✅ Get messages for a product
    @GetMapping("/product/{productId}")
public ResponseEntity<List<Message>> getMessagesByProduct(@PathVariable Long productId) {
    List<Message> messages = messageRepository.findByProductId(productId);
    if (messages.isEmpty()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
    return ResponseEntity.ok(messages);
}

}

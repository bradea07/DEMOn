package com.ecoswap.service;

import com.ecoswap.model.User;
import com.ecoswap.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthenticationService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public ResponseEntity<String> authenticate(User loginRequest) {
        Optional<User> userOpt;

        // Check if the user provided a username or email
        if (loginRequest.getUsername() != null) {
            userOpt = userRepository.findByUsername(loginRequest.getUsername());
        } else {
            userOpt = userRepository.findByEmail(loginRequest.getEmail());
        }

        // If user does not exist, return 404 Not Found
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();

        // Check if password matches
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        return ResponseEntity.ok("Login successful");
    }
}

package com.ecoswap.controller;

import com.ecoswap.model.User;
import com.ecoswap.service.AuthenticationService;
import com.ecoswap.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.Optional;
import java.util.List;
import com.ecoswap.dto.SignupRequest;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")  // 🔥 Updated to match frontend call
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend requests
public class AuthController { 

    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, AuthenticationService authenticationService) {
        this.userRepository = userRepository;
        this.authenticationService = authenticationService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // ✅ SIGNUP: Registers new user
    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody SignupRequest signupRequest) {
        // Check if email already exists
        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Email already in use"));
        }
    
        // Check if username already exists
        if (userRepository.findByUsername(signupRequest.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Username already in use"));
        }
    
        // Check if passwords match
        if (!signupRequest.getPassword().equals(signupRequest.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Passwords do not match."));
        }
    
        // Ensure name is provided
        if (signupRequest.getName() == null || signupRequest.getName().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Name field is required"));
        }
    
        // Create and save the new user
        User user = new User();
        user.setName(signupRequest.getName());
        user.setUsername(signupRequest.getUsername());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword())); // Hash password
    
        userRepository.save(user); // Save user
    
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }
    
    // ✅ LOGIN: Authenticates user & returns token
    @PostMapping("/login")  
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody User loginRequest) {
        System.out.println("Received login request for: " + loginRequest.getEmail());

        if (loginRequest.getEmail() == null && loginRequest.getUsername() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Email or username is required"));
        }

        // Try to find the user by email first
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());

        // If not found by email, try finding by username
        if (user.isEmpty()) {
            user = userRepository.findByUsername(loginRequest.getUsername());
        }

        if (user.isEmpty()) {
            System.out.println("❌ User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "User not found"));
        }

        System.out.println("✅ User found: " + user.get().getEmail());

        // Validate password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
            System.out.println("❌ Invalid password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid password"));
        }

        System.out.println("✅ Login successful for user: " + user.get().getEmail());

        // Generate a fake token (Replace with real JWT implementation)
        String fakeToken = "fake-jwt-token-" + user.get().getId();

        // ✅ Return token + user data for frontend storage
        Map<String, Object> response = new HashMap<>();
        response.put("token", fakeToken);
        response.put("user", Map.of(
            "id", user.get().getId(),
            "name", user.get().getName(),
            "email", user.get().getEmail(),
            "username", user.get().getUsername()
        ));

        return ResponseEntity.ok(response);
    }
}

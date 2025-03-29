package com.ecoswap.controller;

import com.ecoswap.model.User;
import com.ecoswap.service.AuthenticationService;
import com.ecoswap.repository.UserRepository;
import com.ecoswap.dto.SignupRequest;
import com.ecoswap.utils.CaptchaValidator; // ✅ Import

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.Optional;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final CaptchaValidator captchaValidator; // ✅ Inject validator

    public AuthController(UserRepository userRepository, AuthenticationService authenticationService, CaptchaValidator captchaValidator) {
        this.userRepository = userRepository;
        this.authenticationService = authenticationService;
        this.captchaValidator = captchaValidator;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody SignupRequest signupRequest) {

        if (!captchaValidator.isCaptchaValid(signupRequest.getCaptcha())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid CAPTCHA. Please try again."));
        }

        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Email already in use"));
        }

        if (userRepository.findByUsername(signupRequest.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Username already in use"));
        }

        if (!signupRequest.getPassword().equals(signupRequest.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Passwords do not match."));
        }

        if (signupRequest.getName() == null || signupRequest.getName().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Name field is required"));
        }

        User user = new User();
        user.setName(signupRequest.getName());
        user.setUsername(signupRequest.getUsername());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }


    // ✅ LOGIN (unchanged)
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody User loginRequest) {
        System.out.println("Received login request for: " + loginRequest.getEmail());

        if (loginRequest.getEmail() == null && loginRequest.getUsername() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Email or username is required"));
        }

        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());

        if (user.isEmpty()) {
            user = userRepository.findByUsername(loginRequest.getUsername());
        }

        if (user.isEmpty()) {
            System.out.println("❌ User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
            System.out.println("❌ Invalid password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid password"));
        }

        String fakeToken = "fake-jwt-token-" + user.get().getId();

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

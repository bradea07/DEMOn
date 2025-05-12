package com.ecoswap.controller;

import com.ecoswap.model.User;
import com.ecoswap.repository.UserRepository;
import com.ecoswap.service.AuthenticationService;
import com.ecoswap.service.MailService;
import com.ecoswap.dto.SignupRequest;
import com.ecoswap.dto.ForgotPasswordRequest;
import com.ecoswap.dto.ResetPasswordRequest;
import com.ecoswap.dto.ChangePasswordRequest;
import com.ecoswap.utils.CaptchaValidator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;
    private final CaptchaValidator captchaValidator;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private MailService mailService;

    public AuthController(UserRepository userRepository,
                          AuthenticationService authenticationService,
                          CaptchaValidator captchaValidator) {
        this.userRepository = userRepository;
        this.authenticationService = authenticationService;
        this.captchaValidator = captchaValidator;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // ✅ SIGNUP
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

    // ✅ LOGIN
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

    // ✅ FORGOT PASSWORD (email link)
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "If an account with that email exists, you will receive reset instructions."));
        }

        User user = userOpt.get();
        String resetToken = "reset-token-" + user.getId(); // simplu, fără DB (pentru test/demo)

        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
        String subject = "EcoSwap - Reset Your Password";
        String body = "Hello " + user.getName() + ",\n\nTo reset your password, click the link below:\n"
                + resetLink + "\n\nIf you did not request this, just ignore this email.";

        mailService.sendEmail(user.getEmail(), subject, body);
        System.out.println("✅ Email sent to: " + user.getEmail());

        return ResponseEntity.ok(Map.of("message", "If an account with that email exists, you will receive reset instructions."));
    }

    // ✅ RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetPasswordRequest request) {
        String token = request.getToken();

        if (token == null || !token.startsWith("reset-token-")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid reset token"));
        }

        try {
            Long userId = Long.parseLong(token.replace("reset-token-", ""));
            Optional<User> userOpt = userRepository.findById(userId);

            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid token format"));
        }
    }
    
    // ✅ CHANGE PASSWORD
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody ChangePasswordRequest request,
                                                             @RequestHeader("Authorization") String authHeader) {
        // Extract token from Authorization header
        String token = authHeader.replace("Bearer ", "");
        
        // Extract user ID from the token
        // Note: In a real app with JWT, you would decode the token properly
        if (token == null || !token.startsWith("fake-jwt-token-")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or missing authentication"));
        }
        
        try {
            Long userId = Long.parseLong(token.replace("fake-jwt-token-", ""));
            Optional<User> userOpt = userRepository.findById(userId);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }
            
            User user = userOpt.get();
            
            // Verify current password
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Current password is incorrect"));
            }
            
            // Update with new password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (Exception e) {
            System.out.println("Error changing password: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to update password"));
        }
    }
    
    // ✅ DELETE ACCOUNT
    @DeleteMapping("/delete-account")
    public ResponseEntity<Map<String, String>> deleteAccount(@RequestHeader("Authorization") String authHeader) {
        // Extract token from Authorization header
        String token = authHeader.replace("Bearer ", "");
        
        // Extract user ID from the token
        if (token == null || !token.startsWith("fake-jwt-token-")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or missing authentication"));
        }
        
        try {
            Long userId = Long.parseLong(token.replace("fake-jwt-token-", ""));
            Optional<User> userOpt = userRepository.findById(userId);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }
            
            User user = userOpt.get();
            
            // Delete the user
            userRepository.delete(user);
            
            return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
        } catch (Exception e) {
            System.out.println("Error deleting account: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to delete account"));
        }
    }
}

package com.ecoswap.controller;

import com.ecoswap.dto.SignupRequest;
import com.ecoswap.model.User;
import com.ecoswap.repository.UserRepository;
import com.ecoswap.service.MailService;
import com.ecoswap.utils.CaptchaValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class AuthControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CaptchaValidator captchaValidator;

    @InjectMocks
    private AuthController authController;

    @Mock
    private MailService mailService;


    @BeforeEach
void setUp() {
    MockitoAnnotations.openMocks(this);
    authController = new AuthController(userRepository, null, captchaValidator);
    ReflectionTestUtils.setField(authController, "mailService", mailService); // injectează MailService mock
}

    // SIGNUP TESTS

    @Test
    void testRegisterUser_Success() {
        SignupRequest request = new SignupRequest();
        request.setName("Ion");
        request.setUsername("ionut");
        request.setEmail("ionut@example.com");
        request.setPassword("123456");
        request.setConfirmPassword("123456");
        request.setCaptcha("test");

        when(captchaValidator.isCaptchaValid("test")).thenReturn(true);
        when(userRepository.findByEmail(any())).thenReturn(Optional.empty());
        when(userRepository.findByUsername(any())).thenReturn(Optional.empty());

        ResponseEntity<Map<String, String>> response = authController.registerUser(request);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testRegisterUser_EmailExists() {
        SignupRequest request = new SignupRequest();
        request.setEmail("ionut@example.com");
        request.setUsername("ionut");
        request.setPassword("123");
        request.setConfirmPassword("123");
        request.setCaptcha("good");
        request.setName("Ion");

        when(captchaValidator.isCaptchaValid("good")).thenReturn(true);
        when(userRepository.findByEmail(any())).thenReturn(Optional.of(new User()));

        var response = authController.registerUser(request);
        assertEquals(400, response.getStatusCodeValue());
        assertTrue(response.getBody().get("error").contains("Email"));
    }

    @Test
    void testRegisterUser_InvalidCaptcha() {
        SignupRequest request = new SignupRequest();
        request.setCaptcha("invalid");
        when(captchaValidator.isCaptchaValid("invalid")).thenReturn(false);

        var response = authController.registerUser(request);
        assertEquals(400, response.getStatusCodeValue());
    }

    // LOGIN TESTS

    @Test
    void testLoginUser_SuccessWithEmail() {
        User loginRequest = new User();
        loginRequest.setEmail("ionut@example.com");
        loginRequest.setPassword("pass");

        User user = new User();
        user.setId(1L);
        user.setEmail("ionut@example.com");
        user.setUsername("ionut");
        user.setName("Ion");
        user.setPassword(new BCryptPasswordEncoder().encode("pass"));

        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));

        var response = authController.loginUser(loginRequest);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().containsKey("token"));
    }

    @Test
    void testLoginUser_InvalidPassword() {
        User loginRequest = new User();
        loginRequest.setEmail("ionut@example.com");
        loginRequest.setPassword("wrong");

        User user = new User();
        user.setPassword(new BCryptPasswordEncoder().encode("correct"));

        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));

        var response = authController.loginUser(loginRequest);
        assertEquals(401, response.getStatusCodeValue());
    }

    @Test
    void testLoginUser_UserNotFound() {
        User loginRequest = new User();
        loginRequest.setEmail("nouser@mail.com");

        when(userRepository.findByEmail(any())).thenReturn(Optional.empty());

        var response = authController.loginUser(loginRequest);
        assertEquals(404, response.getStatusCodeValue());
    }

    // FORGOT PASSWORD

    @Test
    void testForgotPassword_UserExists() {
        User user = new User();
        user.setId(1L);
        user.setEmail("ionut@mail.com");
        user.setName("Ion");

        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));

        var response = authController.forgotPassword(new com.ecoswap.dto.ForgotPasswordRequest("ionut@mail.com"));
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testForgotPassword_UserNotFound() {
        when(userRepository.findByEmail(any())).thenReturn(Optional.empty());

        var response = authController.forgotPassword(new com.ecoswap.dto.ForgotPasswordRequest("no@mail.com"));
        assertEquals(200, response.getStatusCodeValue());
    }

    // RESET PASSWORD

    @Test
    void testResetPassword_Success() {
        User user = new User();
        user.setId(1L);
        user.setPassword("old");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        var response = authController.resetPassword(
            new com.ecoswap.dto.ResetPasswordRequest("reset-token-1", "newpass"));
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testResetPassword_InvalidToken() {
        var response = authController.resetPassword(
            new com.ecoswap.dto.ResetPasswordRequest("invalid-token", "newpass"));
        assertEquals(400, response.getStatusCodeValue());
    }

    // CHANGE PASSWORD

    @Test
    void testChangePassword_Success() {
        User user = new User();
        user.setId(1L);
        user.setPassword(new BCryptPasswordEncoder().encode("old"));

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        var request = new com.ecoswap.dto.ChangePasswordRequest("old", "new");
        var response = authController.changePassword(request, "Bearer fake-jwt-token-1");
        assertEquals(200, response.getStatusCodeValue());
    }

    // DELETE ACCOUNT

    @Test
    void testDeleteAccount_Success() {
        User user = new User();
        user.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        var response = authController.deleteAccount("Bearer fake-jwt-token-1");
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testDeleteAccount_InvalidToken() {
        var response = authController.deleteAccount("Bearer wrong-token");
        assertEquals(401, response.getStatusCodeValue());
    }
}

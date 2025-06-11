package com.ecoswap.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
//Google Captcha API integration for validating reCAPTCHA tokens
@Component
public class CaptchaValidator {

    private static final String SECRET_KEY = "6LfXxQMrAAAAAGjJ95ohyilWlXAp_yXPtWtUsLYd";
    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean isCaptchaValid(String token) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, String> params = new HashMap<>();
        params.put("secret", SECRET_KEY);
        params.put("response", token);

        try {
            System.out.println("Verifying CAPTCHA with token: " + token); // debug
            Map response = restTemplate.postForObject(
                    VERIFY_URL + "?secret={secret}&response={response}",
                    null,
                    Map.class,
                    params
            );
            System.out.println("Google CAPTCHA response: " + response); 

            return (Boolean) response.get("success");
        } catch (Exception e) {
            System.out.println("CAPTCHA validation exception: " + e.getMessage());
            return false;
        }
    }
}

package com.ecoswap.service;

import com.ecoswap.dto.UserDTO;
import com.ecoswap.model.User;
import com.ecoswap.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDTO getUserProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDTO(user);
    }

    public void updateUserProfile(Long id, UserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    
        // ❌ Don't update username/email — they stay locked
        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        user.setCity(dto.getCity());
        user.setProfilePic(dto.getProfilePic());
    
        userRepository.save(user);
    }
    
}

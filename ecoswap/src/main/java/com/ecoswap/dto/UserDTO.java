package com.ecoswap.dto;

import com.ecoswap.model.User;
import lombok.*;

// DTO for user data transfer without sensitive information
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String username;
    private String email;
    private String name;
    private String phone;
    private String city;
    private String profilePic;

    public UserDTO(User user) {
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.name = user.getName();
        this.phone = user.getPhone();
        this.city = user.getCity();
        this.profilePic = user.getProfilePic();
    }
}

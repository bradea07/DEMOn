package com.ecoswap.controller;

import com.ecoswap.dto.UserDTO;
import com.ecoswap.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    //  Get user profile by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserProfile(id));
    }

    //   Update user profile
    @PutMapping("/{id}")
    public ResponseEntity<String> updateUserProfile(@PathVariable Long id,
                                                    @RequestBody UserDTO dto) {
        userService.updateUserProfile(id, dto);
        return ResponseEntity.ok("Profile updated successfully.");
    }

    //  3. Upload profile picture (returns image URL)
    @PostMapping("/upload")
    public ResponseEntity<String> uploadProfilePic(@RequestParam("file") MultipartFile file) throws IOException {
        String uploadDirPath = System.getProperty("user.dir") + "/uploads/";
        File uploadDir = new File(uploadDirPath);

        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDirPath + fileName);
        file.transferTo(filePath.toFile());

        String imageUrl = "http://localhost:8080/uploads/" + fileName;
        return ResponseEntity.ok(imageUrl);
    }
}

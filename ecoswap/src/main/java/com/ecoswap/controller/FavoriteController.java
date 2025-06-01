package com.ecoswap.controller;

import com.ecoswap.dto.FavoriteDTO;
import com.ecoswap.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FavoriteDTO>> getUserFavorites(@PathVariable Long userId) {
        List<FavoriteDTO> favorites = favoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(favorites);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToFavorites(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long productId = request.get("productId");
            
            FavoriteDTO favorite = favoriteService.addToFavorites(userId, productId);
            return ResponseEntity.ok(favorite);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromFavorites(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long productId = request.get("productId");
            
            favoriteService.removeFromFavorites(userId, productId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/check/{userId}/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(@PathVariable Long userId, @PathVariable Long productId) {
        boolean isFavorited = favoriteService.isFavorited(userId, productId);
        return ResponseEntity.ok(Map.of("isFavorited", isFavorited));
    }
}

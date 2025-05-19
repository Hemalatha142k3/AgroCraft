package com.controller;

import com.example.entity.Product;
import com.example.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<?> getRecommendations(@PathVariable Long userId) {
        List<Product> recommendedProducts = recommendationService.getRecommendedProducts(userId);

        if (recommendedProducts.isEmpty()) {
            return ResponseEntity.status(404).body("No recommended products found for user ID: " + userId);
        }

        return ResponseEntity.ok(recommendedProducts);
    }
}

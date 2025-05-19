package com.example.service;

import com.example.entity.Product;
import com.example.entity.Wishlist;
import com.example.repo.ProductRepository;
import com.example.repo.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecommendationService {
    
    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getRecommendedProducts(Long userId) {
        // Get wishlist items of the user
        List<Wishlist> wishlistItems = wishlistRepository.findByUserId(userId);

        if (wishlistItems.isEmpty()) {
            System.out.println("No wishlist items found for user: " + userId);
            return productRepository.findAll(); // Show all products if no wishlist items
        }

        // Extract categories of wishlist items
        Set<String> wishlistCategories = wishlistItems.stream()
                .map(wishlist -> wishlist.getProduct().getCategory())
                .collect(Collectors.toSet());

        // Get product IDs already in the wishlist
        Set<Long> wishlistProductIds = wishlistItems.stream()
                .map(wishlist -> wishlist.getProduct().getId())
                .collect(Collectors.toSet());

        System.out.println("User ID: " + userId);
        System.out.println("Wishlist Categories: " + wishlistCategories);
        System.out.println("Wishlist Product IDs: " + wishlistProductIds);

        // If the wishlist has no categories, return all products
        if (wishlistCategories.isEmpty()) {
            return productRepository.findAll();
        }

        // Find products in the same categories but not in the wishlist
        return productRepository.findByCategoryInAndIdNotIn(
                wishlistCategories, wishlistProductIds.isEmpty() ? Set.of(-1L) : wishlistProductIds
        );
    }
}

package com.controller;


import com.example.entity.Wishlist;
import com.example.service.CartService;
import com.example.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private CartService cartService;
    @GetMapping("/{userId}")
    public ResponseEntity<?> getWishlist(@PathVariable(required = false) Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().body("User ID cannot be null");
        }
        return ResponseEntity.ok(wishlistService.getWishlistByUser(userId));
    }

    @PostMapping("/{userId}/{productId}")
    public ResponseEntity<String> addToWishlist(@PathVariable Long userId, @PathVariable Long productId) {
    	 boolean added = wishlistService.addToWishlist(userId, productId);

         if (added) {
             return ResponseEntity.ok("Product added to wishlist successfully");
         } else {
             return ResponseEntity.status(HttpStatus.CONFLICT).body("Product already exists in wishlist");
         }
    }

    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<String> removeFromWishlist(@PathVariable Long userId, @PathVariable Long productId) {
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.ok("Product removed from wishlist");
    }
    @PutMapping("/{userId}/{productId}/{newQuantity}")
    public ResponseEntity<String> updateCart(@PathVariable Long userId, @PathVariable Long productId, @PathVariable int newQuantity) {
        boolean updated = cartService.updateCart(userId, productId, newQuantity);

        if (updated) {
            return ResponseEntity.ok("Cart updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Failed to update cart");
        }
    }

}

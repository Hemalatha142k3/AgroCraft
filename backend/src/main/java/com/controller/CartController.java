package com.controller;

import com.example.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().body("User ID cannot be null");
        }
        return ResponseEntity.ok(cartService.getCartByUser(userId));
    }

    @PostMapping("/{userId}/{productId}/{quantity}")
    public ResponseEntity<String> addToCart(@PathVariable Long userId, @PathVariable Long productId, @PathVariable int quantity) {
        boolean added = cartService.addToCart(userId, productId, quantity);
        return added ? ResponseEntity.ok("Product added to cart successfully") :
                ResponseEntity.status(HttpStatus.CONFLICT).body("Failed to add product to cart");
    }

    @PutMapping("/{userId}/{productId}/{quantity}")
    public ResponseEntity<String> updateCart(@PathVariable Long userId, @PathVariable Long productId, @PathVariable int quantity) {
        boolean updated = cartService.updateCart(userId, productId, quantity);
        return updated ? ResponseEntity.ok("Cart updated successfully") :
                ResponseEntity.status(HttpStatus.CONFLICT).body("Failed to update cart");
    }

    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<String> removeFromCart(@PathVariable Long userId, @PathVariable Long productId) {
        cartService.removeFromCart(userId, productId);
        return ResponseEntity.ok("Product removed from cart");
    }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<String> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared successfully");
    }
}

package com.example.service;

import com.example.entity.Cart;
import com.example.entity.User;
import com.example.entity.Product;
import com.example.repo.CartRepository;
import com.example.repo.UserRepository;
import com.example.repo.ProductRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Cart> getCartByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cartRepository.findByUser(user);
    }

    public boolean addToCart(Long userId, Long productId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (cartRepository.existsByUserAndProduct(user, product)) {
            Cart existingCart = cartRepository.findByUserAndProduct(user, product);
            existingCart.setQuantity(existingCart.getQuantity() + quantity);
            cartRepository.save(existingCart);
            return true;
        }

        Cart cart = new Cart(user, product, quantity);
        cartRepository.save(cart);
        return true;
    }

    @Transactional
    public void removeFromCart(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        cartRepository.deleteByUserAndProduct(user, product);
    }

    @Transactional
    public boolean updateCart(Long userId, Long productId, int newQuantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = cartRepository.findByUserAndProduct(user, product);
        if (cart == null) {
            throw new RuntimeException("Cart item not found");
        }

        if (newQuantity <= 0) {
            cartRepository.delete(cart);
        } else {
            cart.setQuantity(newQuantity);
            cartRepository.save(cart);
        }
        
        return true;
    }

    @Transactional
    public void clearCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        cartRepository.deleteAllByUser(user);
    }
}

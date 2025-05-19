package com.example.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.entity.Cart;
import com.example.entity.Product;
import com.example.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUser(User user);
    
    boolean existsByUserAndProduct(User user, Product product);

    Cart findByUserAndProduct(User user, Product product);

    void deleteByUserAndProduct(User user, Product product);
    void deleteByUser(User user);
    void deleteAllByUser(User user);
    
   Optional<Cart> findFirstByProductId(Long productId);
}

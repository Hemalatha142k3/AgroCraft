package com.example.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.entity.Product;
import com.example.entity.User;
import com.example.entity.Wishlist;

import jakarta.transaction.Transactional;

import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUser(User user);

    List<Wishlist> findByUserAndProduct(User user, Product product);
	boolean existsByUserAndProduct(User user, Product product);
    List<Wishlist> findByUserId(Long userId);
    @Transactional
    void deleteByUserAndProduct(User user, Product product);

    @Modifying
    @Query("DELETE FROM Wishlist w WHERE w.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);
}

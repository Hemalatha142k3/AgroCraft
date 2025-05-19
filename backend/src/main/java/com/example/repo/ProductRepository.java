package com.example.repo;


import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.entity.Product;

import jakarta.transaction.Transactional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE LOWER(p.productTitle) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.category) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchByQuery(@Param("query") String query);

    List<Product> findAllByProductTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrCategoryContainingIgnoreCase(
        String productTitle, String description, String category);
    List<Product> findByCategoryInAndIdNotIn(Set<String> categories, Set<Long> productIds);
//    // Custom query to delete a product from Wishlist by productId
//    @Transactional
//    @Modifying
//    @Query("DELETE FROM Wishlist w WHERE w.product.id = :productId")
//    void deleteByProductId(@Param("productId") Long productId);
}


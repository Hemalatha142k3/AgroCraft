package com.example.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.entity.Product;
import com.example.repo.ProductRepository;
import com.example.repo.WishlistRepository;

import jakarta.transaction.Transactional;


@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

   @Autowired
   private WishlistRepository wishlistRepository;

    // Add a new product
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // Retrieve all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Retrieve a product by ID
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

//    // Delete a product by ID
//    public void deleteProduct(Long id) {
//        productRepository.deleteById(id);
//    }

    // Update an existing product
    public Product updateProduct(Product existingProduct) {
        return productRepository.save(existingProduct);
    }

    // Delete product along with dependencies (wishlist entries)
    @Transactional
    public void deleteProductWithDependencies(Long productId) {
        // First, delete associated wishlist entries
       wishlistRepository.deleteByProductId(productId);

        productRepository.deleteById(productId);
    }

    // Search for products by title, description, or category
    public List<Product> searchProducts(String query) {
        return productRepository.findAllByProductTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query, query);
    }
}

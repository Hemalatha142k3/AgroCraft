package com.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.entity.Product;
import com.example.entity.User;
import com.example.service.ProductService;
import com.example.service.UserService;


@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private UserService userService;
    
    

    @Value("${upload.directory}")
    private String uploadDir;

    private static final String PRODUCTS_SUBDIRECTORY = "products";

    @RequestMapping(value = "/{id}", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptionsRequest() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> productList = productService.getAllProducts();
        return ResponseEntity.ok(productList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = productService.getAllProducts().stream()
                .map(Product::getCategory)
                .distinct()
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(
            @RequestParam String productTitle,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam double price,
            @RequestParam double discount,
            @RequestParam(required = false) MultipartFile file1,
            @RequestParam(required = false) MultipartFile file2,
            @RequestParam(required = false) MultipartFile file3,
            @RequestParam(required = false) MultipartFile file4,
            @RequestParam Long userId) {
        try {
        	 String filePath1 = saveFile(file1);
             String filePath2 = saveFile(file2);
             String filePath3 = saveFile(file3);
             String filePath4 = saveFile(file4);
             
            Product product = new Product();
            product.setProductTitle(productTitle);
            product.setDescription(description);
            product.setCategory(category);
            product.setPrice(price);
            product.setDiscount(discount);
            product.setPictureUrl1(filePath1 != null ? "/uploads/products/" + filePath1 : null);
            product.setPictureUrl2(filePath2 != null ? "/uploads/products/" + filePath2 : null);
            product.setPictureUrl3(filePath3 != null ? "/uploads/products/" + filePath3 : null);
            product.setPictureUrl4(filePath4 != null ? "/uploads/products/" + filePath4 : null);
//            Product savedProduct =productService.addProduct(product);
//            return ResponseEntity.ok(savedProduct);
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
            User user = userService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            product.setAddedByUser(user);

            Product savedProduct = productService.addProduct(product);
            return ResponseEntity.ok(savedProduct);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam("productTitle") String productTitle,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("price") double price,
            @RequestParam("discount")double discount,
            @RequestParam(value = "file1", required = false) MultipartFile file1,
            @RequestParam(value = "file2", required = false) MultipartFile file2,
            @RequestParam(value = "file3", required = false) MultipartFile file3,
            @RequestParam(value = "file4", required = false) MultipartFile file4) {

        try {
            Product existingProduct = productService.getProductById(id);
            if (existingProduct == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
            }

            existingProduct.setProductTitle(productTitle);
            existingProduct.setDescription(description);
            existingProduct.setCategory(category);
            existingProduct.setPrice(price);

            if (file1 != null && !file1.isEmpty()) {
                existingProduct.setPictureUrl1("/uploads/products/" + saveFile(file1));
            }
            if (file2 != null && !file2.isEmpty()) {
                existingProduct.setPictureUrl2("/uploads/products/" + saveFile(file2));
            }
            if (file3 != null && !file3.isEmpty()) {
                existingProduct.setPictureUrl3("/uploads/products/" + saveFile(file3));
            }
            if (file4 != null && !file4.isEmpty()) {
                existingProduct.setPictureUrl4("/uploads/products/" + saveFile(file4));
            }

            Product updatedProduct = productService.updateProduct(existingProduct);
            return ResponseEntity.ok(updatedProduct);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating product");
        }
    }

    private String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null; // No file uploaded
        }

        String filename = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
        Path uploadPath = Paths.get(uploadDir, PRODUCTS_SUBDIRECTORY);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath); // Create arts subdirectory if not exists
        }

        Path filePath = uploadPath.resolve(filename);
        Files.write(filePath, file.getBytes());

        return filename;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Product existingProduct = productService.getProductById(id);

        if (existingProduct == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }

        try {
            productService.deleteProductWithDependencies(id);
            return ResponseEntity.ok("Product deleted successfully");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error deleting product: " + e.getMessage());
        }
    }

}

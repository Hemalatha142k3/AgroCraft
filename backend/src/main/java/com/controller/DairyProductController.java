package com.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.entity.DairyProduct;
import com.example.entity.User;
import com.example.service.DairyProductService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/dairy")
public class DairyProductController {

    @Autowired
    private DairyProductService service;

    // Fetch all dairy products
    @GetMapping("/list")
    public ResponseEntity<List<DairyProduct>> getAllProducts() {
        List<DairyProduct> products = service.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // Fetch a single dairy product by ID
    @GetMapping("/{id}")
    public ResponseEntity<DairyProduct> getProductById(@PathVariable Long id) {
        Optional<DairyProduct> product = service.getProductById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Fix: Accept userId in the request and pass it to the service
    @PostMapping("/save")
    public ResponseEntity<DairyProduct> saveProduct(@RequestBody DairyProduct product, @RequestParam User userId) {
        DairyProduct savedProduct = service.saveProduct(product, userId);
        return ResponseEntity.ok(savedProduct);
    }

    // Delete a dairy product by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        service.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}

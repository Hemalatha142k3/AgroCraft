package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.entity.DairyProduct;
import com.example.entity.User;
import com.example.repo.DairyProductRepository;
import java.util.List;
import java.util.Optional;

@Service
public class DairyProductService {

    @Autowired
    private DairyProductRepository repository;

    public List<DairyProduct> getAllProducts() {
        return repository.findAll();
    }

    public Optional<DairyProduct> getProductById(Long id) {
        return repository.findById(id);
    }

    // ✅ Fix: Accept userId and set createdBy before saving
    public DairyProduct saveProduct(DairyProduct product, User userId) {
        product.setCreatedBy(userId); // Assuming 'createdBy' exists in DairyProduct entity
        return repository.save(product);
    }

    public void deleteProduct(Long id) {
        repository.deleteById(id);
    }
}

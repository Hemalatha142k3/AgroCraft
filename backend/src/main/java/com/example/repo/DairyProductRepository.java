package com.example.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.DairyProduct;

public interface DairyProductRepository extends JpaRepository<DairyProduct, Long> {
	List<DairyProduct> findAll(); // Retrieve all dairy products
	Optional<DairyProduct> findById(Long id); // Find a dairy product by ID
//	DairyProduct save(DairyProduct dairyProduct); // Save or update a dairy product
	void deleteById(Long id); // Delete a dairy product by ID
	void delete(DairyProduct dairyProduct); // Delete a specific dairy product
	void deleteAll(); // Delete all records
	boolean existsById(Long id); // Check if a dairy product exists by ID
	long count(); // Count the number of dairy products

}

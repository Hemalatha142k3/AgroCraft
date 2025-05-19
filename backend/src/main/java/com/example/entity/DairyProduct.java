package com.example.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "dairy_products")
public class DairyProduct {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private int quantity;
    private double price;
    private int slots; // Available slots for booking
    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false) // Foreign key to User table
    private User createdBy;

    public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	// Constructors
    public DairyProduct() {}

    public DairyProduct(String name, int quantity, double price, int slots) {
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.slots = slots;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getSlots() { return slots; }
    public void setSlots(int slots) { this.slots = slots; }
}

package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "dairy_bookings")
public class DairyBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private DairyProduct dairyProduct;

    private String mobileNumber;
    private String address;

    @Column(nullable = false)
    private String timings; // Morning, Evening, or Both

    private LocalDateTime bookingTime;

    // Constructors
    public DairyBooking() {
        this.bookingTime = LocalDateTime.now();
    }

    public DairyBooking(User user, DairyProduct dairyProduct, String mobileNumber, String address, String timings) {
        this.user = user;
        this.dairyProduct = dairyProduct;
        this.mobileNumber = mobileNumber;
        this.address = address;
        this.timings = timings;
        this.bookingTime = LocalDateTime.now();
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public DairyProduct getDairyProduct() {
		return dairyProduct;
	}

	public void setDairyProduct(DairyProduct dairyProduct) {
		this.dairyProduct = dairyProduct;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getTimings() {
		return timings;
	}

	public void setTimings(String timings) {
		this.timings = timings;
	}

	public LocalDateTime getBookingTime() {
		return bookingTime;
	}

	public void setBookingTime(LocalDateTime bookingTime) {
		this.bookingTime = bookingTime;
	}
    
}

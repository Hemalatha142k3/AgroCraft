package com.example.service;

import com.example.entity.DairyBooking;
import com.example.entity.DairyProduct;
import com.example.entity.User;
import com.example.repo.DairyBookingRepository;
import com.example.repo.DairyProductRepository;
import com.example.repo.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DairyBookingService {

    @Autowired
    private DairyBookingRepository dairyBookingRepository;
    @Autowired
    private DairyProductRepository dairyProductRepository;
    
    public DairyBooking createBooking(Long productId, String mobileNumber, String address, String timings) {
        DairyProduct dairyProduct = dairyProductRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Dairy Product not found"));

        DairyBooking booking = new DairyBooking();
        booking.setDairyProduct(dairyProduct);  // ✅ Assign the product
        booking.setMobileNumber(mobileNumber);
        booking.setAddress(address);
        booking.setTimings(timings);
        
        return dairyBookingRepository.save(booking);
    }

    @Autowired
    private UserRepository userRepository;  // Add UserRepository

    public DairyBooking bookDairyProduct(DairyBooking booking) {
        if (booking.getUser() == null || booking.getUser().getId() == null) {
            throw new IllegalArgumentException("User ID must not be null");
        }
        
        // Fetch existing User from DB
        User existingUser = userRepository.findById(booking.getUser().getId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        booking.setUser(existingUser); // Assign the managed User entity

        return dairyBookingRepository.save(booking);
    }



    public List<DairyBooking> getAllBookings() {
        return dairyBookingRepository.findAll();
    }
}

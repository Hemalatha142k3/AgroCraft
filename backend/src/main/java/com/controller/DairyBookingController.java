package com.controller;

import com.example.entity.DairyBooking;
import com.example.service.DairyBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class DairyBookingController {

    @Autowired
    private DairyBookingService dairyBookingService;

    @PostMapping("/book")
    public DairyBooking bookProduct(@RequestBody DairyBooking booking) {
        return dairyBookingService.bookDairyProduct(booking);
    }

    @GetMapping("/all")
    public List<DairyBooking> getAllBookings() {
        return dairyBookingService.getAllBookings();
    }
}

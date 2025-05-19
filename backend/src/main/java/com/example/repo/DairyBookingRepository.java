package com.example.repo;

import com.example.entity.DairyBooking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DairyBookingRepository extends JpaRepository<DairyBooking, Long> {
}

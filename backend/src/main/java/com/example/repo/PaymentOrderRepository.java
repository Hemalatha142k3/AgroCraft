package com.example.repo;

import com.example.entity.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {
    List<PaymentOrder> findByRazorpayOrderId(String razorpayOrderId);
    List<PaymentOrder> findBySellerId(Long sellerId);
    List<PaymentOrder> findByCustomerId(Long customerId);
}

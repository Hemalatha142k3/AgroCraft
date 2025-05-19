package com.controller;


import com.example.entity.PaymentOrder;
import com.example.repo.PaymentOrderRepository;
import com.example.service.PaymentService;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;
    
    @Autowired
    private final PaymentOrderRepository paymentOrderRepository;

    public PaymentController(PaymentService paymentService,PaymentOrderRepository paymentOrderRepository ) {
        this.paymentService = paymentService;
        this.paymentOrderRepository=paymentOrderRepository;
    }


    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> requestData) {
        try {
            Long productId = Long.parseLong(requestData.get("productId").toString());
            Double amount = Double.parseDouble(requestData.get("amount").toString());
            Long customerId = Long.parseLong(requestData.get("customerId").toString()); // Get customerId from request
            
            String orderDetails = paymentService.createPaymentOrder(productId, amount,customerId);
            return ResponseEntity.ok(orderDetails);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<PaymentOrder>> getAllPayments() {
        List<PaymentOrder> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

//    @GetMapping("/customer/{orderId}")
//    public ResponseEntity<List<PaymentOrder>> getOrdersByCustomer(@PathVariable String orderId) {
//        List<PaymentOrder> orders = paymentService.getOrdersByCustomerId(orderId);
//        return ResponseEntity.ok(orders);
//    }

    @GetMapping("/merchant/{sellerId}")
    public ResponseEntity<List<PaymentOrder>> getOrdersBySeller(@PathVariable Long sellerId) {
        List<PaymentOrder> orders = paymentService.getOrdersBySellerId(sellerId);
        return ResponseEntity.ok(orders);
    }
    @GetMapping("/customer/orders/{customerId}")
    public ResponseEntity<List<PaymentOrder>> getOrdersByCustomerId(@PathVariable Long customerId) {
        List<PaymentOrder> orders = paymentOrderRepository.findByCustomerId(customerId);
        return ResponseEntity.ok(orders);
    }


}

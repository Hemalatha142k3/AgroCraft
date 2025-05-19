package com.controller;

import com.example.entity.PaymentAccount;
import com.example.service.PaymentAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentAccountController {

    @Autowired
    private PaymentAccountService paymentAccountService;

    @PostMapping("/register/{userId}")
    public PaymentAccount registerPaymentAccount(@PathVariable Long userId, @RequestBody PaymentAccount paymentAccount) {
        return paymentAccountService.registerPaymentAccount(userId, paymentAccount);
    }

    @GetMapping("/user/{userId}")
    public PaymentAccount getPaymentAccountByUserId(@PathVariable Long userId) {
        return paymentAccountService.getPaymentAccountByUserId(userId);
    }
}

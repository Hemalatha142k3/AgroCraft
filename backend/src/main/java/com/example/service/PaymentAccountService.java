package com.example.service;

import com.example.entity.PaymentAccount;
import com.example.entity.User;
import com.example.repo.PaymentAccountRepository;
import com.example.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class PaymentAccountService {

    @Autowired
    private PaymentAccountRepository paymentAccountRepository;
    
    @Autowired
    private UserRepository userRepository;

    public PaymentAccount registerPaymentAccount(Long userId, PaymentAccount paymentAccount) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            paymentAccount.setUser(user);
            return paymentAccountRepository.save(paymentAccount);
        } else {
            throw new RuntimeException("User not found!");
        }
    }

    public PaymentAccount getPaymentAccountByUserId(Long userId) {
        return paymentAccountRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Payment account not found for user: " + userId));
    }
}

package com.example.repo;

import com.example.entity.PaymentAccount;
import com.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentAccountRepository extends JpaRepository<PaymentAccount, Long> {
    Optional<PaymentAccount> findByUserId(Long userId);
    PaymentAccount findByUser(User user);
    
}

package com.example.service;

import com.example.entity.PaymentOrder;
import com.example.entity.Cart;
import com.example.entity.PaymentAccount;
import com.example.entity.Product;
import com.example.repo.PaymentOrderRepository;
import com.example.repo.CartRepository;
import com.example.repo.PaymentAccountRepository;
import com.example.repo.ProductRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class PaymentService {

    private static final Logger LOGGER = Logger.getLogger(PaymentService.class.getName());

    @Value("${razorpay.keyId}")
    private String razorpayKeyId;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    private final PaymentAccountRepository paymentAccountRepository;
    private final ProductRepository productRepository;
    private final PaymentOrderRepository paymentOrderRepository;
    private final CartRepository cartRepository;

    public PaymentService(PaymentAccountRepository paymentAccountRepository,
                          ProductRepository productRepository,
                          CartRepository cartRepository,
                          PaymentOrderRepository paymentOrderRepository) {
        this.paymentAccountRepository = paymentAccountRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.paymentOrderRepository = paymentOrderRepository;
    }

    public String createPaymentOrder(Long productId, Double amount, Long customerId) throws Exception {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new Exception("Product not found for ID: " + productId);
        }

        Product product = productOpt.get();
        if (product.getAddedByUser() == null) {
            throw new Exception("Seller information is missing for this product (ID: " + productId + ").");
        }

        Long sellerId = product.getAddedByUser().getId();

        // Get the seller's payment account details
        Optional<PaymentAccount> sellerPaymentAccountOpt = paymentAccountRepository.findByUserId(sellerId);
        if (sellerPaymentAccountOpt.isEmpty()) {
            throw new Exception("Seller payment account not found for user ID: " + sellerId);
        }

        PaymentAccount sellerPaymentAccount = sellerPaymentAccountOpt.get();
        if (sellerPaymentAccount.getUpiId() == null && sellerPaymentAccount.getAccountNumber() == null) {
            throw new Exception("Seller payment details are missing for user ID: " + sellerId);
        }

        // Create order in Razorpay
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpaySecret);
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

        JSONObject notes = new JSONObject();
        if (sellerPaymentAccount.getUpiId() != null) {
            notes.put("seller_upi_id", sellerPaymentAccount.getUpiId());
        }
        if (sellerPaymentAccount.getAccountNumber() != null) {
            notes.put("seller_account", sellerPaymentAccount.getAccountNumber());
        }
        orderRequest.put("notes", notes);

        Order order = razorpayClient.orders.create(orderRequest);

        // Save payment order
        PaymentOrder paymentOrder = new PaymentOrder();
        paymentOrder.setRazorpayOrderId(order.get("id"));
        paymentOrder.setProductId(productId);
        paymentOrder.setSellerId(sellerId);
        paymentOrder.setCustomerId(customerId);  // Now using the customer ID from session
        paymentOrder.setAmount(amount);
        paymentOrder.setCurrency(order.get("currency"));
        paymentOrder.setReceipt(order.get("receipt"));
        paymentOrder.setStatus(order.get("status"));
        paymentOrder.setSellerUpiId(sellerPaymentAccount.getUpiId());
        paymentOrder.setSellerAccountNumber(sellerPaymentAccount.getAccountNumber());

        paymentOrderRepository.save(paymentOrder);

        return order.toString();
    }

    public List<PaymentOrder> getAllPayments() {
        return paymentOrderRepository.findAll();
    }
   

    public List<PaymentOrder> getOrdersBySellerId(Long sellerId) {
        return paymentOrderRepository.findBySellerId(sellerId);
    }
//
//    public List<PaymentOrder> getOrdersByCustomerId(String orderId) {
//        return paymentOrderRepository.findByRazorpayOrderId(orderId);
//    }
    public List<PaymentOrder> getOrdersByCustomerId(Long customerId) {
        return paymentOrderRepository.findByCustomerId(customerId);
    }

}



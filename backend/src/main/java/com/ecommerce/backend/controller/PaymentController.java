package com.ecommerce.backend.controller;

import com.ecommerce.backend.service.PaymentService;
import com.stripe.model.PaymentIntent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createPaymentIntent(
            @RequestParam long amount,
            @RequestParam(defaultValue = "try") String currency) {

        PaymentIntent pi = paymentService.createPaymentIntent(amount, currency);

        return ResponseEntity.ok(Map.of(
            "clientSecret", pi.getClientSecret(),
            "paymentIntentId", pi.getId()
        ));
    }
}

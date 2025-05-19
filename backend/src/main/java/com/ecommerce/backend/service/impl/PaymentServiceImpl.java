package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.service.PaymentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;



@Service
public class PaymentServiceImpl implements PaymentService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    @Override
    public PaymentIntent retrievePaymentIntent(String paymentIntentId) {
        try {
            return PaymentIntent.retrieve(paymentIntentId);
        } catch (Exception e) {
            throw new RuntimeException("PaymentIntent alınamadı: " + paymentIntentId, e);
        }
    }
    @Override
    public PaymentIntent createPaymentIntent(long amount, String currency) {
        try {
            long minor = amount * 100; // örneğin 24₺ -> 2400 kuruş
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(minor)
                .setCurrency(currency)
                .setAutomaticPaymentMethods(
                    PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                        .setEnabled(true)
                        .build()
                )
                .build();
            return PaymentIntent.create(params);
        } catch (Exception e) {
            throw new RuntimeException("Stripe PaymentIntent oluşturulamadı", e);
        }
    }

    @Override
public Refund refundPayment(String paymentIntentId) {
    try {
        RefundCreateParams params = RefundCreateParams.builder()
            .setPaymentIntent(paymentIntentId)
            .build();
        return Refund.create(params);
    } catch (Exception e) {
        throw new RuntimeException("Stripe refund başarısız: " + paymentIntentId, e);
    }
}
 @Override
    public void refundPaymentIntentPartial(String paymentIntentId, long amount) {
        try {
            RefundCreateParams params = RefundCreateParams.builder()
                .setPaymentIntent(paymentIntentId)
                .setAmount(amount)
                .build();
            Refund.create(params);
        } catch (StripeException e) {
            throw new RuntimeException("Stripe partial refund failed", e);
        }
    }
}

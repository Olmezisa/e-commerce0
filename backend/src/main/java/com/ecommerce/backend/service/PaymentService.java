package com.ecommerce.backend.service;

import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;

public interface PaymentService {
    PaymentIntent createPaymentIntent(long amount, String currency);
    Refund refundPayment(String paymentIntentId);
    PaymentIntent retrievePaymentIntent(String paymentIntentId);
    void refundPaymentIntentPartial(String paymentIntentId, long amount);
}

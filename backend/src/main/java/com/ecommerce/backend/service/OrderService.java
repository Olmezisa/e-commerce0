package com.ecommerce.backend.service;

import java.math.BigDecimal;
import java.util.List;

import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.dto.OrderResponse;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderStatus;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ShipmentStatus;

public interface OrderService {
    Long countOrders();
    long countOrdersBySellerEmail(String sellerEmail);
    long countOrdersBySellerEmailAndStatus(String sellerEmail, OrderStatus status);
    BigDecimal sumRevenueBySellerEmail(String sellerEmail);
    List<Order> findOrdersBySellerEmail(String sellerEmail);

    OrderResponse placeOrder(OrderRequest request);
    List<OrderResponse> getOrdersForBuyer();
    List<OrderResponse> getOrdersForSeller();
    OrderResponse cancelOrder(Long orderId);
    Product findTopSellingProductBySellerEmail(String email);
    BigDecimal calculateAverageProductPrice(String email);


    OrderResponse updateShipmentStatus(Long orderId, ShipmentStatus newStatus);
    OrderResponse getOrderById(Long orderId);
    void cancelOrderItem(Long orderId,Long itemId);
    
    
    
}
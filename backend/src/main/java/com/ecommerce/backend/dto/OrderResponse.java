package com.ecommerce.backend.dto;

import com.ecommerce.backend.entity.OrderStatus;
import com.ecommerce.backend.entity.ShipmentStatus;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {
    private Long orderId;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
    private ShipmentStatus shipmentStatus;

    public OrderResponse(Long orderId,
                         OrderStatus status,
                         ShipmentStatus shipmentStatus,
                         LocalDateTime createdAt,
                         List<OrderItemResponse> items) {
        this.orderId   = orderId;
        this.status    = status;
        this.createdAt = createdAt;
        this.items     = items;
        this.shipmentStatus=shipmentStatus;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public List<OrderItemResponse> getItems() {
        return items;
    }
    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }
    public Long getOrderId() {
        return orderId;
    }
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
    public OrderStatus getStatus() {
        return status;
    }
    public void setStatus(OrderStatus status) {
        this.status = status;
    }
    public ShipmentStatus getShipmentStatus() {
        return shipmentStatus;
    }
    public void setShipmentStatus(ShipmentStatus shipmentStatus) {
        this.shipmentStatus = shipmentStatus;
    }
}

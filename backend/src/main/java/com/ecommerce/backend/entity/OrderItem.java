package com.ecommerce.backend.entity;

import jakarta.persistence.*;


import java.math.BigDecimal;


@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    private OrderItemStatus status = OrderItemStatus.ACTIVE;

    @ManyToOne @JoinColumn(name = "product_id", nullable = false)
    private Product product; 

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private BigDecimal unitPrice;

    public Long getId() {
        return id;
    }
    public Order getOrder() {
        return order;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Product getProduct() {
        return product;
    }
    public void setOrder(Order order) {
        this.order = order;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setProduct(Product product) {
        this.product = product;
    }
    public BigDecimal getUnitPrice() {
        return unitPrice;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }
    public OrderItemStatus getStatus() {
        return status;
    }
    public void setStatus(OrderItemStatus status) {
        this.status = status;
    }
    
}

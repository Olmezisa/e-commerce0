package com.ecommerce.backend.dto;

import java.math.BigDecimal;

import com.ecommerce.backend.entity.OrderItemStatus;


public class OrderItemResponse {
    private Long productId;
    private String productName;
    private int quantity;
    private BigDecimal unitPrice;
    private String imageUrl;
    private OrderItemStatus status;
    private Long itemId;

     public OrderItemResponse(Long productId,
                             String productName,
                             int quantity,
                             BigDecimal unitPrice,
                             String imageUrl,
                             OrderItemStatus status,
                             Long itemId) {
        this.productId   = productId;
        this.productName = productName;
        this.quantity    = quantity;
        this.unitPrice   = unitPrice;
        this.imageUrl=imageUrl;
        this.status=status;
        this.itemId=itemId;
    }
    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public BigDecimal getUnitPrice() {
        return unitPrice;
    }
    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }
    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    public OrderItemStatus getStatus() {
        return status;
    }
    public void setStatus(OrderItemStatus status) {
        this.status = status;
    }
    public Long getItemId() {
        return itemId;
    }
    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }
}

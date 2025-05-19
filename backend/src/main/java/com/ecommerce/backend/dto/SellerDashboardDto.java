package com.ecommerce.backend.dto;


import java.math.BigDecimal;

public class SellerDashboardDto {
    private long totalProducts;
    private long totalOrders;
    private long pendingOrders;
    private BigDecimal totalRevenue;
    private String topProductName;
    private long topProductSales;
    private BigDecimal averageProductPrice;



    public SellerDashboardDto(long totalProducts, long totalOrders, long pendingOrders, BigDecimal totalRevenue,
                               String topProductName, long topProductSales, BigDecimal averageProductPrice) {
        this.totalProducts = totalProducts;
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.totalRevenue = totalRevenue;
        this.topProductName = topProductName;
        this.topProductSales = topProductSales;
        this.averageProductPrice = averageProductPrice;
    }
    
    public long getPendingOrders() {
        return pendingOrders;
    }
    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }
    public long getTotalOrders() {
        return totalOrders;
    }
    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }
    public long getTotalProducts() {
        return totalProducts;
    }
    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }
    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }
    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
    public String getTopProductName() {
        return topProductName;
    }
    public void setTopProductName(String topProductName) {
        this.topProductName = topProductName;
    }
    public long getTopProductSales() {
        return topProductSales;
    }
    public void setTopProductSales(int topProductSales) {
        this.topProductSales = topProductSales;
    }
    public BigDecimal getAverageProductPrice() {
        return averageProductPrice;
    }
    public void setAverageProductPrice(BigDecimal averageProductPrice) {
        this.averageProductPrice = averageProductPrice;
    }

}

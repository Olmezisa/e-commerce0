package com.ecommerce.backend.dto;

import com.ecommerce.backend.entity.ProductStatus;
import java.math.BigDecimal;

public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private int stock;
    private String imageUrl;
    private ProductStatus status;
    private SellerDto seller; 
    private String category;
    private double rating;
    private int ratingCount;

    public ProductResponse(Long id, String name, String description, BigDecimal price, int stock,
                           String imageUrl, ProductStatus status, SellerDto seller,
                           String category, double rating, int ratingCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.imageUrl = imageUrl;
        this.status = status;
        this.seller = seller;
        this.category = category;
        this.rating = rating;
        this.ratingCount = ratingCount;
    }

    public Long getId() { 
        return id; 
    }
    public String getName() { 
        return name;
     }
    public String getDescription() { 
        return description; 
    }
    public BigDecimal getPrice() {
         return price; 
        }
    public int getStock() {
         return stock; 
        }
    public String getImageUrl() {
         return imageUrl; 
        }
    public ProductStatus getStatus() {
         return status; 
        }
    public SellerDto getSeller() {
         return seller; 
        }
    public String getCategory() {
         return category; 
        }
    public double getRating() {
         return rating; 
        }
    public int getRatingCount() {
         return ratingCount; 
        }
}

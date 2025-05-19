package com.ecommerce.backend.dto;

import com.ecommerce.backend.entity.ProductStatus;
import java.math.BigDecimal;
import org.springframework.web.multipart.MultipartFile;

public class ProductRequest {

    private String name;
    private String description;
    private MultipartFile image;
    private BigDecimal price;
    private int stock;
    private ProductStatus status;
    private double rating;
    private Long categoryId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    
    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }
    public double getRating() {
        return rating;
    }
    public void setRating(double rating) {
        this.rating = rating;
    }
    public Long getCategoryId() {
        return categoryId;
    }
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
    public void setImage(MultipartFile image) {
        this.image = image;
    }
    public MultipartFile getImage() {
        return image;
    }
}

// src/main/java/com/ecommerce/backend/dto/VariantResponse.java
package com.ecommerce.backend.dto;

import java.math.BigDecimal;

public class VariantResponse {

    private Long id;
    private Long productId;
    private String sku;
    private String optionName;
    private String optionValue;
    private BigDecimal price;
    private int stock;
    private String imageUrl;

    public VariantResponse(Long id, Long productId, String sku, String optionName,
                           String optionValue, BigDecimal price, int stock, String imageUrl) {
        this.id = id;
        this.productId = productId;
        this.sku = sku;
        this.optionName = optionName;
        this.optionValue = optionValue;
        this.price = price;
        this.stock = stock;
        this.imageUrl = imageUrl;
    }

    
    public Long getId() { 
        return id;
     }
    public Long getProductId() { 
        return productId; 
    }
    public String getSku() { 
        return sku; 
    }
    public String getOptionName() {
         return optionName; 
        }
    public String getOptionValue() {
         return optionValue;
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
}

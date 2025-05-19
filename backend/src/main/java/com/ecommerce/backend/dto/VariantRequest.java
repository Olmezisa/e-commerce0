// src/main/java/com/ecommerce/backend/dto/VariantRequest.java
package com.ecommerce.backend.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VariantRequest {

    @NotBlank
    private String sku;

    @NotBlank
    private String optionName;

    @NotBlank
    private String optionValue;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal price;

    @Min(0)
    private int stock;

    private String imageUrl;

    // getters & setters
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getOptionName() { return optionName; }
    public void setOptionName(String optionName) { this.optionName = optionName; }

    public String getOptionValue() { return optionValue; }
    public void setOptionValue(String optionValue) { this.optionValue = optionValue; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}

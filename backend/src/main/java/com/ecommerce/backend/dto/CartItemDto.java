package com.ecommerce.backend.dto;

import com.ecommerce.backend.entity.CartItem;
import java.math.BigDecimal;

public class CartItemDto {
    private Long productId;
    private Long variantId;  
    private String productName;
    private String variantOption;  
    private BigDecimal price;
    private int quantity;

    public CartItemDto(
      Long productId,
      Long variantId,
      String productName,
      String variantOption,
      BigDecimal price,
      int quantity
    ) {
        this.productId = productId;
        this.variantId = variantId;
        this.productName = productName;
        this.variantOption = variantOption;
        this.price = price;
        this.quantity = quantity;
    }

    public static CartItemDto fromEntity(CartItem item) {
        var v = item.getVariant();
        String opt = (v != null)
          ? v.getOptionName() + ": " + v.getOptionValue()
          : null;
        return new CartItemDto(
            item.getProduct().getId(),
            (v != null ? v.getId() : null),
            item.getProduct().getName(),
            opt,
            item.getProduct().getPrice(),
            item.getQuantity()
        );
    }
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public BigDecimal getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public Long getVariantId() { return variantId; }
    public String getVariantOption() { return variantOption; }
    
}
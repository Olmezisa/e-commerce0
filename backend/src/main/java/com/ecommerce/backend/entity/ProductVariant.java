package com.ecommerce.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String optionName;

    @Column(nullable = false)
    private String optionValue;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private int stock;

    private String imageUrl;

    public Long getId() { return id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
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

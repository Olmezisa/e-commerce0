package com.ecommerce.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    private String imageUrl;
    private double rating;
    private String comment;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private int stock;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status = ProductStatus.PENDING;


    @ManyToOne
    @JoinColumn(name="seller_id")
    @JsonIgnoreProperties({"password", "email", "role"})
    private User seller;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status")
    private ProductStatus previousStatus;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> variants = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    public Long getId() {
        return id;
    }

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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
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

    public void setId(Long id) {
        this.id = id;
    }
    public void setSeller(User seller) {
        this.seller = seller;
    }
    public User getSeller() {
        return seller;
    }
    public double getRating() {
        return rating;
    }
    public void setRating(double rating) {
        this.rating = rating;
    }
    public ProductStatus getPreviousStatus() {
        return previousStatus;
    }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public void setPreviousStatus(ProductStatus previousStatus) {
        this.previousStatus = previousStatus;
    }
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    public List<Review> getReviews() {
        return reviews;
    }

public void setReviews(List<Review> reviews) {
    this.reviews = reviews;
}
    public List<ProductVariant> getVariants() {
        return variants;
    }
    public void setVariants(List<ProductVariant> variants) {
        this.variants = variants;
    }
    public void addVariant(ProductVariant variant) {
        variants.add(variant);
        variant.setProduct(this);
    }
    public void removeVariant(ProductVariant variant) {
        variants.remove(variant);
        variant.setProduct(null);
    }
   
    public Category getCategory() {
        return category;
    }
    public void setCategory(Category category) {
        this.category = category;
    }
    @Transient
private long totalSales;

public long getTotalSales() {
    return totalSales;
}

public void setTotalSales(long totalSales) {
    this.totalSales = totalSales;
}

}

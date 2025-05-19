package com.ecommerce.backend.dto;

public class SellerDto {
    private Long id;
    private String fullName;
    private String email;

    public SellerDto(Long id, String fullName, String email) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
}


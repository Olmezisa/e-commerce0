package com.ecommerce.backend.dto;


public class SellerRegistrationRequest {
    private String fullName;
    private String email;
    private String password;
    private boolean corporate; 
    private String brandName; 
    public String getBrandName() {
        return brandName;
    }
    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }
    public String getEmail() {
        return email;
    }
    public void setCorporate(boolean corporate) {
        this.corporate = corporate;
    }
    public String getFullName() {
        return fullName;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public boolean getCorporate(){
        return corporate;
    }
    


    
}

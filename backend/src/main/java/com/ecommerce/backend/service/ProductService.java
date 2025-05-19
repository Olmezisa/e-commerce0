package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.dto.VariantRequest;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductStatus;
import com.ecommerce.backend.entity.ProductVariant;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface ProductService {
    Product createProduct(ProductRequest request,MultipartFile imageFile);
    List<Product> getAllProducts();
    Product getProductById(Long id);
    Product updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
    Product approveProduct(Long productId);
    Product rejectProduct(Long productId);
    List<Product> getProductsByStatus(ProductStatus status);
    Long countProducts();
    long countProductsBySellerUsername(String username);
    List<Product> getProductsBySellerUsername(String username);
    Product unbanProduct(Long id);
    List<ProductVariant> getVariantsForProduct(Long productId);
    ProductVariant createVariant(Long productId, VariantRequest dto);
    ProductVariant updateVariant(Long variantId, VariantRequest dto);
    void deleteVariant(Long variantId);
    ProductVariant getVariantById(Long variantId);
    Product findTopSellingProductBySeller(String email);
BigDecimal calculateAverageProductPrice(String email);
List<Product> getProductsByCategory(Long categoryId);
List<Product> getProductsByCategory(String categoryName, ProductStatus status);


    

}

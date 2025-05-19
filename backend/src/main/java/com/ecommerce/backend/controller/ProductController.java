package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.dto.SellerDto;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductStatus;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.service.ProductService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Product> createProduct(@RequestBody ProductRequest request) {
        Product product = productService.createProduct(request);
        return ResponseEntity.ok(product);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getProducts(
            @RequestParam(value = "status", required = false) ProductStatus status,
            @RequestParam(value = "category", required = false) String categoryName) {

        List<Product> products;
        if (categoryName != null) {
            products = productService.getProductsByCategory(categoryName, status);
        } else if (status != null) {
            products = productService.getProductsByStatus(status);
        } else {
            products = productService.getAllProducts();
        }

        List<ProductResponse> response = products.stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        Product p = productService.getProductById(id);
        return ResponseEntity.ok(toResponse(p));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {

    productService.deleteProduct(id);
    return ResponseEntity.noContent().build();
}


    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveProduct(@PathVariable Long id) {
        productService.approveProduct(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> rejectProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.rejectProduct(id));
    }

    @PutMapping("/{id}/unban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> unbanProduct(@PathVariable Long id) {
        Product updated = productService.unbanProduct(id);
        return ResponseEntity.ok(toResponse(updated));
    }

    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getProductCount() {
        return ResponseEntity.ok(productService.countProducts());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(@PathVariable Long categoryId) {
        List<Product> products = productService.getProductsByCategory(categoryId);
        List<ProductResponse> dto = products.stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(dto);
    }

    private ProductResponse toResponse(Product p) {
        SellerDto sellerDto = null;
        if (p.getSeller() != null) {
            sellerDto = new SellerDto(
                    p.getSeller().getId(),
                    p.getSeller().getFullName(),
                    p.getSeller().getEmail()
            );
        }

        String categoryName = (p.getCategory() != null) ? p.getCategory().getName() : null;

        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getStock(),
                p.getImageUrl(),
                p.getStatus(),
                sellerDto,
                categoryName,
                p.getRating(),
                p.getReviews().size()
        );
    }
    
}

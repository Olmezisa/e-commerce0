package com.ecommerce.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductStatus;
import com.ecommerce.backend.repository.ProductRepository;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductRepository productRepository;

    public AdminProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Product>> getPendingProducts() {
        List<Product> pending = productRepository.findByStatus(ProductStatus.PENDING);
        return ResponseEntity.ok(pending);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveProduct(@PathVariable Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        p.setStatus(ProductStatus.ACTIVE);
        productRepository.save(p);
        return ResponseEntity.ok("Product approved.");
    }

    @PutMapping("/{id}/ban")
    public ResponseEntity<String> banProduct(@PathVariable Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        p.setStatus(ProductStatus.BANNED);
        productRepository.save(p);
        return ResponseEntity.ok("Product banned.");
    }
}

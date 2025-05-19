package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.VariantRequest;
import com.ecommerce.backend.dto.VariantResponse;
import com.ecommerce.backend.entity.ProductVariant;
import com.ecommerce.backend.service.ProductService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")

public class ProductVariantController {

    private final ProductService productService;

    public ProductVariantController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/{productId}/variants")
    public ResponseEntity<List<VariantResponse>> getVariants(@PathVariable Long productId) {
        List<ProductVariant> variants = productService.getVariantsForProduct(productId);
        List<VariantResponse> response = variants.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{productId}/variants")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<VariantResponse> createVariant(
            @PathVariable Long productId,
            @Valid @RequestBody VariantRequest dto) {
        ProductVariant v = productService.createVariant(productId, dto);
        return ResponseEntity.ok(toResponse(v));
    }

    @PutMapping("/variants/{variantId}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<VariantResponse> updateVariant(
            @PathVariable Long variantId,
            @Valid @RequestBody VariantRequest dto) {
        ProductVariant v = productService.updateVariant(variantId, dto);
        return ResponseEntity.ok(toResponse(v));
    }

    @DeleteMapping("/variants/{variantId}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Void> deleteVariant(@PathVariable Long variantId) {
        productService.deleteVariant(variantId);
        return ResponseEntity.noContent().build();
    }

    private VariantResponse toResponse(ProductVariant v) {
        return new VariantResponse(
            v.getId(),
            v.getProduct().getId(),
            v.getSku(),
            v.getOptionName(),
            v.getOptionValue(),
            v.getPrice(),
            v.getStock(),
            v.getImageUrl()
        );
    }
}

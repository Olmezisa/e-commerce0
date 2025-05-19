package com.ecommerce.backend.controller;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.dto.SellerDashboardDto;
import com.ecommerce.backend.dto.SellerDto;
import com.ecommerce.backend.entity.OrderStatus;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.service.OrderService;
import com.ecommerce.backend.service.ProductService;

@RestController
@RequestMapping("/api/seller")
@PreAuthorize("hasRole('SELLER')")
public class SellerController {

    private final ProductService productService;
    private final OrderService orderService;

    public SellerController(ProductService productService, OrderService orderService) {
        this.productService = productService;
        this.orderService = orderService;
    }

@GetMapping("/dashboard")
public ResponseEntity<SellerDashboardDto> getDashboard(Principal principal) {
    String email = principal.getName();

    long totalProducts = productService.countProductsBySellerUsername(email);
    long totalOrders = orderService.countOrdersBySellerEmail(email);
    long pendingOrders = orderService.countOrdersBySellerEmailAndStatus(email, OrderStatus.PENDING);
    BigDecimal revenue = orderService.sumRevenueBySellerEmail(email);

    Product topProduct = productService.findTopSellingProductBySeller(email);
    BigDecimal avgPrice = productService.calculateAverageProductPrice(email);

    SellerDashboardDto dto = new SellerDashboardDto(
        totalProducts,
        totalOrders,
        pendingOrders,
        revenue,
        topProduct != null ? topProduct.getName() : "Veri yok",
        topProduct != null ? topProduct.getTotalSales() : 0,
        avgPrice != null ? avgPrice : BigDecimal.ZERO
    );

    return ResponseEntity.ok(dto);
}

    @GetMapping("/my-products")
    public ResponseEntity<List<ProductResponse>> getMyProducts(Principal principal) {
        String email = principal.getName();
        List<Product> products = productService.getProductsBySellerUsername(email);

        List<ProductResponse> dto = products.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

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

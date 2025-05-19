package com.ecommerce.backend.controller;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.dto.SellerDashboardDto;
import com.ecommerce.backend.dto.SellerDto;
import com.ecommerce.backend.entity.OrderStatus;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductStatus;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.service.OrderService;
import com.ecommerce.backend.service.ProductService;
import com.ecommerce.backend.service.UserService;


@RestController
@RequestMapping("/api/seller")
@PreAuthorize("hasRole('SELLER')")
public class SellerController {

    private final ProductService productService;
    private final OrderService orderService;
    private final ProductRepository productRepository;
    private final UserService userService;
    public SellerController(ProductService productService, OrderService orderService,ProductRepository productRepository,UserService userService) {
        this.productService = productService;
        this.orderService = orderService;
        this.productRepository=productRepository;
        this.userService=userService;
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
    @DeleteMapping("/{productId}/delete")
    public ResponseEntity<Void> deleteOwnProduct(@PathVariable Long productId) {
    User seller = userService.getCurrentUser();
    Product product = productService.getProductById(productId);

    if (!product.getSeller().getId().equals(seller.getId())) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bu ürünü silme yetkiniz yok");
    }

    productService.deleteProduct(productId);
    return ResponseEntity.noContent().build();
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

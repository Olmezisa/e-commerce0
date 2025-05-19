package com.ecommerce.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.dto.OrderResponse;
import com.ecommerce.backend.dto.ShipmentStatusUpdateRequest;
import com.ecommerce.backend.service.OrderService;


@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getOrderCount() {
        return ResponseEntity.ok(orderService.countOrders());
    }
    

    @PostMapping("/create")
    @PreAuthorize("hasRole('BUYER')")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@RequestBody OrderRequest orderRequest) {
        return orderService.placeOrder(orderRequest);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('BUYER')")
    public List<OrderResponse> getMyOrders() {
        return orderService.getOrdersForBuyer();
    }

    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    public List<OrderResponse> getSellerOrders() {
        return orderService.getOrdersForSeller();
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('SELLER','BUYER')")
    public void cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(id);
    }

    @PostMapping("/{id}/cancel")
    public OrderResponse cancel(@PathVariable("id") Long id) {
        return orderService.cancelOrder(id);
    }

    @GetMapping("/{id}")
    public OrderResponse getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PutMapping("/{id}/shipment")
    @ResponseStatus(HttpStatus.OK)
    public OrderResponse updateShipmentStatus(
            @PathVariable Long id,
            @RequestBody ShipmentStatusUpdateRequest req
    ) {
        return orderService.updateShipmentStatus(id, req.getShipmentStatus());
    }    
    @PostMapping("/{id}/admin-cancel")
@PreAuthorize("hasRole('ADMIN')")
public OrderResponse cancelOrderAsAdmin(@PathVariable("id") Long id) {
    return orderService.cancelOrder(id);
}

    @GetMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public List<OrderResponse> getAllOrdersForAdmin() {
    return orderService.getAllOrdersForAdmin();
}

    @PostMapping("/{orderId}/items/{itemId}/cancel")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void cancelOrderItem(
      @PathVariable Long orderId,
      @PathVariable Long itemId) {
    orderService.cancelOrderItem(orderId, itemId);
}

    

}

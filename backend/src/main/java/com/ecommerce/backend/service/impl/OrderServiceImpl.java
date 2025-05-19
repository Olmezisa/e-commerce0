package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.dto.OrderItemRequest;
import com.ecommerce.backend.dto.OrderItemResponse;
import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.dto.OrderResponse;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.OrderItemStatus;
import com.ecommerce.backend.entity.OrderStatus;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.Role;
import com.ecommerce.backend.entity.ShipmentStatus;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.service.OrderService;
import com.ecommerce.backend.service.PaymentService;
import com.ecommerce.backend.service.UserService;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    private final PaymentService paymentService;

    public OrderServiceImpl(OrderRepository orderRepository,ProductRepository productRepository,UserService userService,PaymentService paymentService) {
        this.orderRepository = orderRepository;
        this.productRepository=productRepository;
        this.userService=userService;
        this.paymentService = paymentService;
    }

    @Override
    public Long countOrders() {
        return orderRepository.count();
    }

    @Override
    public long countOrdersBySellerEmail(String sellerEmail) {
        return orderRepository.countBySellerEmail(sellerEmail);
    }

    @Override
    public long countOrdersBySellerEmailAndStatus(String sellerEmail, OrderStatus status) {
        return orderRepository.countBySellerEmailAndStatus(sellerEmail, status);
    }

    @Override
    public BigDecimal sumRevenueBySellerEmail(String sellerEmail) {
        return orderRepository.sumTotalAmountBySellerEmail(sellerEmail);
    }

    @Override
    public List<Order> findOrdersBySellerEmail(String sellerEmail) {
        return orderRepository.findAllBySellerEmail(sellerEmail);
    }

     @Override
    public OrderResponse placeOrder(OrderRequest request) {
        var pi = paymentService.retrievePaymentIntent(request.getPaymentIntentId());
        if (!"succeeded".equals(pi.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ödeme tamamlanmadı: " + pi.getStatus());
        }
        User buyer = userService.getCurrentUser();
        Product first = productRepository.findById(request.getItems().get(0).getProductId())
                          .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        User seller = first.getSeller();

        Order order = new Order();
        order.setBuyer(buyer);
        order.setSeller(seller);
        order.setPaymentIntentId(pi.getId());
        order.setStatus(OrderStatus.PAID);

    for (OrderItemRequest ir : request.getItems()) {
        Product p = productRepository.findById(ir.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (p.getStock() < ir.getQuantity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Yetersiz stok: " + p.getName());
        }

        p.setStock(p.getStock() - ir.getQuantity());
        productRepository.save(p);

        OrderItem item = new OrderItem();
        item.setProduct(p);
        item.setQuantity(ir.getQuantity());
        item.setUnitPrice(p.getPrice());
        order.addItem(item);
    }

    BigDecimal total = order.getItems().stream()
        .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    order.setTotalAmount(total);

    Order saved = orderRepository.save(order);
    return toResponse(saved);
}


    @Override
    public List<OrderResponse> getOrdersForBuyer() {
        User buyer = userService.getCurrentUser();
        return orderRepository.findAllByBuyer(buyer).stream()
                        .map(this::toResponse)
                        .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getOrdersForSeller() {
        User seller = userService.getCurrentUser();
        return orderRepository.findAllBySeller(seller).stream()
                        .map(this::toResponse)
                        .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
          .orElseThrow(() -> new ResponseStatusException(
              HttpStatus.NOT_FOUND, "Sipariş bulunamadı: " + orderId));
        User current = userService.getCurrentUser();
        boolean isBuyer = order.getBuyer().getId().equals(current.getId());
        boolean isSeller = order.getSeller().getId().equals(current.getId());
        if (!isBuyer && !isSeller) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bu siparişi görmeye yetkiniz yok");
        }
        return toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse updateShipmentStatus(Long orderId, ShipmentStatus newStatus) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Sipariş bulunamadı: " + orderId));
        if (!order.getSeller().equals(userService.getCurrentUser())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bu işlemi yapmaya yetkiniz yok");
        }
        order.setShipmentStatus(newStatus);
        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }
    @Override
@Transactional
public void cancelOrderItem(Long orderId, Long itemId) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order bulunamadı"));

    OrderItem item = order.getItems().stream()
        .filter(i -> i.getId().equals(itemId))
        .findFirst()
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order item bulunamadı"));

    User current = userService.getCurrentUser();
    boolean isBuyer  = order.getBuyer().getId().equals(current.getId());
    boolean isSeller = order.getSeller().getId().equals(current.getId());
    if (!isBuyer && !isSeller) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bu kalemi iptal etme yetkiniz yok");
    }
    if (item.getStatus() == OrderItemStatus.CANCELLED) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bu kalem zaten iptal edilmiş");
    }

    // 1) iade miktarını kuruş olarak hesapla
    long refundAmount = item.getUnitPrice()                 // BigDecimal ₺ cinsinden
        .multiply(BigDecimal.valueOf(item.getQuantity()))   // ₺ * adet
        .movePointRight(2)                                  // kuruş cinsine (örneğin 25.50 ₺ → 2550)
        .longValueExact();

    // 2) Stripe’dan kısmi iade talebi
    paymentService.refundPaymentIntentPartial(order.getPaymentIntentId(), refundAmount);

    // 3) kalemi iptal et
    item.setStatus(OrderItemStatus.CANCELLED);

    // 4) eğer siparişte artık aktif (cancelled olmayan) kalem kalmadıysa siparişi de iptal et
    boolean allCancelled = order.getItems().stream()
        .allMatch(i -> i.getStatus() == OrderItemStatus.CANCELLED);
    if (allCancelled) {
        order.setStatus(OrderStatus.CANCELLED);
    }
}



    @Override
@Transactional
public OrderResponse cancelOrder(Long orderId) {
    // 1) Mevcut siparişi getir
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Order bulunamadı: " + orderId));

    // 2) Sadece alıcı veya satıcı iptal edebilir
    User current = userService.getCurrentUser();
    Role userRole = current.getRole();
    boolean isBuyer  = order.getBuyer().getId().equals(current.getId());
    boolean isSeller = order.getSeller().getId().equals(current.getId());
    boolean isAdmin = userRole != null && userRole.name().equals("ADMIN");

    if (!isBuyer && !isSeller&&!isAdmin ) {
        throw new ResponseStatusException(
            HttpStatus.FORBIDDEN, "Bu siparişi iptal etme yetkiniz yok");
    }

    // 3) Yalnızca PAID durumundaki siparişler iptal edilebilir
    if (order.getStatus() != OrderStatus.PAID) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST, 
            "Sadece PAID durumundaki siparişler iptal edilebilir");
    }

    // 4) Stripe iadesi
    paymentService.refundPayment(order.getPaymentIntentId());

    // 5) Ürün stoklarını geri yükle
    order.getItems().forEach(item -> {
        Product p = item.getProduct();
        p.setStock(p.getStock() + item.getQuantity());
        productRepository.save(p);
    });

    // 6) Sipariş durumlarını güncelle
    order.setStatus(OrderStatus.CANCELLED);
    // eğer ShipmentStatus enum’ınız varsa:
    // veya null tercih ediyorsanız:
    // order.setShipmentStatus(null);

    orderRepository.save(order);

    // 7) Güncellenmiş cevabı dön
    return toResponse(order);
}
    private OrderResponse toResponse(Order o) {
        List<OrderItemResponse> items = o.getItems().stream().map(i ->
            new OrderItemResponse(
                i.getProduct().getId(),
                i.getProduct().getName(),
                i.getQuantity(),
                i.getUnitPrice(),
                i.getProduct().getImageUrl(),
                i.getStatus(),
                i.getId()
            )
        ).collect(Collectors.toList());

        return new OrderResponse(
            o.getId(),
            o.getStatus(),
            o.getShipmentStatus(),
            o.getCreatedAt(),
            items
        );
    }
    @Override
    public Product findTopSellingProductBySellerEmail(String email) {
        return productRepository.findTopProductBySellerEmail(email)
            .orElse(null); 
    }
    @Override
public List<OrderResponse> getAllOrdersForAdmin() {
    return orderRepository.findAll().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
}

    @Override
    public BigDecimal calculateAverageProductPrice(String email) {
        return productRepository.calculateAveragePriceBySellerEmail(email);
    }
}

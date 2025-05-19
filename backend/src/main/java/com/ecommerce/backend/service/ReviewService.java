package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ReviewRequest;
import com.ecommerce.backend.dto.ReviewResponse;

import java.util.List;

public interface ReviewService {
    void saveReview(ReviewRequest request, String userEmail);
    List<ReviewResponse> getReviewsByProductId(Long productId);
}

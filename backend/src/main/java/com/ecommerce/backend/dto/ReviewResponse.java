package com.ecommerce.backend.dto;

public class ReviewResponse {
    private String userName;
    private String date;
    private int rating;
    private String comment;

    public ReviewResponse(String userName, String date, int rating, String comment) {
        this.userName = userName;
        this.date     = date;
        this.rating   = rating;
        this.comment  = comment;
    }

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }

    public int getRating() {
        return rating;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }
    public void setComment(String comment) {
        this.comment = comment;
    }
}

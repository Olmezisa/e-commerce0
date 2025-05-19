package com.ecommerce.backend.dto;

import com.ecommerce.backend.entity.ShipmentStatus;

public class ShipmentStatusUpdateRequest {
    private ShipmentStatus shipmentStatus;
    public ShipmentStatus getShipmentStatus() {
         return shipmentStatus; }
    public void setShipmentStatus(ShipmentStatus shipmentStatus) {
        this.shipmentStatus = shipmentStatus;
    }
}
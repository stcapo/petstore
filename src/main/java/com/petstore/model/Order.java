package com.petstore.model;

import lombok.Data;
import java.util.Date;

@Data
public class Order {
    private Long id;
    private Long petId;
    private Long userId;
    private Integer quantity;
    private Date orderDate;
    private String status; // 订单状态：已创建、已取消等
} 
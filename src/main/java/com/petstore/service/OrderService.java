package com.petstore.service;

import com.petstore.model.Order;
import java.util.List;

public interface OrderService {
    List<Order> findAllOrders();
    Order findOrderById(Long id);
    List<Order> findOrdersByUserId(Long userId);
    Order createOrder(Order order);
    Order cancelOrder(Long id);
    boolean deleteOrder(Long id);
} 
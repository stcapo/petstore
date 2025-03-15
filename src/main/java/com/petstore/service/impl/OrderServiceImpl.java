package com.petstore.service.impl;

import com.petstore.model.Order;
import com.petstore.model.Pet;
import com.petstore.repository.OrderMapper;
import com.petstore.service.OrderService;
import com.petstore.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private PetService petService;

    @Override
    public List<Order> findAllOrders() {
        return orderMapper.findAll();
    }

    @Override
    public Order findOrderById(Long id) {
        return orderMapper.findById(id);
    }

    @Override
    public List<Order> findOrdersByUserId(Long userId) {
        return orderMapper.findByUserId(userId);
    }

    @Override
    public Order createOrder(Order order) {
        // 设置订单日期和状态
        order.setOrderDate(new Date());
        order.setStatus("已创建");
        
        // 保存订单
        orderMapper.insert(order);
        
        // 更新宠物状态为已售出
        Pet pet = petService.findPetById(order.getPetId());
        if (pet != null) {
            pet.setStatus("已售出");
            petService.updatePet(pet);
        }
        
        return order;
    }

    @Override
    public Order cancelOrder(Long id) {
        Order order = orderMapper.findById(id);
        if (order != null) {
            orderMapper.updateStatus(id, "已取消");
            
            // 恢复宠物状态为可用
            Pet pet = petService.findPetById(order.getPetId());
            if (pet != null) {
                pet.setStatus("可用");
                petService.updatePet(pet);
            }
            
            order.setStatus("已取消");
        }
        return order;
    }

    @Override
    public boolean deleteOrder(Long id) {
        return orderMapper.deleteById(id) > 0;
    }
} 
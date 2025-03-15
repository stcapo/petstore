package com.petstore.repository;

import com.petstore.model.Order;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface OrderMapper {
    
    @Select("SELECT * FROM `order`")
    List<Order> findAll();
    
    @Select("SELECT * FROM `order` WHERE id = #{id}")
    Order findById(Long id);
    
    @Select("SELECT * FROM `order` WHERE user_id = #{userId}")
    List<Order> findByUserId(Long userId);
    
    @Insert("INSERT INTO `order`(pet_id, user_id, quantity, order_date, status) VALUES(#{petId}, #{userId}, #{quantity}, #{orderDate}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Order order);
    
    @Update("UPDATE `order` SET status = #{status} WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") String status);
    
    @Delete("DELETE FROM `order` WHERE id = #{id}")
    int deleteById(Long id);
} 
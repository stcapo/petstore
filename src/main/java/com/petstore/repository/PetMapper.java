package com.petstore.repository;

import com.petstore.model.Pet;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface PetMapper {
    
    @Select("SELECT * FROM pet")
    List<Pet> findAll();
    
    @Select("SELECT * FROM pet WHERE id = #{id}")
    Pet findById(Long id);
    
    @Insert("INSERT INTO pet(name, species, price, status) VALUES(#{name}, #{species}, #{price}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Pet pet);
    
    @Update("UPDATE pet SET name = #{name}, species = #{species}, price = #{price}, status = #{status} WHERE id = #{id}")
    int update(Pet pet);
    
    @Delete("DELETE FROM pet WHERE id = #{id}")
    int deleteById(Long id);
} 
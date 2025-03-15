package com.petstore.model;

import lombok.Data;

@Data
public class Pet {
    private Long id;
    private String name;
    private String species;
    private Double price;
    private String status; // 状态：可用、已售出等
} 
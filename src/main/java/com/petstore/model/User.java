package com.petstore.model;

import lombok.Data;

@Data
public class User {
    private Long id;
    private String username;
    private String password;
    private String role; // 角色：admin、user等
} 
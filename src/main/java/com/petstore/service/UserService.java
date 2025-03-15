package com.petstore.service;

import com.petstore.model.User;
import java.util.List;

public interface UserService {
    List<User> findAllUsers();
    User findUserById(Long id);
    User findUserByUsername(String username);
    User registerUser(User user);
    User updateUser(User user);
    boolean deleteUser(Long id);
    User login(String username, String password);
} 
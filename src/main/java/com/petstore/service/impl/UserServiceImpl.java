package com.petstore.service.impl;

import com.petstore.model.User;
import com.petstore.repository.UserMapper;
import com.petstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public List<User> findAllUsers() {
        return userMapper.findAll();
    }

    @Override
    public User findUserById(Long id) {
        return userMapper.findById(id);
    }

    @Override
    public User findUserByUsername(String username) {
        return userMapper.findByUsername(username);
    }

    @Override
    public User registerUser(User user) {
        // 默认为普通用户
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("user");
        }
        userMapper.insert(user);
        return user;
    }

    @Override
    public User updateUser(User user) {
        userMapper.update(user);
        return user;
    }

    @Override
    public boolean deleteUser(Long id) {
        return userMapper.deleteById(id) > 0;
    }

    @Override
    public User login(String username, String password) {
        User user = userMapper.findByUsername(username);
        if (user != null && Objects.equals(user.getPassword(), password)) {
            return user;
        }
        return null;
    }
} 
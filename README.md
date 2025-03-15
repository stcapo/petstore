# 宠物商店系统

一个简单的宠物商店管理系统，基于 Spring Boot 和 MyBatis 实现。

## 环境要求

- Java 8
- MySQL 5.7
- Maven

## 功能列表

- 宠物管理：增删改查
- 订单管理：创建/查询/取消
- 用户管理：注册/登录/权限控制

## 快速开始

1. 创建 MySQL 数据库
```sql
CREATE DATABASE petstore;
```

2. 修改 `application.yml` 中的数据库连接信息

3. 运行应用
```bash
mvn spring-boot:run
```

## API 接口

### 宠物管理
- GET /api/pets - 获取所有宠物
- GET /api/pets/{id} - 获取指定宠物
- POST /api/pets - 添加宠物
- PUT /api/pets/{id} - 更新宠物
- DELETE /api/pets/{id} - 删除宠物

### 用户管理
- POST /api/users/register - 用户注册
- POST /api/users/login - 用户登录
- GET /api/users - 获取所有用户
- GET /api/users/{id} - 获取指定用户
- PUT /api/users/{id} - 更新用户
- DELETE /api/users/{id} - 删除用户

### 订单管理
- GET /api/orders - 获取所有订单
- GET /api/orders/{id} - 获取指定订单
- GET /api/orders/user/{userId} - 获取用户的所有订单
- POST /api/orders - 创建订单
- PUT /api/orders/{id}/cancel - 取消订单
- DELETE /api/orders/{id} - 删除订单 
DROP DATABASE IF EXISTS `petstore`;
CREATE DATABASE `petstore` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `petstore`;
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
                         `id` bigint(20) NOT NULL AUTO_INCREMENT,
                         `pet_id` bigint(20) NOT NULL,
                         `user_id` bigint(20) NOT NULL,
                         `quantity` int(11) NOT NULL,
                         `order_date` datetime NOT NULL,
                         `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
                         PRIMARY KEY (`id`),
                         KEY `pet_id` (`pet_id`),
                         KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `order` VALUES (1,4,3,1,'2025-03-15 02:31:18','已创建'),(2,6,3,1,'2025-03-15 02:31:22','已创建');
DROP TABLE IF EXISTS `pet`;
CREATE TABLE `pet` (
                       `id` bigint(20) NOT NULL AUTO_INCREMENT,
                       `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                       `species` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
                       `price` decimal(10,2) NOT NULL,
                       `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
                       PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pet` VALUES (3,'小花','猫',500.00,'可用'),(4,'小黄','狗',300.00,'已售出'),(5,'小黑','兔子',1200.00,'可用'),(6,'小白','猫',800.00,'已售出'),(7,'小花','狗',500.00,'可用'),(8,'小黄','仓鼠',300.00,'可用'),(9,'小黑','猫',1200.00,'可用'),(10,'小白','狗',800.00,'可用');


DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
                        `id` bigint(20) NOT NULL AUTO_INCREMENT,
                        `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
                        `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                        `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
                        PRIMARY KEY (`id`),
                        UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user` VALUES (1,'admin','admin123','admin'),(2,'user1','user123','user'),(3,'user2','user123','user');


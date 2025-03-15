package com.petstore.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "redirect:/static/shop/index.html";
    }
    
    @GetMapping("/admin")
    public String admin() {
        return "redirect:/static/login.html";
    }
    
    @GetMapping("/shop")
    public String shop() {
        return "redirect:/static/shop/index.html";
    }
}
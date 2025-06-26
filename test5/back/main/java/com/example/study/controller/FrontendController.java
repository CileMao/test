package com.example.study.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class FrontendController {

    // 处理所有前端路由，返回index.html
    @GetMapping(value = {"/soil-app", "/soil-app/**"})
    public ModelAndView index() {
        return new ModelAndView("forward:/index.html");
    }
}
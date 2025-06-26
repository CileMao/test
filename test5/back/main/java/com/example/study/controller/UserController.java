package com.example.study.controller;

import com.example.study.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> request) {
        // 验证请求是否为空
        if (request == null) {
            return "登录失败:请求体不能为空";
        }

        String username = request.get("username");
        String password = request.get("password");

        // 验证参数是否存在
        if (username == null || password == null) {
            return "登录失败:用户名或密码不能为空";
        }

        boolean isValid = userService.validateUser(username, password);
        if (isValid) {
            return "登录成功";
        } else {
            return "登录失败:用户名或密码错误";
        }
    }

    @PostMapping("/register")
    public String register(@RequestBody Map<String, String> request) {
        // 验证请求是否为空
        if (request == null) {
            return "注册失败:请求体不能为空";
        }

        String username = request.get("username");
        String password = request.get("password");
        String email = request.get("email");
        String role = request.get("role");

        // 验证参数是否存在
        if (username == null || password == null || email == null || role == null) {
            return "注册失败:用户名、密码、邮箱或角色不能为空";
        }

        if (userService.existsByUsername(username)) {
            return "注册失败:用户名已存在";
        }

        userService.register(username, password, email, role);
        return "注册成功";
    }
}
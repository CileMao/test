package com.example.study.config;

import com.example.study.entity.User;
import com.example.study.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        // 检查是否已有默认管理员账号
        if (userRepository.findByUsername("admin") == null) {
            initDefaultAdmin();
        }
    }

    private void initDefaultAdmin() {
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@example.com");
        admin.setRole("ADMIN");

        // 加密默认密码
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        admin.setPassword(encoder.encode("admin123")); // 默认密码：admin123

        userRepository.save(admin);
        System.out.println("===== 默认管理员账号已创建 =====");
        System.out.println("用户名: admin");
        System.out.println("密码: admin123");
        System.out.println("请在生产环境中修改此密码！");
    }
}
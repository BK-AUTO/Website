package com.bkauto.web.runner;

import com.bkauto.web.common.authentication.User;
import com.bkauto.web.common.authentication.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

@Service
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        if (userRepository.findUserByUsername("admin") == null) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("$2a$12$xab3hG.0gE/7aWfHrWWzIuSkR3WSW3J.hFvPq4OxJcEcpX645o7R6"); //encrypted password
            admin.setEnabled(true);
            userRepository.save(admin);
        }
    }
}

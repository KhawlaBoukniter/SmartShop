package org.smartshop.controller;

import jakarta.servlet.http.HttpSession;
import org.smartshop.dto.LoginRequestDTO;
import org.smartshop.entity.User;
import org.smartshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request, HttpSession session) {
        return userRepository.findByUsername(request.getUsername())
                .filter(user -> org.springframework.security.crypto.bcrypt.BCrypt.checkpw(request.getPassword(), user.getPassword()))
                .map(user -> {
                    session.setAttribute("userId", user.getId());
                    session.setAttribute("role", user.getRole().name());
                    return ResponseEntity.ok("Login successful");
                })
                .orElse(ResponseEntity.status(401).body("Identifiants incorrects"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logout successful");
    }
}
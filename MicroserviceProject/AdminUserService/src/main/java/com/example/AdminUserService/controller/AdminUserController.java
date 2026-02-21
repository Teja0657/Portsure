package com.example.AdminUserService.controller;

import com.example.AdminUserService.dto.AdminUserDTO;
import com.example.AdminUserService.entity.AdminUser;
import com.example.AdminUserService.repositiory.AdminUserRepositiory;
import com.example.AdminUserService.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/internal")
public class AdminUserController {

    @Autowired
    private AdminUserRepositiory adminUserRepositiory;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        try {
            Authentication authenticate = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(email, password));
            if (authenticate.isAuthenticated()) {
                AdminUser user = adminUserRepositiory.findByEmail(email).orElseThrow();
                String token = jwtUtil.generateToken(email, user.getRole());
                user.setPassword(null); // Safety: Don't return password hash
                return ResponseEntity.ok(Map.of("token", token, "user", user));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AdminUserDTO userDTO) {
        // 1. Validate Secret Key
        if (userDTO.getSecretKey() == null || !userDTO.getSecretKey().equals("admin@123")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access Denied: Invalid or missing Secret Key.");
        }

        // 2. Check if user already exists
        if (adminUserRepositiory.findByEmail(userDTO.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User with this email already exists.");
        }

        // 3. Create and Save User
        AdminUser newUser = new AdminUser();
        newUser.setEmail(userDTO.getEmail());
        newUser.setPassword(passwordEncoder.encode(userDTO.getPassword())); // Secure hashing
        newUser.setFullName(userDTO.getFullName());
        newUser.setRole(userDTO.getRole());
        

        adminUserRepositiory.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully.");
    }

    @GetMapping("/profile/{staffId}")
    public ResponseEntity<?> getProfile(@PathVariable Long staffId) {
        return adminUserRepositiory.findByStaffId(staffId)
                .map(user -> {
                    user.setPassword(null);
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
package com.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.dto.LoginDto;
import com.example.dto.RegisterDto;
import com.example.entity.User;
import com.example.service.UserService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Optional;
import java.util.Base64;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Value("${upload.directory}")
    private String uploadDir;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestParam("email") String email,
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("role") String role,  // Added role
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) {

        if (email == null || username == null || password == null || role == null ||
            email.isEmpty() || username.isEmpty() || password.isEmpty() || role.isEmpty()) {
            return new ResponseEntity<>("All fields (email, username, password, role) are required", HttpStatus.BAD_REQUEST);
        }

        if (!role.equalsIgnoreCase("Farmer") && !role.equalsIgnoreCase("Customer") && !role.equalsIgnoreCase("Staff")) {
            return new ResponseEntity<>("Invalid role. Allowed roles: Farmer, Customer, Staff.", HttpStatus.BAD_REQUEST);
        }

        Optional<User> existingUserOpt = userService.getUserByEmail(email);

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            if (!existingUser.isActive()) {
                userService.deleteUser(existingUser);
            } else {
                return new ResponseEntity<>("Email is already registered and verified. Please login.", HttpStatus.BAD_REQUEST);
            }
        }

        String profilePicturePath = null;
        if (profilePicture != null && !profilePicture.isEmpty()) {
            profilePicturePath = userService.saveProfilePicture(profilePicture);
            if (profilePicturePath == null) {
                return new ResponseEntity<>("Failed to save profile picture.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        RegisterDto registerDto = new RegisterDto(email, username, password, role, profilePicturePath);
        String response = userService.register(registerDto);

        if ("Success".equals(response)) {
            return new ResponseEntity<>("Registration successful. Please verify your email.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/verify")
    public ResponseEntity<String> verifyAccount(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and OTP are required");
        }

        try {
            String response = userService.verifyAccount(email, otp);

            if ("Verification successful".equals(response)) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("An error occurred during verification: " + e.getMessage());
        }
    }


    @PutMapping("/regenerate-otp")
    public ResponseEntity<String> regenerateOtp(@RequestParam("email") String email) {
        try {
            String response = userService.regenerateOtp(email);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        Map<String, Object> response = userService.login(loginDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String response = userService.forgotPassword(email);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        Map<String, Object> response = userService.resetPassword(token, newPassword);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") Integer id) {
        if (id == null) {
            return new ResponseEntity<>("User ID is missing", HttpStatus.BAD_REQUEST);
        }
        try {
            User user = userService.getUserById(id);
            if (user == null) {
                return new ResponseEntity<>("User not found with ID: " + id, HttpStatus.NOT_FOUND);
            }

            if (user.getProfilePicture() != null) {
                Path imagePath = Paths.get(uploadDir + user.getProfilePicture());
                if (Files.exists(imagePath)) {
                    byte[] imageBytes = Files.readAllBytes(imagePath);
                    String base64Image = "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(imageBytes);
                    user.setProfilePicture(base64Image); // Set the Base64 image to the user
                }
            }

            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to fetch user details: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateProfile")
    public ResponseEntity<String> updateProfile(
            @RequestParam("userId") Long userId,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "email", required = false) String email,

            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "role", required = false) String role,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) { // Change from @RequestParam to @RequestPart

        String response = userService.updateUserProfile(userId, name,email, password, role, profilePicture);

        if ("User profile updated successfully.".equals(response)) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }


}

package com.example.service;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.util.StringUtils;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.dto.LoginDto;
import com.example.dto.RegisterDto;
import com.example.entity.User;
import com.example.repo.UserRepository;
import com.example.utils.EmailUtil;
import com.example.utils.OtpUtil;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private OtpUtil otpUtil;

    @Autowired
    private EmailUtil emailUtil;

    @Autowired
    private UserRepository userRepository;
    @Value("${upload.directory}")
    private String uploadDir;

    @Transactional
    public String register(RegisterDto registerDto) {
        Optional<User> existingUser = userRepository.findByEmail(registerDto.getEmail());

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            if (!user.isActive()) {
                deleteUser(user);
            } else {
                return "Email is already registered and verified. Please login.";
            }
        }

        String otp = otpUtil.generateOtp();
        try {
            emailUtil.sendOtpEmail(registerDto.getEmail(), otp);
        } catch (MessagingException e) {
            throw new RuntimeException("Unable to send OTP. Please try again.");
        }

        User newUser = new User();
        newUser.setName(registerDto.getName());
        newUser.setEmail(registerDto.getEmail());
        newUser.setPassword(registerDto.getPassword());
        newUser.setRole(registerDto.getRole());  
        newUser.setOtp(otp);
        newUser.setOtpGeneratedTime(LocalDateTime.now());
        newUser.setActive(false);

        if (registerDto.getProfilePicturePath() != null) {
            newUser.setProfilePicture(registerDto.getProfilePicturePath());
        }

        userRepository.save(newUser);
        return "Success";
    }

    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public String saveProfilePicture(MultipartFile profilePicture) {
    	
        String fileName = UUID.randomUUID().toString() + "-" + StringUtils.cleanPath(profilePicture.getOriginalFilename());
        String filePath = "/profile_pics/" + fileName;

        try {
            Path uploadPath = Paths.get(uploadDir + "/profile_pics");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path targetPath = uploadPath.resolve(fileName);
            profilePicture.transferTo(targetPath.toFile());
            return filePath;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }



    public String verifyAccount(String email, String otp) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        // Check if user exists
        if (optionalUser.isEmpty()) {
            return "User not found";
        }

        User user = optionalUser.get();

        if (user.isActive()) {
            return "User is already verified";
        }

        // Validate OTP
        if (user.getOtp() != null && user.getOtp().equals(otp)) {
            user.setActive(true); 
            user.setOtp(null);    
            userRepository.save(user);
            return "Verification successful";
        }

        return "Invalid OTP. Please try again.";
    }


    public String regenerateOtp(String email) {
        try {
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with this email: " + email));
            
            String otp = otpUtil.generateOtp();
            emailUtil.sendOtpEmail(email, otp);
            
            user.setOtp(otp);
            user.setOtpGeneratedTime(LocalDateTime.now());
            userRepository.save(user);
            
            return "OTP sent successfully. Please verify your account within 30 seconds.";
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to resend OTP: " + e.getMessage());
        }
    }


    public List<User> getAllUsers() {
        return userRepository.findAll(); 
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id).orElse(null); 
    }

    public Map<String, Object> login(LoginDto loginDto) {
        Optional<User> optionalUser = userRepository.findByEmail(loginDto.getEmail());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (!user.isActive()) {
                return Map.of("message", "User not verified. Please verify your email.", "status", "failed");
            }

            if (user.getPassword().equals(loginDto.getPassword())) {
                return Map.of(
                    "message", "Login successful",
                    "userId", user.getId(), 
                    "role", user.getRole(),
                    "status", "success"
                );
            }
        }
        return Map.of("message", "Invalid email or password", "status", "failed");
    }

    @Scheduled(cron = "0 0/1 * * * ?") // Runs every minute
    public void cleanupOldUnverifiedUsers() {
        LocalDateTime thresholdTime = LocalDateTime.now().minusSeconds(60); 
        userRepository.deleteByOtpGeneratedTimeBefore(thresholdTime);
    }

    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with this email: " + email));

        // Generate a unique token for password reset
        String token = UUID.randomUUID().toString();
        user.setResetToken(token); // Assume you add a resetToken field to User entity
        user.setTokenGeneratedTime(LocalDateTime.now());
        userRepository.save(user);

        try {
            emailUtil.sendPasswordResetEmail(user.getEmail(), token);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset email");
        }
        return "Password reset email sent";
    }

    public Map<String, Object> resetPassword(String token, String newPassword) {
        Map<String, Object> response = new HashMap<>();
        User user = userRepository.findByResetToken(token)
            .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (Duration.between(user.getTokenGeneratedTime(), LocalDateTime.now()).getSeconds() > 3600) {
            response.put("success", false);
            response.put("message", "Token expired");
        } else {
            user.setPassword(newPassword);
            user.setResetToken(null);
            userRepository.save(user);

            response.put("success", true);
            response.put("message", "Password reset successful");
        }
        return response;
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null); 
    }
    
    public String updateUserProfile(Long userId, String name, String email,  String password, String role,  MultipartFile profilePicture) {
        Optional<User> optionalUser = userRepository.findById(userId);
        
        if (optionalUser.isEmpty()) {
            return "User not found";
        }

        User user = optionalUser.get();

        if (name != null && !name.isEmpty()) {
            user.setName(name);
        }

        if (password != null && !password.isEmpty()) {
            user.setPassword(password);
        }
        if (email != null && !email.isEmpty()) {
            user.setEmail(email);
        }


        if (role != null && !role.isEmpty()) {
            if (!role.equalsIgnoreCase("Farmer") && !role.equalsIgnoreCase("Customer") && !role.equalsIgnoreCase("Staff")) {
                return "Invalid role. Allowed roles: Farmer, Customer, Staff.";
            }
            user.setRole(role);
        }

        if (profilePicture != null && !profilePicture.isEmpty()) {
            String profilePicturePath = saveProfilePicture(profilePicture);
            if (profilePicturePath == null) {
                return "Failed to save profile picture.";
            }
            user.setProfilePicture(profilePicturePath);
        }

        userRepository.save(user);
        return "User profile updated successfully.";
    }


    
}

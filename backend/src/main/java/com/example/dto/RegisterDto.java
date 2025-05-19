package com.example.dto;

public class RegisterDto {
    private String email;
    private String name;
    private String password;
    private String role;  
    private String profilePicturePath;
    

    public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getProfilePicturePath() {
		return profilePicturePath;
	}

	public void setProfilePicturePath(String profilePicturePath) {
		this.profilePicturePath = profilePicturePath;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public RegisterDto(String email, String name, String password, String role, String profilePicturePath) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.role = role;
        this.profilePicturePath = profilePicturePath;
    }

    public String getRole() { return role; }
}

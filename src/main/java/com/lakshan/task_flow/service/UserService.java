package com.lakshan.task_flow.service;

import com.lakshan.task_flow.exception.DuplicateResourceException;
import com.lakshan.task_flow.exception.InvalidRoleException;
import com.lakshan.task_flow.exception.UserNotFoundException;
import com.lakshan.task_flow.model.UserRequest;
import com.lakshan.task_flow.entity.User;
import com.lakshan.task_flow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void addNewUser(UserRequest userRequest) {
        // Check if email already exists
        if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email already exists: " + userRequest.getEmail());
        }

        User user = new User();
        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        userRepository.save(user);
    }

    public List<User> getAllUsersByRole(String role){
        if(role.equals("USER")){
            return userRepository.findAll().stream()
                    .filter(user -> user.getRole().toString().equals("USER"))
                    .toList();
        }
        else if(role.equals("ADMIN")){
            return userRepository.findAll().stream()
                    .filter(user -> user.getRole().toString().equals("ADMIN"))
                    .toList();
        }
        else
            throw new InvalidRoleException("Invalid role: " + role + ". Valid roles are: USER, ADMIN");
    }

    public User getUserByEmail(String email){
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    public void updateUser(UserRequest userRequest){
        if(userRepository.existsById(userRequest.getId())){
            User user = new User();
            user.setId(userRequest.getId());
            user.setUsername(userRequest.getUsername());
            user.setEmail(userRequest.getEmail());
            user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
            userRepository.save(user);
        }
        else
            throw new UserNotFoundException("User not found with id: " + userRequest.getId());
    }

}

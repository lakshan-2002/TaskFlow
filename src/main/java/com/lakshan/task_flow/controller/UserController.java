package com.lakshan.task_flow.controller;

import com.lakshan.task_flow.entity.User;
import com.lakshan.task_flow.exception.InvalidCredentialsException;
import com.lakshan.task_flow.model.UserRequest;
import com.lakshan.task_flow.model.UserResponse;
import com.lakshan.task_flow.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> addUser(@Valid @RequestBody UserRequest userRequest){
        userService.addNewUser(userRequest);

        UserResponse userResponse = new UserResponse();
        userResponse.setUsername(userRequest.getUsername());
        userResponse.setEmail(userRequest.getEmail());

        return ResponseEntity.status(201).body(userResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody UserRequest userRequest) {
        var dbUser = userService.getUserByEmail(userRequest.getEmail());

        if(!passwordEncoder.matches(userRequest.getPassword(), dbUser.getPassword())){
            throw new InvalidCredentialsException("Invalid email or password");
        }

        UserResponse userResponse = new UserResponse();
        userResponse.setUsername(dbUser.getUsername());
        userResponse.setEmail(dbUser.getEmail());
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/{role}")
    public List<User> getAllUsersByRole(@PathVariable String role){
        return userService.getAllUsersByRole(role);
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateUser(@Valid @RequestBody UserRequest userRequest){
        userService.updateUser(userRequest);

        UserResponse userResponse = new UserResponse();
        userResponse.setUsername(userRequest.getUsername());
        userResponse.setEmail(userRequest.getEmail());

        return ResponseEntity.ok(userResponse);
    }

}

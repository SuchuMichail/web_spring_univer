package com.student.demo.controllers;

import com.student.demo.requests.user.AddUserRequest;
import com.student.demo.requests.user.DeleteUserRequest;
import com.student.demo.requests.user.LoginPasswordRequest;
import com.student.demo.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/addUser")
    public ResponseEntity<?> addUser(@Valid @RequestBody AddUserRequest addUserRequest) {
        return new ResponseEntity<>(userService.addUser(addUserRequest), HttpStatus.OK);
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<?> deleteUser(@Valid @RequestBody DeleteUserRequest deleteUserRequest){
        userService.deleteUser(deleteUserRequest);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginPasswordRequest loginPasswordRequest){
        System.out.println("AAAAAAAAAAAAAAAAAA\n" + userService.getUserByLP(loginPasswordRequest));
        return new ResponseEntity<>(userService.getUserByLP(loginPasswordRequest), HttpStatus.OK);
    }

    @GetMapping("{userId}/getPosts")
    public ResponseEntity<?> getPosts(@PathVariable("userId") long id){
        return new ResponseEntity<>(userService.getPosts(id), HttpStatus.OK);
    }
}

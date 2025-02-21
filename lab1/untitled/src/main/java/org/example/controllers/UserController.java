package org.example.controllers;

import jakarta.validation.Valid;
import org.example.requests.*;
import org.example.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/getIdByLoginPassword")
    public ResponseEntity<?> getIdByLoginPassword(@Valid @RequestBody GetIdRequest getIdRequest) {
        return new ResponseEntity<>(userService.getIdByLoginPassword(getIdRequest), HttpStatus.OK);
    }

    @PostMapping("/loadUser")
    public ResponseEntity<?> loadUser(@Valid @RequestBody LoadUserRequest loadUserRequest){
        return new ResponseEntity<>(userService.loadUser(loadUserRequest), HttpStatus.OK);
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<?> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @PostMapping("/addUser")
    public ResponseEntity<?> addUser(@Valid @RequestBody AddUserRequest addUserRequest) {
        return new ResponseEntity<>(userService.addUser(addUserRequest), HttpStatus.OK);
    }

    @PostMapping("/editUser")
    public ResponseEntity<?> editUser(@Valid @RequestBody EditUserRequest editUserRequest){
        userService.editUser(editUserRequest);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/deleteUser")
    public ResponseEntity<?> deleteUser(@Valid @RequestBody DeleteUserRequest deleteUserRequest){
        userService.deleteUser(deleteUserRequest);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}

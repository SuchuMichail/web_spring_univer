package com.student.demo.controllers;

import com.student.demo.exceptions.LoginExistsException;
import com.student.demo.requests.user.AddUserRequest;
import com.student.demo.requests.user.LoginPasswordRequest;
import com.student.demo.responses.user.UserDTO;
import com.student.demo.responses.user.UserWithPostsDTO;
import com.student.demo.security.JwtTokenUtils;
import com.student.demo.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private final UserService userService;
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenUtils jwtTokenUtils;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody AddUserRequest addUserRequest) {
        //System.out.println("ADD USER REQUEST " + addUserRequest);
        try {
            //System.out.println("TRY Register");
            UserDTO response = userService.addUser(addUserRequest);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (LoginExistsException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

/*
    @DeleteMapping("/deleteUser")
    public ResponseEntity<?> deleteUser(@Valid @RequestBody DeleteUserRequest deleteUserRequest){
        userService.deleteUser(deleteUserRequest);

        return new ResponseEntity<>(HttpStatus.OK);
    }
*/

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginPasswordRequest request){
        //System.out.println("AAAAAAAAAAAAAAAAAA\n" + userService.getUserByLP(loginPasswordRequest));
        //UserDetails userDetails = userService.loadUserByUsername(request.getLogin());
        UserWithPostsDTO dto = userService.loadUserByUsername(request.getLogin());


        if (!Objects.equals(request.getPassword(), dto.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = jwtTokenUtils.generateToken(dto);


        return ResponseEntity.ok(Map.of("token", token,
                "user", dto));
        //return new ResponseEntity<>(userService.getUserByLP(loginPasswordRequest), HttpStatus.OK);
    }

    @GetMapping("{userId}/getPosts")
    public ResponseEntity<?> getPosts(@PathVariable("userId") long id){
       // System.out.println("I RETURN THAT POSTS\n" + userService.getPosts(id));
        System.out.println("Запрос постов для пользователя: " + id);
        return new ResponseEntity<>(userService.getPosts(id), HttpStatus.OK);
    }
}

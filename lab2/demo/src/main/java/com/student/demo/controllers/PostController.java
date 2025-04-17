package com.student.demo.controllers;

import com.student.demo.requests.post.AddPostRequest;
import com.student.demo.requests.post.DeletePostRequest;
import com.student.demo.services.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/post")
public class PostController {
    @Autowired
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping("/addPost")
    public ResponseEntity<?> addPost(@Valid @RequestBody AddPostRequest addPostRequest) throws IOException {
        return new ResponseEntity<>(postService.addPost(addPostRequest), HttpStatus.OK);
    }

    @DeleteMapping("/deletePost")
    public ResponseEntity<?> deletePost(@Valid @RequestBody DeletePostRequest deletePostRequest){
        postService.deletePost(deletePostRequest);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}

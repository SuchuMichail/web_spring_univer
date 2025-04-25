package com.student.demo.controllers;

import com.student.demo.entities.PostFile;
import com.student.demo.entities.SubjectData;
import com.student.demo.entities.UserData;
import com.student.demo.repositories.ISubjectRepository;
import com.student.demo.repositories.IUserRepository;
import com.student.demo.requests.post.AddPostRequest;
import com.student.demo.requests.post.DeletePostRequest;
import com.student.demo.services.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping(value = "/api/post")
public class PostController {
    @Autowired
    private final PostService postService;
    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private ISubjectRepository subjectRepository;



    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping(value = "/addPost", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addPost(@RequestParam String title,
                                     @RequestParam String text,
                                     @RequestParam Long subjectId,
                                     @RequestParam Long authorId,
                                     @RequestParam(required = false) List<MultipartFile> files) throws IOException {
        //System.out.println("TRY ADDPOST");
        // Получаем полные объекты из ID
        SubjectData subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        UserData author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AddPostRequest request = new AddPostRequest(title, text, subject, author, files);
        return new ResponseEntity<>(postService.addPost(request), HttpStatus.OK);
    }

    @DeleteMapping("/deletePost")
    public ResponseEntity<?> deletePost(@Valid @RequestBody DeletePostRequest deletePostRequest){
        postService.deletePost(deletePostRequest);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> fetchPostById(@PathVariable("id") long id){
       // System.out.println("RESULT FIND POST = \n" + postService.fetchPostById(id));
        return new ResponseEntity<>(postService.fetchPostById(id), HttpStatus.OK);
    }

    @GetMapping("/fetchPostsBySubjectId/{id}")
    public ResponseEntity<?> fetchPostsBySubjectId(@PathVariable("id") long id){
        System.out.println("III FIND POSTsss = \n" + postService.fetchPostsBySubjectId(id));
        return new ResponseEntity<>(postService.fetchPostsBySubjectId(id), HttpStatus.OK);
    }

    @GetMapping("/files/{fileId}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long fileId) {
        PostFile file = postService.findPostFileByFileId(fileId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .body(file.getData());
    }
}

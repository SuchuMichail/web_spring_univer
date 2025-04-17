package com.student.demo.services;

import com.student.demo.entities.PostData;
import com.student.demo.repositories.IPostRepository;
import com.student.demo.requests.post.AddPostRequest;
import com.student.demo.requests.post.DeletePostRequest;
import com.student.demo.responses.AddPostResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class PostService {
    @Autowired
    private IPostRepository postRepository;

    public AddPostResponse addPost(AddPostRequest addPostRequest) throws IOException {
        byte[] imageBuffer = Files.readAllBytes(Paths.get(addPostRequest.getPathToDocument()));

        PostData postData = new PostData(null, imageBuffer, addPostRequest.getSubject(), addPostRequest.getUserData());

        PostData saved = postRepository.save(postData);

        System.out.println("ID = " + saved.getId());

        return new AddPostResponse(saved);
    }

    public void deletePost(DeletePostRequest deletePostRequest){
        postRepository.deleteById(deletePostRequest.getId());
    }
}

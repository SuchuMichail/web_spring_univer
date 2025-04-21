package com.student.demo.services;

import com.student.demo.entities.PostData;
import com.student.demo.entities.PostFile;
import com.student.demo.repositories.IPostFileRepository;
import com.student.demo.repositories.IPostRepository;
import com.student.demo.requests.post.AddPostRequest;
import com.student.demo.requests.post.DeletePostRequest;
import com.student.demo.responses.post.FullPostDTO;
import com.student.demo.responses.post.PostWithFilesAndLikedByDTO;
import com.student.demo.responses.post.PostWithFilesDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PostService {
    @Autowired
    private IPostRepository postRepository;
    @Autowired
    private IPostFileRepository postFileRepository;

    public FullPostDTO addPost(AddPostRequest addPostRequest) throws IOException {
        PostData post = new PostData();
        post.setTitle(addPostRequest.getTitle());
        post.setText(addPostRequest.getText());
        post.setSubject(addPostRequest.getSubject());
        post.setAuthor(addPostRequest.getAuthor());

        PostData savedPost = postRepository.save(post);

        if (addPostRequest.getFiles() != null && !addPostRequest.getFiles().isEmpty()) {
            // Сохранение файлов
            for (MultipartFile file : addPostRequest.getFiles()) {
                PostFile postFile = new PostFile();
                postFile.setName(file.getOriginalFilename());
                postFile.setType(file.getContentType());
                postFile.setSize(file.getSize());
                postFile.setData(file.getBytes());
                postFile.setPost(savedPost);
                postFileRepository.save(postFile);
            }
        }

        return new FullPostDTO(savedPost);
    }

    public FullPostDTO fetchPostById(long id){
        return new FullPostDTO(postRepository.findById(id).orElseThrow(IllegalArgumentException::new));
    }

    public void deletePost(DeletePostRequest deletePostRequest){
        postRepository.deleteById(deletePostRequest.getId());
    }
}

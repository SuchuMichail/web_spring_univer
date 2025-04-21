package com.student.demo.responses.post;

import com.student.demo.entities.PostData;
import com.student.demo.entities.PostFile;
import com.student.demo.entities.UserData;
import com.student.demo.responses.user.UserDTO;
import lombok.Data;

import java.beans.ConstructorProperties;
import java.util.ArrayList;
import java.util.List;

@Data
public class PostWithFilesAndLikedByDTO {
    private PostDTO post;
    private List<PostFileDTO> files = new ArrayList<>();
    private List<UserDTO> likedBy = new ArrayList<>();

    @ConstructorProperties({"post", "files", "likedBy"})
    public PostWithFilesAndLikedByDTO(PostDTO post, List<PostFileDTO> files, List<UserDTO> likedBy) {
        this.post = post;
        this.files = files;
        this.likedBy = likedBy;
    }

    public PostWithFilesAndLikedByDTO(PostData post){
        if(post != null) {
            this.post = new PostDTO(post);
            for (PostFile file : post.getPostFiles()) {
                this.files.add(new PostFileDTO(file));
            }
            for(UserData userData : post.getLikedBy()){
                this.likedBy.add(new UserDTO(userData));
            }
        }
    }
}

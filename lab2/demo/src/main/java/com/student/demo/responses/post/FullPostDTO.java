package com.student.demo.responses.post;

import com.student.demo.entities.PostData;
import com.student.demo.entities.PostFile;
import com.student.demo.entities.UserData;
import com.student.demo.responses.subject.SubjectDTO;
import com.student.demo.responses.user.UserDTO;
import lombok.Data;

import java.beans.ConstructorProperties;
import java.util.ArrayList;
import java.util.List;

@Data
public class FullPostDTO {
    private PostDTO post;
    private SubjectDTO subject;
    private UserDTO author;
    private List<PostFileDTO> files = new ArrayList<>();
    private List<UserDTO> likedBy = new ArrayList<>();

    @ConstructorProperties({"post", "subject", "author", "files", "likedBy"})
    public FullPostDTO(PostDTO post, SubjectDTO subject, UserDTO author, List<PostFileDTO> files, List<UserDTO> likedBy) {
        this.post = post;
        this.subject = subject;
        this.author = author;
        this.files = files;
        this.likedBy = likedBy;
    }

    public FullPostDTO(PostData post){
        if(post != null) {
            this.post = new PostDTO(post);
            this.subject = new SubjectDTO(post.getSubject());
            this.author = new UserDTO(post.getAuthor());

            for (PostFile file : post.getPostFiles()) {
                this.files.add(new PostFileDTO(file));
            }
            for(UserData userData : post.getLikedBy()){
                this.likedBy.add(new UserDTO(userData));
            }
        }
    }
}

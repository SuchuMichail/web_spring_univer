package com.student.demo.responses.post;

import com.student.demo.entities.PostData;
import com.student.demo.entities.PostFile;
import com.student.demo.entities.SubjectData;
import com.student.demo.responses.subject.SubjectDTO;
import lombok.Data;

import java.beans.ConstructorProperties;
import java.util.ArrayList;
import java.util.List;

@Data
public class PostWithFilesDTO {
    private PostDTO post;
    private List<PostFileDTO> files = new ArrayList<>();

    @ConstructorProperties({"post", "files"})
    public PostWithFilesDTO(PostDTO post, List<PostFileDTO> files) {
        this.post = post;
        this.files = files;
    }

    public PostWithFilesDTO(PostData post){
        if(post != null) {
            this.post = new PostDTO(post);
            for (PostFile file : post.getPostFiles()) {
                this.files.add(new PostFileDTO(file));
            }
        }
    }
}

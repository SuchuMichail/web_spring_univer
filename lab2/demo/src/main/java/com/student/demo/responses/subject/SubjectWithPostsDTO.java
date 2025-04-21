package com.student.demo.responses.subject;

import com.student.demo.entities.PostData;
import com.student.demo.entities.SubjectData;
import com.student.demo.entities.UserData;
import com.student.demo.responses.post.PostDTO;
import com.student.demo.responses.user.UserDTO;
import lombok.Data;

import java.beans.ConstructorProperties;
import java.util.ArrayList;
import java.util.List;

@Data
public class SubjectWithPostsDTO {
    private SubjectDTO subject;
    private List<PostDTO> posts = new ArrayList<>();

    @ConstructorProperties({"subject", "posts"})
    public SubjectWithPostsDTO(SubjectDTO subject, List<PostDTO> posts) {
        this.subject = subject;
        this.posts = posts;
    }

    public SubjectWithPostsDTO(SubjectData subjectData){
        if(subjectData != null) {
            this.subject = new SubjectDTO(subjectData);
            for (PostData postData : subjectData.getPosts()) {
                this.posts.add(new PostDTO(postData));
            }
        }
    }
}

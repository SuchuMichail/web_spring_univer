package com.student.demo.responses.post;

import com.student.demo.entities.PostData;
import com.student.demo.entities.UserData;
import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class AddPostResponse {
    private PostData postData;

    @ConstructorProperties({"postData"})
    public AddPostResponse(PostData postData) {
        this.postData = postData;
    }

   /* public AddPostResponse(PostData post) {
        this(post.getId());
    }*/
}

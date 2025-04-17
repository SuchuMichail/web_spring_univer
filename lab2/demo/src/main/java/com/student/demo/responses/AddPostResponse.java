package com.student.demo.responses;

import com.student.demo.entities.PostData;
import com.student.demo.entities.UserData;
import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class AddPostResponse {
    private long id;

    @ConstructorProperties({"id"})
    public AddPostResponse(long id) {
        this.id = id;
    }

    public AddPostResponse(PostData post) {
        this(post.getId());
    }
}

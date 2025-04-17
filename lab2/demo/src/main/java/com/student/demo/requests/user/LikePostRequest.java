package com.student.demo.requests.user;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class LikePostRequest {
    private long idUser;
    private long idPost;

    @ConstructorProperties({"idUser", "idPost"})
    public LikePostRequest(long idUser, long idPost) {
        this.idUser = idUser;
        this.idPost = idPost;
    }
}

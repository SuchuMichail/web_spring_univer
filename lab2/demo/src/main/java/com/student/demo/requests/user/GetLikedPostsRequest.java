package com.student.demo.requests.user;

import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class GetLikedPostsRequest {
    private long idUser;

    @ConstructorProperties({"idUser"})
    public GetLikedPostsRequest(long idUser) {
        this.idUser = idUser;
    }
}

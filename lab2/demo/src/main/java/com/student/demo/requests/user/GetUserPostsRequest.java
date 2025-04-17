package com.student.demo.requests.user;

import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class GetUserPostsRequest {
    private long idUser;

    @ConstructorProperties({"idUser"})
    public GetUserPostsRequest(long idUser) {
        this.idUser = idUser;
    }
}

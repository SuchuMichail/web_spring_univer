package com.student.demo.requests.user;

import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class DeleteUserRequest {
    private long id;

    @ConstructorProperties({"id"})
    public DeleteUserRequest(long id) {
        this.id = id;
    }
}

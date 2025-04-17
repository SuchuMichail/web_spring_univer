package com.student.demo.requests.post;

import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class DeletePostRequest {
    private long id;

    @ConstructorProperties({"id"})
    public DeletePostRequest(long id) {
        this.id = id;
    }
}

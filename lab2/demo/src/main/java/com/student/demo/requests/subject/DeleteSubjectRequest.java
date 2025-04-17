package com.student.demo.requests.subject;

import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class DeleteSubjectRequest {
    private long id;

    @ConstructorProperties({"id"})
    public DeleteSubjectRequest(long id) {
        this.id = id;
    }
}

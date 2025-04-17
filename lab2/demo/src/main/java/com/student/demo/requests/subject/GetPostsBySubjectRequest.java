package com.student.demo.requests.subject;

import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class GetPostsBySubjectRequest {
    private long subjectId;

    @ConstructorProperties({"subjectId"})
    public GetPostsBySubjectRequest(long subjectId) {
        this.subjectId = subjectId;
    }
}

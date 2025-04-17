package com.student.demo.responses;

import com.student.demo.entities.SubjectData;
import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class GetSubjectResponse {
    private SubjectData subject;

    @ConstructorProperties({"subject"})
    public GetSubjectResponse(SubjectData subject) {
        this.subject = subject;
    }
}

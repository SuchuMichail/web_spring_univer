package com.student.demo.responses;

import com.student.demo.entities.SubjectData;
import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class AddSubjectResponse {
    private long id;

    @ConstructorProperties({"id"})
    public AddSubjectResponse(long id) {
        this.id = id;
    }

    public AddSubjectResponse(SubjectData subject) {
        this(subject.getId());
    }
}

package com.student.demo.responses.subject;

import com.student.demo.entities.SubjectData;
import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class SubjectDTO {
    private Long id;
    private String subjectName;

    @ConstructorProperties({"id", "subjectName"})
    public SubjectDTO(Long id, String subjectName) {
        this.id = id;
        this.subjectName = subjectName;
    }

    public SubjectDTO(SubjectData subjectData){
        this.id = subjectData.getId();
        this.subjectName = subjectData.getSubjectName();
    }
}

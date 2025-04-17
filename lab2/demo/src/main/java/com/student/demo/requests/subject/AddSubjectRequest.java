package com.student.demo.requests.subject;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class AddSubjectRequest {
    @NotNull
    @NotBlank
    private String subjectName;

    @ConstructorProperties({"subjectName"})
    public AddSubjectRequest(@NotNull String subjectName) {
        this.subjectName = subjectName;
    }
}

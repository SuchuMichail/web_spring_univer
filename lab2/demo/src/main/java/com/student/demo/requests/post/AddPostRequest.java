package com.student.demo.requests.post;

import com.student.demo.entities.SubjectData;
import com.student.demo.entities.UserData;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class AddPostRequest {
    @NotNull
    private SubjectData subject;
    @NotNull
    @NotBlank
    private String pathToDocument;
    @NotNull
    private UserData userData;

    @ConstructorProperties({"pathToDocument", "subject", "userData"})
    public AddPostRequest(@NotNull String pathToDocument, @NotNull SubjectData subject, @NotNull UserData userData) {
        this.subject = subject;
        this.pathToDocument = pathToDocument;
        this.userData = userData;
    }
}

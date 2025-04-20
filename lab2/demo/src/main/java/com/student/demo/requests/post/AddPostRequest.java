package com.student.demo.requests.post;

import com.student.demo.entities.SubjectData;
import com.student.demo.entities.UserData;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.beans.ConstructorProperties;
import java.util.ArrayList;
import java.util.List;

@Data
public class AddPostRequest {
    @NotNull
    @NotBlank
    private String title;
    @NotNull
    @NotBlank
    private String text;
    @NotNull
    private SubjectData subject;
    @NotNull
    private UserData author;
    @NotNull
    private List<MultipartFile> files;

    @ConstructorProperties({"title","text", "subject", "author", "files"})
    public AddPostRequest(@NotNull String title, @NotNull String text,
                          @NotNull SubjectData subject, @NotNull UserData author,
                          @NotNull List<MultipartFile> files) {
        this.title = title;
        this.text = text;
        this.subject = subject;
        this.author = author;
        this.files = files != null ? files : new ArrayList<>();
    }
}

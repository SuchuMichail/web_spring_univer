package com.student.demo.requests.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import java.beans.ConstructorProperties;

@Data
public class AddUserRequest {
    @NotNull
    @NotBlank
    @Length(min = 1, max = 100)
    private String login;
    @NotNull
    @NotBlank
    @Length(min = 1, max = 100)
    private String password;
    @NotNull
    @NotBlank
    @Length(min = 1, max = 100)
    private String university;
    private String group;

    @ConstructorProperties({"login", "password", "university", "group"})
    public AddUserRequest(@NotNull String login, @NotNull String password, @NotNull String university, String group) {
        this.login = login;
        this.password = password;
        this.university = university;
        this.group = group;
    }
}

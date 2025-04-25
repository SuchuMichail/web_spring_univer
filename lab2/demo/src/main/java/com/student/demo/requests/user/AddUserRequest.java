package com.student.demo.requests.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
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
    private String username;
    @NotNull
    @NotBlank
    @Length(min = 1, max = 100)
    private String university;
    @NotNull
    private String userGroup;

    /*@Getter(AccessLevel.NONE)
    private boolean isAdmin;*/

    @ConstructorProperties({"login", "password", "username", "university", "userGroup"})
    public AddUserRequest(@NotNull String login, @NotNull String password, @NotNull String username, @NotNull String university, String userGroup) {
        this.login = login;
        this.password = password;
        this.username = username;
        this.university = university;
        this.userGroup = userGroup;
    }
}

package org.example.requests;

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
    private String name;
    @NotNull
    @NotBlank
    @Length(min = 1, max = 100)
    private String surname;
    @NotNull
    private int score;

    @ConstructorProperties({"login", "password", "name", "surname", "score"})
    public AddUserRequest(String login, String password, String name, String surname, int score) {
        this.login = login;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.score = score;
    }
}

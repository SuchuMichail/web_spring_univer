package org.example.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import java.beans.ConstructorProperties;

@Data
public class EditUserRequest {
    @NotNull
    private long id;
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
    @Length(min = 1, max = 100)
    private String surname;
    @NotNull
    private int score;

    @ConstructorProperties({"id", "login", "password", "name", "surname", "score"})
    public EditUserRequest(long id, String login, String password, String name, String surname, int score) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.score = score;
    }
}

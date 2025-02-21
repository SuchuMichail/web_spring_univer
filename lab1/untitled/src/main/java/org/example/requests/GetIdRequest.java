package org.example.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import java.beans.ConstructorProperties;

@Data
public class GetIdRequest {
    @NotNull
    @NotBlank
    @Length(min = 1, max = 100)
    private String login;
    @NotNull
    @NotBlank
    @Length(min = 1, max = 100)
    private String password;

    @ConstructorProperties({"login", "password"})
    public GetIdRequest(String login, String password) {
        this.login = login;
        this.password = password;
    }
}

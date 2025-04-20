package com.student.demo.requests.user;

import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class LoginPasswordRequest {
    private String login;
    private String password;

    @ConstructorProperties({"login", "password"})
    public LoginPasswordRequest(String login, String password) {
        this.login = login;
        this.password = password;
    }
}

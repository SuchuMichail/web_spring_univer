package org.example.responses;

import lombok.Data;
import org.example.entities.UserData;

import java.beans.ConstructorProperties;

@Data
public class GetUserLoginResponse {
    private String login;

    @ConstructorProperties({"login"})
    public GetUserLoginResponse(String login) {
        this.login = login;
    }

    public GetUserLoginResponse(UserData user) {
        this(user.getLogin());
    }
}

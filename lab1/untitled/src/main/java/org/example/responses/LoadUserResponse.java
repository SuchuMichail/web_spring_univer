package org.example.responses;

import lombok.Data;
import org.example.entities.UserData;

import java.beans.ConstructorProperties;

@Data
public class LoadUserResponse {
    private String name;
    private String surname;
    private int score;

    @ConstructorProperties({"name", "surname", "score"})
    public LoadUserResponse(String name, String surname, int score) {
        this.name = name;
        this.surname = surname;
        this.score = score;
    }

    public LoadUserResponse(UserData user) {
        this(user.getName(), user.getSurname(), user.getScore());
    }
}

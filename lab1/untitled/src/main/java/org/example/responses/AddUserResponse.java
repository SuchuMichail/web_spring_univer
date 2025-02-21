package org.example.responses;

import lombok.Data;
import org.example.entities.UserData;

import java.beans.ConstructorProperties;

@Data
public class AddUserResponse {
    private long id;

    @ConstructorProperties({"id"})
    public AddUserResponse(long id) {
        this.id = id;
    }

    public AddUserResponse(UserData user) {
        this(user.getId());
    }
}

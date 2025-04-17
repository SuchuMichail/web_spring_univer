package com.student.demo.responses;

import com.student.demo.entities.UserData;
import lombok.Data;

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

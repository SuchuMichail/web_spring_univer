package org.example.responses;

import lombok.Data;
import org.example.entities.UserData;

import java.beans.ConstructorProperties;

@Data
public class GetIdResponse {
    private long id;

    @ConstructorProperties({"id"})
    public GetIdResponse(long id) {
        this.id = id;
    }

    public GetIdResponse(UserData user) {
        this(user.getId());
    }
}

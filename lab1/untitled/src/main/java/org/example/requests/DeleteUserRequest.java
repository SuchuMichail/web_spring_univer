package org.example.requests;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class DeleteUserRequest {
    @NotNull
    private long id;

    @ConstructorProperties({"id"})
    public DeleteUserRequest(long id) {
        this.id = id;
    }
}

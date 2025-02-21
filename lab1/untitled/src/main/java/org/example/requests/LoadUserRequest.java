package org.example.requests;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class LoadUserRequest {
    @NotNull
    private long id;

    @ConstructorProperties({"id"})
    public LoadUserRequest(long id) {
        this.id = id;
    }
}

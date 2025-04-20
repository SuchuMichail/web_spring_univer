package com.student.demo.responses.user;

import com.student.demo.entities.UserData;
import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class GetUserByLPResponse {
    private UserData userData;

    @ConstructorProperties({"userData"})

    public GetUserByLPResponse(UserData userData) {
        this.userData = userData;
    }
}

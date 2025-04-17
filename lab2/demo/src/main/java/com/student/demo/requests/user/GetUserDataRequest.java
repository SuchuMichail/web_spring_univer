package com.student.demo.requests.user;

import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class GetUserDataRequest {
    private long idUser;

    @ConstructorProperties({"idUser"})
    public GetUserDataRequest(long idUser) {
        this.idUser = idUser;
    }
}

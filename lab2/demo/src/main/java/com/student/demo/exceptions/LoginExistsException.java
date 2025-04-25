package com.student.demo.exceptions;

public class LoginExistsException extends Exception{
    public LoginExistsException(){
        super();
    }
    public LoginExistsException(String message){
        super(message);
    }

}

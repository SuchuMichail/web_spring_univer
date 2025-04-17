package com.student.demo.services;

import com.student.demo.entities.UserData;
import com.student.demo.repositories.IUserRepository;
import com.student.demo.requests.user.AddUserRequest;
import com.student.demo.requests.user.DeleteUserRequest;
import com.student.demo.responses.AddUserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private IUserRepository userRepository;

    public AddUserResponse addUser(AddUserRequest addUserRequest){
        UserData userData = new UserData(
                null,
                addUserRequest.getLogin(),
                addUserRequest.getPassword(),
                addUserRequest.getUniversity(),
                addUserRequest.getGroup());

        UserData saved = userRepository.save(userData);

        System.out.println("ID = " + saved.getId());

        return new AddUserResponse(saved);
    }

    public void deleteUser(DeleteUserRequest deleteUserRequest){
        userRepository.deleteById(deleteUserRequest.getId());
    }
}

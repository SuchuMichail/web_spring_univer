package org.example.services;

import org.example.entities.UserData;
import org.example.repositories.IUserRepository;
import org.example.requests.*;
import org.example.responses.AddUserResponse;
import org.example.responses.GetIdResponse;
import org.example.responses.GetUserLoginResponse;
import org.example.responses.LoadUserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.ExpressionException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private IUserRepository userRepository;

    public List<GetUserLoginResponse> getAllUsers(){
        List<UserData> userList = userRepository.getAllUsers();

        List<GetUserLoginResponse> result = new ArrayList<>(userList.size());
        for(UserData user : userList){
            result.add(new GetUserLoginResponse(user));
        }

        return result;
    }

    public GetIdResponse getIdByLoginPassword(GetIdRequest request){
        List<Long> listId = userRepository.getUserId(request.getLogin(), request.getPassword());
        if(listId.size() > 0) {
            return new GetIdResponse(listId.get(0));
        }
        return new GetIdResponse(-100);
    }

    public AddUserResponse addUser(AddUserRequest addUserRequest){
        UserData userData = new UserData(null,
                addUserRequest.getLogin(),
                addUserRequest.getPassword(),
                addUserRequest.getName(),
                addUserRequest.getSurname(),
                addUserRequest.getScore());

        UserData saved = userRepository.save(userData);

        System.out.println("ID = " + saved.getId());

        return new AddUserResponse(saved);
    }

    public void editUser(EditUserRequest editUserRequest){
        userRepository.editUser(
                editUserRequest.getId(),
                editUserRequest.getLogin(),
                editUserRequest.getPassword(),
                editUserRequest.getName(),
                editUserRequest.getSurname(),
                editUserRequest.getScore()
        );
    }

    public void deleteUser(DeleteUserRequest deleteUserRequest){
        userRepository.deleteById(deleteUserRequest.getId());
    }

    public LoadUserResponse loadUser(LoadUserRequest loadUserRequest){
        Optional<UserData> userData = userRepository.findById(loadUserRequest.getId());
        return new LoadUserResponse(userData.orElseThrow(()->new ExpressionException("invalid student id")));
    }
}

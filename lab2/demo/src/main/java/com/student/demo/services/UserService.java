package com.student.demo.services;

import com.student.demo.entities.PostData;
import com.student.demo.entities.UserData;
import com.student.demo.repositories.IUserRepository;
import com.student.demo.requests.user.AddUserRequest;
import com.student.demo.requests.user.DeleteUserRequest;
import com.student.demo.requests.user.LoginPasswordRequest;
import com.student.demo.responses.user.AddUserResponse;
import com.student.demo.responses.user.GetUserByLPResponse;
import com.student.demo.responses.user.UserDTO;
import com.student.demo.responses.user.UserWithPostsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private IUserRepository userRepository;

    public AddUserResponse addUser(AddUserRequest addUserRequest){
        UserData userData = new UserData(
                null,
                addUserRequest.getLogin(),
                addUserRequest.getPassword(),
                addUserRequest.getUsername(),
                addUserRequest.getUniversity(),
                addUserRequest.getGroup()
        );

        UserData saved = userRepository.save(userData);

        return new AddUserResponse(saved);
    }

    public void deleteUser(DeleteUserRequest deleteUserRequest){
        userRepository.deleteById(deleteUserRequest.getId());
    }

    public UserWithPostsDTO getUserByLP(LoginPasswordRequest loginPasswordRequest){
        List<UserData> users = userRepository.getUsersWithLP(loginPasswordRequest.getLogin(),loginPasswordRequest.getPassword());

        if(users.size() > 0){
            return new UserWithPostsDTO(users.get(0));
        }
        return new UserWithPostsDTO(null);
    }

    public UserDTO getUserData(Long userId) {
        UserData user = userRepository.findById(userId).orElseThrow();
        return new UserDTO(user);
    }

    public List<PostData> getPosts(long id){
        List<UserData> users = userRepository.getUserById(id);
        if(users.size() > 0) {
            return users.get(0).getUserPosts();
        }
        return null;
    }
}

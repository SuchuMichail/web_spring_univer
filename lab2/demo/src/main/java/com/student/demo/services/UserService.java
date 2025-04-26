package com.student.demo.services;

import com.student.demo.entities.PostData;
import com.student.demo.entities.UserData;
import com.student.demo.exceptions.LoginExistsException;
import com.student.demo.repositories.IUserRepository;
import com.student.demo.requests.user.AddUserRequest;
import com.student.demo.requests.user.DeleteUserRequest;
import com.student.demo.requests.user.LoginPasswordRequest;
import com.student.demo.responses.post.FullPostDTO;
import com.student.demo.responses.user.AddUserResponse;
import com.student.demo.responses.user.UserDTO;
import com.student.demo.responses.user.UserWithPostsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private IUserRepository userRepository;

    public UserDTO addUser(AddUserRequest addUserRequest) throws LoginExistsException {
        if (!userRepository.existsByLogin(addUserRequest.getLogin()).isEmpty()) {
            throw new LoginExistsException("Пользователь с таким логином уже существует");
        }

        UserData userData = new UserData(
                null,
                addUserRequest.getLogin(),
                addUserRequest.getPassword(),
                addUserRequest.getUsername(),
                addUserRequest.getUniversity(),
                addUserRequest.getUserGroup()
        );

        UserData saved = userRepository.save(userData);

        return new UserDTO(saved);
    }

    public void deleteUser(DeleteUserRequest deleteUserRequest){
        userRepository.deleteById(deleteUserRequest.getId());
    }

    public UserWithPostsDTO getUserByLP(LoginPasswordRequest loginPasswordRequest){
        List<UserData> users = userRepository.getUsersWithLP(loginPasswordRequest.getLogin(),loginPasswordRequest.getPassword());

        if(users.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        return new UserWithPostsDTO(users.get(0));
    }

    public UserDTO getUserData(Long userId) {
        UserData user = userRepository.findById(userId).orElseThrow();
        return new UserDTO(user);
    }

    public List<FullPostDTO> getPosts(long id){
        //System.out.println("User ID = " + id);
        List<UserData> users = userRepository.getUserById(id);
        if(users.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        List<FullPostDTO> result = new ArrayList<>(users.size());
        for(PostData postData : users.get(0).getUserPosts()){
            result.add(new FullPostDTO(postData));
        }
        return result;

    }
}

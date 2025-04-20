package com.student.demo.responses.user;

import com.student.demo.entities.PostData;
import com.student.demo.entities.UserData;
import com.student.demo.responses.post.PostDTO;
import lombok.Data;

import java.beans.ConstructorProperties;
import java.util.List;

@Data
public class UserWithPostsDTO {
    private UserDTO user;
    private List<PostDTO> userPosts;
    private List<PostDTO> likedByPosts;

    @ConstructorProperties({"user", "userPosts", "likedByPosts"})
    public UserWithPostsDTO(UserDTO user, List<PostDTO> userPosts, List<PostDTO> likedByPosts) {
        this.user = user;
        this.userPosts = userPosts;
        this.likedByPosts = likedByPosts;
    }

    public UserWithPostsDTO(UserData userData){
        if(userData != null) {
            this.user = new UserDTO(userData);
            for (PostData postData : userData.getUserPosts()) {
                this.userPosts.add(new PostDTO(postData));
            }
            for (PostData postData : userData.getLikedPosts()) {
                this.likedByPosts.add(new PostDTO(postData));
            }
        }
    }
}

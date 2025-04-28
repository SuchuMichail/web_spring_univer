package com.student.demo.responses.user;

import com.student.demo.entities.PostData;
import com.student.demo.entities.UserData;
import com.student.demo.responses.post.PostDTO;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.beans.ConstructorProperties;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Data
public class UserWithPostsDTO implements UserDetails  {
    private UserDTO user;
    private List<PostDTO> userPosts = new ArrayList<>();
    private List<PostDTO> likedPosts = new ArrayList<>();

    @ConstructorProperties({"user", "userPosts", "likedPosts"})
    public UserWithPostsDTO(UserDTO user, List<PostDTO> userPosts, List<PostDTO> likedByPosts) {
        this.user = user;
        this.userPosts = userPosts;
        this.likedPosts = likedByPosts;
    }

    public UserWithPostsDTO(UserData userData){
        if(userData != null) {
            this.user = new UserDTO(userData);
            for (PostData postData : userData.getUserPosts()) {
                this.userPosts.add(new PostDTO(postData));
            }
            for (PostData postData : userData.getLikedPosts()) {
                this.likedPosts.add(new PostDTO(postData));
            }
        }
    }

    public UserWithPostsDTO(UserDTO userDTO){
        this.user = userDTO;
    }

    public boolean isAdmin(){
        return this.user.isAdmin();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.user.isAdmin() ?
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN")) :
                Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getLogin();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

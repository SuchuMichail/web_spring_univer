package com.student.demo.responses.user;

import com.student.demo.entities.UserData;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.beans.ConstructorProperties;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Data
public class UserDTO implements UserDetails {
    private Long id;
    private String login;
    private String password;
    private String username;
    private String university;
    private String userGroup;
    private boolean isAdmin;

    @ConstructorProperties({"id", "login", "password", "username", "university", "userGroup", "isAdmin"})
    public UserDTO(Long id, String login, String password, String username, String university, String userGroup, boolean isAdmin) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.username = username;
        this.university = university;
        this.userGroup = userGroup;
        this.isAdmin = isAdmin;
    }

    public UserDTO(UserData userData){
        this.id = userData.getId();
        this.login = userData.getLogin();
        this.password = userData.getPassword();
        this.username = userData.getUsername();
        this.university = userData.getUniversity();
        this.userGroup = userData.getUserGroup();
        this.isAdmin = userData.isAdmin();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return isAdmin ?
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN")) :
                Collections.emptyList();
    }
}

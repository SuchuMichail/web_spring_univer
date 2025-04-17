package com.student.demo.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "UserData")
@NoArgsConstructor
public class UserData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(name = "login")
    private String login;
    @Column(name = "password")
    private String password;
    @Column(name = "university")
    private String university;
    @Column(name = "userGroup")
    private String userGroup;

    @OneToMany
    @JoinColumn(name = "user_id")
    private List<PostData> userPosts = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "student_likedpost",
                joinColumns = @JoinColumn(name = "userData_id"),
                inverseJoinColumns = @JoinColumn(name = "postData_id"))
    private List<PostData> likedPosts = new ArrayList<>();

    public UserData(Long id, String login, String password, String university, String userGroup) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.university = university;
        this.userGroup = userGroup;
    }

    public UserData(Long id, String login, String password, String university, String userGroup, List<PostData> userPosts, List<PostData> likedPosts) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.university = university;
        this.userGroup = userGroup;
        this.userPosts = userPosts;
        this.likedPosts = likedPosts;
    }
}

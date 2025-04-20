package com.student.demo.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "PostData")
@NoArgsConstructor
public class PostData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name="text")
    private String text;

    @OneToMany
    @JoinColumn(name = "post_id")
    private List<PostFile> postFiles = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "subject_id", referencedColumnName = "id")
    private SubjectData subject;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserData author;

    @ManyToMany
    @JoinTable(name = "student_likedpost",
            joinColumns = @JoinColumn(name = "postData_id"),
            inverseJoinColumns = @JoinColumn(name = "userData_id"))
    private List<UserData> likedBy = new ArrayList<>();


    public PostData(Long id, String title, String text, List<PostFile> postFiles, SubjectData subject, UserData author, List<UserData> likedBy) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.postFiles = postFiles;
        this.subject = subject;
        this.author = author;
        this.likedBy = likedBy;
    }
}

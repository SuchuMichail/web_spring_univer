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

    @Lob
    @Column(name = "document", columnDefinition = "BLOB")
    private byte[] document;

    @ManyToOne
    @JoinColumn(name = "subject_id", referencedColumnName = "id")
    private SubjectData subject;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserData userData;

    @ManyToMany
    @JoinTable(name = "student_likedpost",
            joinColumns = @JoinColumn(name = "postData_id"),
            inverseJoinColumns = @JoinColumn(name = "userData_id"))
    private List<UserData> likedUsers = new ArrayList<>();

    public PostData(Long id, byte[] document, SubjectData subject, UserData userData) {
        this.id = id;
        this.document = document;
        this.subject = subject;
        this.userData = userData;
    }

    public PostData(Long id, byte[] document, SubjectData subject, UserData userData, List<UserData> likedUsers) {
        this.id = id;
        this.document = document;
        this.subject = subject;
        this.userData = userData;
        this.likedUsers = likedUsers;
    }
}

package com.student.demo.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "SubjectData")
@NoArgsConstructor
public class SubjectData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "subjectName")
    private String subjectName;

    @OneToMany
    @JoinColumn(name = "subject_id")
    private List<PostData> posts = new ArrayList<>();

    public SubjectData(Long id, String subjectName) {
        this.id = id;
        this.subjectName = subjectName;
    }

    public SubjectData(Long id, String subjectName, List<PostData> posts) {
        this.id = id;
        this.subjectName = subjectName;
        this.posts = posts;
    }
}

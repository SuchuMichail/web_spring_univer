package com.student.demo.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "PostFile")
@NoArgsConstructor
public class PostFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name")
    private String name;
    @Column(name = "type")
    private String type;
    @Column(name = "size")
    private Long size;

    @Lob
    @Column(name = "data", columnDefinition = "BLOB")
    private byte[] data;

    @ManyToOne
    @JoinColumn(name = "post_id", referencedColumnName = "id")
    private PostData post;

    public PostFile(Long id, String name, String type, Long size, byte[] data, PostData post) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.size = size;
        this.data = data;
        this.post = post;
    }
}

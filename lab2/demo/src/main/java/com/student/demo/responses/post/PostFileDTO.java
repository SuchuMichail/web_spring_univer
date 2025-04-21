package com.student.demo.responses.post;

import com.student.demo.entities.PostFile;
import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class PostFileDTO {
    private Long id;
    private String name;
    private String type;
    private Long size;
    private byte[] data;

    @ConstructorProperties({"id", "name", "type", "size", "data"})
    public PostFileDTO(Long id, String name, String type, Long size, byte[] data) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.size = size;
        this.data = data;
    }

    public PostFileDTO(PostFile postFile){
        this.id = postFile.getId();
        this.name = postFile.getName();
        this.type = postFile.getType();
        this.size = postFile.getSize();
        this.data = postFile.getData();
    }
}

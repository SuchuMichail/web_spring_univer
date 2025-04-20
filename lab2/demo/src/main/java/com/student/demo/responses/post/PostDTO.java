package com.student.demo.responses.post;

import com.student.demo.entities.PostData;
import lombok.Data;

import java.beans.ConstructorProperties;

@Data
public class PostDTO {
    private Long id;
    private String title;
    private String text;

    @ConstructorProperties({"id", "title", "text"})
    public PostDTO(Long id, String title, String text) {
        this.id = id;
        this.title = title;
        this.text = text;
    }

    public PostDTO(PostData postData){
        this.id = postData.getId();
        this.title = postData.getTitle();
        this.text = postData.getText();
    }
}

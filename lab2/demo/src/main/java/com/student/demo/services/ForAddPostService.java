package com.student.demo.services;

import com.student.demo.entities.SubjectData;
import com.student.demo.entities.UserData;
import com.student.demo.repositories.ISubjectRepository;
import com.student.demo.repositories.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ForAddPostService {
    @Autowired
    private ISubjectRepository subjectRepository;
    @Autowired
    private IUserRepository userRepository;

    public UserData getAuthor(long authorId){
        UserData author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return author;
    }

    public SubjectData getSubject(long subjectId) {
        SubjectData subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        return subject;
    }
}

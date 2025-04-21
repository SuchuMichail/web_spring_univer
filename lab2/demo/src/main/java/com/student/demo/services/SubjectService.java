package com.student.demo.services;

import com.student.demo.entities.SubjectData;
import com.student.demo.repositories.ISubjectRepository;
import com.student.demo.requests.subject.AddSubjectRequest;
import com.student.demo.responses.subject.SubjectWithPostsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class SubjectService {
    @Autowired
    private ISubjectRepository subjectRepository;

    public SubjectWithPostsDTO addSubject(AddSubjectRequest addSubjectRequest) throws IOException {
        SubjectData subject = new SubjectData(
                null,
                addSubjectRequest.getSubjectName());

        SubjectData saved = subjectRepository.save(subject);

        System.out.println("ID = " + saved.getId());

        return new SubjectWithPostsDTO(saved);
    }

    public void deleteSubject(/*DeleteSubjectRequest deleteSubjectRequest,*/ long id){
        subjectRepository.deleteById(id);
    }

    public List<SubjectWithPostsDTO> getSubjects(){
        List<SubjectData> subjectList = subjectRepository.getSubjects();

        List<SubjectWithPostsDTO> result = new ArrayList<>(subjectList.size());
        for(SubjectData subject : subjectList){
            result.add(new SubjectWithPostsDTO(subject));
        }

        return result;
    }
}

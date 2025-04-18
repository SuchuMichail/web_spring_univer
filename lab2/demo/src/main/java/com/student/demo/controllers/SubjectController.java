package com.student.demo.controllers;

import com.student.demo.requests.subject.AddSubjectRequest;
import com.student.demo.requests.subject.DeleteSubjectRequest;
import com.student.demo.services.SubjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/subject")
public class SubjectController {
    @Autowired
    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping("/addSubject")
    public ResponseEntity<?> addSubject(@Valid @RequestBody AddSubjectRequest addSubjectRequest/*,
                                        @RequestHeader(value = "Authorization", required = false) String authHeader*/) throws IOException {
        // Проверка авторизации и прав администратора
        /*if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }*/

        System.out.println("ARARA");
        return new ResponseEntity<>(subjectService.addSubject(addSubjectRequest), HttpStatus.OK);
    }

    @DeleteMapping("/deleteSubject/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable("id") long id/*,
                                           @Valid @RequestBody DeleteSubjectRequest deleteSubjectRequest*/){
        subjectService.deleteSubject(/*deleteSubjectRequest, */id);

        System.out.println("TRY TO DELETE " + id);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getSubjects")
    public ResponseEntity<?> getSubjects() {
        return new ResponseEntity<>(subjectService.getSubjects(), HttpStatus.OK);
    }
}

package com.student.demo.repositories;

import com.student.demo.entities.SubjectData;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ISubjectRepository extends JpaRepository<SubjectData,Long> {
    @Transactional
    @Modifying
    @Query("SELECT sub FROM SubjectData AS sub")
    List<SubjectData> getSubjects();
}

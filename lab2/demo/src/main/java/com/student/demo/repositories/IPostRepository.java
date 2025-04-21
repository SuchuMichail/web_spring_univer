package com.student.demo.repositories;

import com.student.demo.entities.PostData;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPostRepository extends JpaRepository<PostData,Long> {
    @Transactional
    @Modifying
    @Query("SELECT pd FROM PostData AS pd "+
            "WHERE pd.subject.id = :id")
    List<PostData> fetchPostsBySubjectId(@Param(value = "id") long id);
}

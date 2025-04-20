package com.student.demo.repositories;

import com.student.demo.entities.PostFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPostFileRepository extends JpaRepository<PostFile,Long> {
}

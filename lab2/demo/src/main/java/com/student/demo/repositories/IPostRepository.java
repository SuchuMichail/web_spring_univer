package com.student.demo.repositories;

import com.student.demo.entities.PostData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPostRepository extends JpaRepository<PostData,Long> {
}

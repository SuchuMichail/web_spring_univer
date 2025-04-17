package com.student.demo.repositories;

import com.student.demo.entities.PostData;
import com.student.demo.entities.UserData;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IUserRepository extends JpaRepository<UserData,Long> {
    @Transactional
    @Modifying
    @Query("SELECT ud FROM UserData AS ud")
    List<PostData> getLikedPosts();

    @Transactional
    @Modifying
    @Query("SELECT ud FROM UserData AS ud")
    List<PostData> getUserPosts();
}

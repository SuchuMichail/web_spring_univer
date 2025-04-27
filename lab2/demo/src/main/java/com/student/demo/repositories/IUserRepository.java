package com.student.demo.repositories;

import com.student.demo.entities.PostData;
import com.student.demo.entities.UserData;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IUserRepository extends JpaRepository<UserData,Long> {
    @Transactional
    @Modifying
    @Query("SELECT ud FROM UserData AS ud "+
            "WHERE ud.login = :login AND ud.password = :password")
    List<UserData> getUsersWithLP(@Param(value = "login") String login,
                                  @Param(value = "password") String password);

    @Transactional
    @Modifying
    @Query("SELECT ud FROM UserData AS ud "+
            "WHERE ud.id = :id")
    List<UserData> getUserById(@Param(value = "id") long id);

    @Transactional
    @Modifying
    @Query("SELECT ud FROM UserData AS ud "+
            "WHERE ud.login = :login")
    List<UserData> existsByLogin(@Param(value = "login") String login);


    @Transactional
    @Modifying
    @Query("SELECT ud FROM UserData AS ud "+
            "WHERE ud.login = :login")
    List<UserData> loadUserByLogin(@Param(value = "login") String login);
}

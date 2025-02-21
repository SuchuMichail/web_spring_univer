package org.example.repositories;

import jakarta.transaction.Transactional;
import org.example.entities.UserData;
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
    @Query("UPDATE UserData AS ud "+
            "SET ud.login = :login, "+
            "ud.password = :password, "+
            "ud.name = :name, "+
            "ud.surname = :surname, " +
            "ud.score = :score " +
            "WHERE ud.id = :id"
    )
    void editUser(@Param(value = "id") long id,
                  @Param(value = "login") String login,
                  @Param(value = "password") String password,
                  @Param(value = "name") String name,
                  @Param(value = "surname") String surname,
                  @Param(value = "score") int score);

    @Transactional
    @Modifying
    @Query("SELECT ud FROM UserData AS ud")
    List<UserData> getAllUsers();

    @Transactional
    @Modifying
    @Query("SELECT ud.id FROM UserData AS ud WHERE ud.login = :login AND ud.password = :password")
    List<Long> getUserId(@Param(value = "login") String login,
                  @Param(value = "password") String password);
}

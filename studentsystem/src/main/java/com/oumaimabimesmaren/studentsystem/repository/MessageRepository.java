package com.oumaimabimesmaren.studentsystem.repository;

import com.oumaimabimesmaren.studentsystem.model.Message;
import com.oumaimabimesmaren.studentsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReceiver(User receiver);
    List<Message> findBySender(User sender);
    List<Message> findByReceiverAndIsReadFalse(User receiver);
    int countByReceiverAndIsReadFalse(User receiver);

    @Modifying
    @Query("DELETE FROM Message m WHERE m.receiver = :receiver")
    void deleteByReceiver(@Param("receiver") User receiver);
}
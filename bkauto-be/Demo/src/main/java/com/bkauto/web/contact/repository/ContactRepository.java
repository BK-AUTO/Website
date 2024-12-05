package com.bkauto.web.contact.repository;

import com.bkauto.web.contact.entity.Contact;
import com.bkauto.web.news.entity.News;
import com.bkauto.web.news.repository.NewsSummaryProjection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query("SELECT n " +
            "FROM Contact n WHERE n.isDeleted = false ORDER BY n.publishDate DESC")
    List<Contact> findAllContact();
}

package com.bkauto.web.course.entity;

import lombok.*;
import org.hibernate.annotations.Type;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "course")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private int difficulty;
    private String topics;
    private Long price;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Lob
    @Type(type = "org.hibernate.type.ImageType")
    private byte[] thumbnail;
    private boolean isDeleted = false;

}

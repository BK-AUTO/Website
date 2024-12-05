package com.bkauto.web.research.entity;

import lombok.*;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.Instant;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "research")
public class Research {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String content;
    private Instant publishDate;
    @Lob
    @Type(type = "org.hibernate.type.ImageType")
    private byte[] thumbnail;
    private boolean isDeleted = false;

}

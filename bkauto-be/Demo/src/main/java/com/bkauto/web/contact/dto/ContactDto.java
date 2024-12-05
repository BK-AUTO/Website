package com.bkauto.web.contact.dto;

import com.bkauto.web.contact.entity.Contact;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactDto {

    private Long id;
    private String name;
    private String phone;
    private String email;
    private String address;
    private String message;
    private Instant publishDate;

    public static ContactDto convertToContactDTO(Contact contact) {
        return ContactDto.builder()
            .id(contact.getId())
            .name(contact.getName())
            .phone(contact.getPhone())
            .email(contact.getEmail())
            .address(contact.getAddress())
            .message(contact.getMessage())
            .publishDate(contact.getPublishDate())
            .build();
    }
}

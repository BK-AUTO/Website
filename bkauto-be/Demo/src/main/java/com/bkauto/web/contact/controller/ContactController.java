package com.bkauto.web.contact.controller;

import com.bkauto.web.contact.dto.ContactDto;
import com.bkauto.web.contact.entity.Contact;
import com.bkauto.web.contact.service.ContactService;
import java.time.Instant;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactDto> createContact(@RequestBody Contact contact) {
        contact.setPublishDate(Instant.now());
        Contact createdContact = contactService.saveContact(contact);
        return ResponseEntity.ok(ContactDto.convertToContactDTO(createdContact));
    }
}

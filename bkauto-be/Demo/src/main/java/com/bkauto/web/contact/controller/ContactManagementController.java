package com.bkauto.web.contact.controller;

import com.bkauto.web.contact.dto.ContactDto;
import com.bkauto.web.contact.entity.Contact;
import com.bkauto.web.contact.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/manage/contacts")
public class ContactManagementController {

    @Autowired
    private ContactService contactService;

    @GetMapping
    public List<ContactDto> getAllContact() {
        return contactService.getAllContacts();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        boolean isDeleted = contactService.deleteContact(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

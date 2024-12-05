package com.bkauto.web.contact.service;

import com.bkauto.web.contact.dto.ContactDto;
import com.bkauto.web.contact.entity.Contact;
import com.bkauto.web.contact.repository.ContactRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    public List<ContactDto> getAllContacts() {
        return contactRepository.findAllContact().stream()
            .map(ContactDto::convertToContactDTO)
            .collect(Collectors.toList());
    }

    public Contact saveContact(Contact contact) {
        return contactRepository.save(contact);
    }

    public boolean deleteContact(Long id) {
        return contactRepository.findById(id).map(contact -> {
            contact.setDeleted(true);
            contactRepository.save(contact);
            return true;
        }).orElse(false);
    }
}

package csd230.lab1.controllers;

import csd230.lab1.entities.TicketEntity;
import csd230.lab1.repositories.TicketEntityRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Ticket REST API", description = "JSON API for managing tickets")
@RestController
@RequestMapping("/api/rest/tickets")
public class TicketRestController {

    private final TicketEntityRepository repository;

    public TicketRestController(TicketEntityRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<TicketEntity> all() {
        return repository.findAll();
    }

    @PostMapping
    public TicketEntity newTicket(@RequestBody TicketEntity newTicket) {
        return repository.save(newTicket);
    }

    @GetMapping("/{id}")
    public TicketEntity one(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new TicketNotFoundException(id));
    }

    @PutMapping("/{id}")
    public TicketEntity replaceTicket(@RequestBody TicketEntity newTicket, @PathVariable Long id) {
        return repository.findById(id)
                .map(ticket -> {
                    ticket.setDescription(newTicket.getDescription());
                    ticket.setPrice(newTicket.getPrice());
                    return repository.save(ticket);
                })
                .orElseThrow(() -> new TicketNotFoundException(id));
    }

    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
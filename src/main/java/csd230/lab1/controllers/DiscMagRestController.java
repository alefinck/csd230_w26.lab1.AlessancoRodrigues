package csd230.lab1.controllers;

import csd230.lab1.entities.DiscMagEntity;
import csd230.lab1.repositories.DiscMagEntityRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Disc Magazine REST API", description = "JSON API for managing disc magazines")
@RestController
@RequestMapping("/api/rest/discmags")
public class DiscMagRestController {

    private final DiscMagEntityRepository repository;

    public DiscMagRestController(DiscMagEntityRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<DiscMagEntity> all() {
        return repository.findAll();
    }

    @PostMapping
    public DiscMagEntity newDiscMag(@RequestBody DiscMagEntity newDiscMag) {
        return repository.save(newDiscMag);
    }

    @GetMapping("/{id}")
    public DiscMagEntity one(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new DiscMagNotFoundException(id));
    }

    @PutMapping("/{id}")
    public DiscMagEntity replaceDiscMag(@RequestBody DiscMagEntity newDiscMag, @PathVariable Long id) {
        return repository.findById(id)
                .map(discMag -> {
                    discMag.setTitle(newDiscMag.getTitle());
                    discMag.setPrice(newDiscMag.getPrice());
                    discMag.setCopies(newDiscMag.getCopies());
                    discMag.setOrderQty(newDiscMag.getOrderQty());
                    discMag.setCurrentIssue(newDiscMag.getCurrentIssue());
                    discMag.setHasDisc(newDiscMag.getHasDisc());
                    return repository.save(discMag);
                })
                .orElseThrow(() -> new DiscMagNotFoundException(id));
    }

    @DeleteMapping("/{id}")
    public void deleteDiscMag(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
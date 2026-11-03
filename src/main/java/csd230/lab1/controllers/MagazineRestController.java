package csd230.lab1.controllers;

import csd230.lab1.entities.MagazineEntity;
import csd230.lab1.repositories.MagazineEntityRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Magazine REST API", description = "JSON API for managing magazines")
@RestController
@RequestMapping("/api/rest/magazines")
public class MagazineRestController {

    private final MagazineEntityRepository repository;

    public MagazineRestController(MagazineEntityRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<MagazineEntity> all() {
        return repository.findAll();
    }

    @PostMapping
    public MagazineEntity newMagazine(@RequestBody MagazineEntity newMagazine) {
        return repository.save(newMagazine);
    }

    @GetMapping("/{id}")
    public MagazineEntity one(@PathVariable Long id) {
        return repository.findById(id).orElseThrow(() -> new MagazineNotFoundException(id));
    }

    @PutMapping("/{id}")
    public MagazineEntity replaceMagazine(@RequestBody MagazineEntity newMagazine, @PathVariable Long id) {
        return repository.findById(id)
                .map(magazine -> {
                    magazine.setTitle(newMagazine.getTitle());
                    magazine.setPrice(newMagazine.getPrice());
                    magazine.setCopies(newMagazine.getCopies());
                    magazine.setOrderQty(newMagazine.getOrderQty());
                    magazine.setCurrentIssue(newMagazine.getCurrentIssue());
                    return repository.save(magazine);
                })
                .orElseThrow(() -> new MagazineNotFoundException(id));
    }

    @DeleteMapping("/{id}")
    public void deleteMagazine(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
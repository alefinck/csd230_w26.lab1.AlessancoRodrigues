package csd230.lab1.controllers;

import csd230.lab1.entities.CartEntity;
import csd230.lab1.entities.UserEntity;
import csd230.lab1.repositories.CartEntityRepository;
import csd230.lab1.repositories.ProductEntityRepository;
import csd230.lab1.repositories.UserEntityRepository;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/rest/carts")
public class CartRestController {

    private final CartEntityRepository repository;
    private final UserEntityRepository userRepository;
    private final ProductEntityRepository productRepository;

    public CartRestController(CartEntityRepository repository,
                              UserEntityRepository userRepository,
                              ProductEntityRepository productRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @PostMapping("/mine/products/{productId}")
    @Transactional
    @Operation(summary = "Add an existing product to the signed-in user's cart")
    public CartEntity addMine(@PathVariable Long productId, Principal principal) {
        var user = currentUser(principal, true);
        var product = productRepository.findById(productId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND));
        CartEntity cart = repository.findByUser(user);
        if (cart == null) {
            cart = new CartEntity();
            cart.setUser(user);
        }
        cart.addProduct(product);
        return repository.save(cart);
    }

    private UserEntity currentUser(Principal principal, boolean forUpdate) {
        var user = principal == null ? null : forUpdate
                ? userRepository.findForCartUpdate(principal.getName())
                : userRepository.findByUsername(principal.getName());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

    @GetMapping("/mine")
    @Transactional(readOnly = true)
    @Operation(summary = "Read the signed-in user's cart; 204 if none has been created")
    public ResponseEntity<CartEntity> mine(Principal principal) {
        CartEntity cart = repository.findByUser(currentUser(principal, false));
        return cart == null ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(cart);
    }

    @DeleteMapping("/mine/products/{productId}")
    @Transactional
    @Operation(summary = "Remove a product from the signed-in user's cart")
    public ResponseEntity<CartEntity> removeMine(
            @PathVariable Long productId, Principal principal) {
        var user = currentUser(principal, true);
        var product = productRepository.findById(productId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND));
        CartEntity cart = repository.findByUser(user);
        if (cart == null) {
            return ResponseEntity.noContent().build();
        }
        cart.getProducts().remove(product);
        product.getCarts().remove(cart);
        return ResponseEntity.ok(cart);
    }

    @GetMapping
    @Transactional(readOnly = true)
    @Operation(summary = "List all carts (admin)")
    public List<CartEntity> all() {
        return repository.findAll();
    }
}